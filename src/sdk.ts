import { API_VERSION, BASE_URL, type ClientOptions, LiquidlinkDashboardClient } from "./client";

/**
 * Liquidlink Dashboard SDK
 */
export class LiquidlinkDashboardSDK {
  private client: LiquidlinkDashboardClient;

  constructor(opts: ClientOptions) {
    if (!opts.apiKey) {
      throw new Error("[LiquidlinkDashboardSDK] apiKey is required");
    }

    this.client = new LiquidlinkDashboardClient({
      baseUrl: opts.baseUrl ?? BASE_URL,
      timeoutMs: opts.timeoutMs,
      apiKey: opts.apiKey,
    });
  }

  /**
   * Fetches the token value for a list of addresses
   * @param params - object containing addresses to fetch token value for
   * @returns Promise<WalletValue[]> - resolves with an array of WalletValue objects
   */
  walletsTokenValue(params: { addresses: string[] }) {
    return this.client.getJSON<
      {
        address: string;
        assets: {
          tokenAddress: string;
          name: string;
          symbol: string;
          decimals: number;
          balance: string;
          balanceRaw: string;
          price: number;
          value: number;
          iconUrl: string;
        }[];
        totalCoinValue: number;
      }[]
    >(`/api/${API_VERSION}/wallet/value`, params);
  }
}
