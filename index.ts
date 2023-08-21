/**
 * @notice Entry point for executing a single proposal against a forked mainnet
 */

import dotenv from 'dotenv'
dotenv.config()
import { BigNumber, BigNumberish, Contract } from 'ethers'
import { DAO_NAME, GOVERNOR_ADDRESS, SIM_NAME } from './utils/constants'
import { arb1provider, l1provider, provider } from './utils/clients/ethers'
import { simulate } from './utils/clients/tenderly'
import {
  AllCheckResults,
  GovernorType,
  SimulationConfig,
  SimulationConfigBase,
  SimulationConfigArbL2ToL1,
  SimulationData,
  SimulationResult,
  SimulationConfigArbRetryable,
} from './types'
import ALL_CHECKS from './checks'
import { generateAndSaveReports } from './presentation/report'
import { PROPOSAL_STATES } from './utils/contracts/governor-bravo'
import {
  formatProposalId,
  getGovernor,
  getProposalIds,
  getTimelock,
  inferGovernorType,
} from './utils/contracts/governor'
import { getAddress } from '@ethersproject/address'
import { SubmitRetryableMessageDataParser } from '@arbitrum/sdk/dist/lib/message/messageDataParser'
import { Inbox__factory } from '@arbitrum/sdk/dist/lib/abi/factories/Inbox__factory'
import { Bridge__factory } from '@arbitrum/sdk/dist/lib/abi/factories/Bridge__factory'
import { ArbSys__factory } from '@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory'
import { EventArgs, parseTypedLogs } from '@arbitrum/sdk/dist/lib/dataEntities/event'
import { InboxMessageDeliveredEvent } from '@arbitrum/sdk/dist/lib/abi/Inbox'
import { MessageDeliveredEvent } from '@arbitrum/sdk/dist/lib/abi/Bridge'
import { InboxMessageKind } from '@arbitrum/sdk/dist/lib/dataEntities/message'
import { getL2Network } from '@arbitrum/sdk'

// This function find L2ToL1 events in a simulation result and create a new simulation for each of them
async function simL2toL1(sr: SimulationResult, simname: string) {
  const { proposal, sim } = sr
  const parentId = proposal.id!

  const rawlog = sim.transaction.transaction_info.logs?.map((l) => l.raw)
  if(!rawlog) return []
  const L2ToL1TxEvents = parseTypedLogs(ArbSys__factory, rawlog as any, 'L2ToL1Tx')

  const simresults = []
  let offset = 1
  for (const l2ToL1TxEvent of L2ToL1TxEvents) {
    const l2tol1config: SimulationConfigArbL2ToL1 = {
      type: 'arbl2tol1',
      daoName: simname,
      governorType: 'arb',
      governorAddress: '0xf07ded9dc292157749b6fd268e37df6ea38395b9',
      targets: [l2ToL1TxEvent.destination], // Array of targets to call.
      values: [l2ToL1TxEvent.callvalue], // Array of values with each call.
      signatures: [''], // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
      calldatas: [l2ToL1TxEvent.data], // Array of encoded calldatas.
      description: 'The is the L1 Timelock Execution of simulation ' + parentId.toHexString(),
      parentId: parentId,
      idoffset: offset,
    }
    offset += 1000000 // reserve spaces for retryable exections
    const { sim, proposal, latestBlock } = await simulate(l2tol1config)
    simresults.push({ sim, proposal, latestBlock, config: l2tol1config })
  }
  return simresults
}

