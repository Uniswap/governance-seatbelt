import { getAddress } from '@ethersproject/address'
import { getContractName } from '../utils/clients/tenderly'
import { bullet } from '../presentation/report'
import { AssetChange, ProposalCheck } from '../types'

/**
 * Reports ERC20/ERC721/native asset movements from Tenderly asset_changes.
 * Higher-level companion to checkStateChanges (see issue #112).
 */
export const checkAssetChanges: ProposalCheck = {
  name: 'Reports asset balance changes from the proposal',
  async checkProposal(proposal, sim, deps) {
    const info: string[] = []
    const warnings: string[] = []

    if (!sim.transaction.status) {
      const txInfo = sim.transaction.transaction_info
      const reason = txInfo.stack_trace ? txInfo.stack_trace[0].error_reason : 'unknown error'
      return { info: [], warnings: [], errors: [`Transaction reverted with reason: ${reason}`] }
    }

    const assetChanges = sim.transaction.transaction_info.asset_changes
    if (!assetChanges || assetChanges.length === 0) {
      return { info: ['No asset balance changes'], warnings: [], errors: [] }
    }

    // Group movements by the token contract (or "Native" when there is none).
    const byToken: Record<string, AssetChange[]> = {}
    for (const change of assetChanges) {
      const tokenAddr = change.token_info?.contract_address
      const key = tokenAddr ? getAddress(tokenAddr) : 'Native'
      if (!byToken[key]) byToken[key] = []
      byToken[key].push(change)
    }

    for (const [tokenKey, changes] of Object.entries(byToken)) {
      const sample = changes[0]
      const symbol = sample.token_info?.symbol || sample.token_info?.name
      if (tokenKey === 'Native') {
        info.push(bullet(symbol ? `Native (${symbol})` : 'Native currency'))
      } else {
        const contract = sim.contracts.find((c) => getAddress(c.address) === tokenKey)
        const label = symbol
          ? `${symbol} (\`${tokenKey}\`)`
          : getContractName(contract) || `\`${tokenKey}\``
        info.push(bullet(label))
      }

      for (const change of changes) {
        const kind = change.type || 'Transfer'
        const amount = change.amount ?? change.raw_amount ?? '?'
        const from = change.from ? shorten(change.from) : '(mint)'
        const to = change.to ? shorten(change.to) : '(burn)'
        const usd =
          change.dollar_value && change.dollar_value !== '0'
            ? ` (~$${change.dollar_value})`
            : ''
        info.push(bullet(`\`${kind}\` ${amount}${usd}: \`${from}\` → \`${to}\``, 1))
      }
    }

    // Surface net dollar balance shifts when Tenderly provides them.
    const balanceChanges = sim.transaction.transaction_info.balance_changes
    if (balanceChanges && balanceChanges.length > 0) {
      info.push(bullet('Net dollar balance changes'))
      for (const bc of balanceChanges) {
        const addr = bc.address ? shorten(bc.address) : '?'
        const usd = bc.dollar_value ?? '0'
        // Skip noise for governor/timelock bookkeeping if dollar value is ~0
        const isGov = deps.governor && getAddress(bc.address) === getAddress(deps.governor.address)
        const isTl = deps.timelock && getAddress(bc.address) === getAddress(deps.timelock.address)
        if ((isGov || isTl) && (!bc.dollar_value || Number(bc.dollar_value) === 0)) continue
        info.push(bullet(`\`${addr}\`: $${usd}`, 1))
      }
    }

    return { info, warnings, errors: [] }
  },
}

function shorten(addr: string): string {
  try {
    const a = getAddress(addr)
    return `${a.slice(0, 6)}…${a.slice(-4)}`
  } catch {
    return addr
  }
}
