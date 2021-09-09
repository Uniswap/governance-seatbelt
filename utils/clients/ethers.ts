import { providers } from "ethers";
import { INFURA_API_KEY } from "../constants";

export const provider = new providers.InfuraProvider(1, INFURA_API_KEY);