// This function find retryable in a simulation result and create a new simulation for each of them
async function simRetryable(sr: SimulationResult, simname: string) {
  const { proposal, sim } = sr
  const parentId = proposal.id!

  const rawlog = sim.transaction.transaction_info.logs?.map((l) => l.raw)
  if(!rawlog) return []
  const bridgeMessages = parseTypedLogs(Bridge__factory, rawlog as any, 'MessageDelivered')
  const inboxMessages = parseTypedLogs(Inbox__factory, rawlog as any, 'InboxMessageDelivered(uint256,bytes)')
  if (bridgeMessages.length !== inboxMessages.length) {
    throw new Error('Unexpected number of message delivered events')
  }

  // TODO: Only Arb1 is supported right now
  const messages: {
    inboxMessageEvent: EventArgs<InboxMessageDeliveredEvent>
    bridgeMessageEvent: EventArgs<MessageDeliveredEvent>
  }[] = []
  for (const bm of bridgeMessages) {
    if (bm.inbox !== (await getL2Network(arb1provider as any)).ethBridge.inbox) continue // arb1 inbox
    const im = inboxMessages.filter((i) => i.messageNum.eq(bm.messageIndex))[0]
    if (!im) {
      throw new Error(
        `Unexepected missing event for message index: ${bm.messageIndex.toString()}. ${JSON.stringify(inboxMessages)}`
      )
    }
    messages.push({
      inboxMessageEvent: im,
      bridgeMessageEvent: bm,
    })
  }
  const simresults = []
  let offset = 10000
  for (const { inboxMessageEvent, bridgeMessageEvent } of messages) {
    if (bridgeMessageEvent.kind === InboxMessageKind.L1MessageType_submitRetryableTx) {
      const parser = new SubmitRetryableMessageDataParser()
      const parsedRetryable = parser.parse(inboxMessageEvent.data)

      const l2tol1config: SimulationConfigArbRetryable = {
        type: 'arbretryable',
        from: bridgeMessageEvent.sender,
        daoName: simname,
        governorType: 'arb',
        governorAddress: '0xf07ded9dc292157749b6fd268e37df6ea38395b9',
        targets: [parsedRetryable.destAddress], // Array of targets to call.
        values: [parsedRetryable.l2CallValue], // Array of values with each call.
        signatures: [''], // Array of function signatures. Leave empty if generating calldata with ethers like we do here.
        calldatas: [parsedRetryable.data], // Array of encoded calldatas.
        description: 'The is the L2 Retryable Execution of simulation ' + parentId.toHexString(),
        parentId: parentId,
        idoffset: offset,
      }
      offset += 10000
      const { sim, proposal, latestBlock } = await simulate(l2tol1config)
      simresults.push({ sim, proposal, latestBlock, config: l2tol1config })
    }
  }
  return simresults
}

/**
 * @notice Simulate governance proposals and run proposal checks against them
 */
async function main() {
  // --- Run simulations ---
  // Prepare array to store all simulation outputs
  const simOutputs: SimulationData[] = []

  let governor: Contract
  let governorType: GovernorType

  // Determine if we are running a specific simulation or all on-chain proposals for a specified governor.
  if (SIM_NAME) {
    // If a SIM_NAME is provided, we run that simulation
    const configPath = `./sims/${SIM_NAME}.sim.ts`
    const config: SimulationConfig = await import(configPath).then((d) => d.config) // dynamic path `import` statements not allowed

    const { sim, proposal, latestBlock } = await simulate(config)
    simOutputs.push({ sim, proposal, latestBlock, config })

    if ((config.type === 'new' || config.type === 'proposed') && config.governorType === 'arb') {
      const l2tol1sims = await simL2toL1({ sim, proposal, latestBlock }, config.daoName)
      for (const l2tol1sim of l2tol1sims) {
        simOutputs.push(l2tol1sim!)
        const retryablesims = await simRetryable(
          { sim: l2tol1sim!.sim, proposal: l2tol1sim!.proposal, latestBlock: l2tol1sim!.latestBlock },
          config.daoName
        )
        for (const retryablesim of retryablesims) {
          simOutputs.push(retryablesim!)
        }
      }
    } else {
      const retryablesims = await simRetryable({ sim, proposal, latestBlock }, config.daoName)
      for (const retryablesim of retryablesims) {
        simOutputs.push(retryablesim!)
      }
    }

    governorType = await inferGovernorType(config.governorAddress)
    governor = await getGovernor(governorType, config.governorAddress)
  } else {
    // If no SIM_NAME is provided, we get proposals to simulate from the chain
    if (!GOVERNOR_ADDRESS) throw new Error('Must provider a GOVERNOR_ADDRESS')
    if (!DAO_NAME) throw new Error('Must provider a DAO_NAME')
    const latestBlock = await provider.getBlock('latest')

    // Fetch all proposal IDs
    governorType = await inferGovernorType(GOVERNOR_ADDRESS)
    const proposalIds = await getProposalIds(governorType, GOVERNOR_ADDRESS, latestBlock.number)
    governor = getGovernor(governorType, GOVERNOR_ADDRESS)

    // If we aren't simulating all proposals, filter down to just the active ones. For now we
    // assume we're simulating all by default
    const states = await Promise.all(proposalIds.map((id) => governor.state(id)))
    const simProposals: { id: BigNumber; simType: SimulationConfigBase['type'] }[] = proposalIds.map((id, i) => {
      // If state is `Executed` (state 7), we use the executed sim type and effectively just
      // simulate the real transaction. For all other states, we use the `proposed` type because
      // state overrides are required to simulate the transaction
      const state = String(states[i]) as keyof typeof PROPOSAL_STATES
      const isExecuted = PROPOSAL_STATES[state] === 'Executed'
      return { id, simType: isExecuted ? 'executed' : 'proposed' }
    })
    const simProposalsIds = simProposals.map((sim) => sim.id)

    // Simulate them
    // We intentionally do not run these in parallel to avoid hitting Tenderly API rate limits or flooding
    // them with requests if we e.g. simulate all proposals for a governor (instead of just active ones)
    const numProposals = simProposals.length
    console.log(
      `Simulating ${numProposals} ${DAO_NAME} proposals: IDs of ${simProposalsIds
        .map((id) => formatProposalId(governorType, id))
        .join(', ')}`
    )

    for (const simProposal of simProposals) {
      if (simProposal.simType === 'new') throw new Error('Simulation type "new" is not supported in this branch')
      // Determine if this proposal is already `executed` or currently in-progress (`proposed`)
      console.log(`  Simulating ${DAO_NAME} proposal ${simProposal.id}...`)
      const config: SimulationConfig = {
        type: simProposal.simType,
        daoName: DAO_NAME,
        governorAddress: getAddress(GOVERNOR_ADDRESS),
        governorType,
        proposalId: simProposal.id,
      }

      const { sim, proposal, latestBlock } = await simulate(config)
      simOutputs.push({ sim, proposal, latestBlock, config })

      const l2tol1sims = await simL2toL1({ sim, proposal, latestBlock }, config.daoName)
      for (const l2tol1sim of l2tol1sims) {
        simOutputs.push(l2tol1sim!)
        const retryablesims = await simRetryable(
          { sim: l2tol1sim!.sim, proposal: l2tol1sim!.proposal, latestBlock: l2tol1sim!.latestBlock },
          config.daoName
        )
        for (const retryablesim of retryablesims) {
          simOutputs.push(retryablesim!)
        }
      }
      console.log(`    done`)
    }
  }

  // --- Run proposal checks and save output ---
  // Generate the proposal data and dependencies needed by checks
  const proposalData = { governor, provider, timelock: await getTimelock(governorType, governor.address) }

  console.log('Starting proposal checks and report generation...')
  for (const simOutput of simOutputs) {
    // Run checks
    const { sim, proposal, latestBlock, config } = simOutput
    console.log(`  Running for proposal ID ${formatProposalId(governorType, proposal.id!)}...`)
    const checkResults: AllCheckResults = Object.fromEntries(
      await Promise.all(
        Object.keys(ALL_CHECKS).map(async (checkId) => [
          checkId,
          {
            name: ALL_CHECKS[checkId].name,
            result: await ALL_CHECKS[checkId].checkProposal(proposal, sim, proposalData),
          },
        ])
      )
    )

    // Generate markdown report.
    const [startBlock, endBlock] = await Promise.all([
      proposal.startBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.startBlock.toNumber()) : null,
      proposal.endBlock.toNumber() <= latestBlock.number ? provider.getBlock(proposal.endBlock.toNumber()) : null,
    ])

    // Save markdown report to a file.
    // GitHub artifacts are flattened (folder structure is not preserved), so we include the DAO name in the filename.
    const dir = `./reports/${config.daoName}/${config.governorAddress}`
    await generateAndSaveReports(
      governorType,
      { start: startBlock, end: endBlock, current: latestBlock },
      proposal,
      checkResults,
      dir,
      sim.simulation.id
    )
  }
  console.log('Done!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
