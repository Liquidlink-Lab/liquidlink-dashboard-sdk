# Liquidlink Dashboard SDK

A lightweight TypeScript client for the Liquidlink Dashboard API. It wraps the HTTP requests with typed helpers, sane defaults, and minimal dependencies so you can fetch wallet valuations in a few lines of code.

## Installation

```bash
npm install @liquidlink-lab/liquidlink-dashboard-sdk
# or: pnpm add | yarn add | bun add @liquidlink-lab/liquidlink-dashboard-sdk
```

## Requesting API Access

1. Reach out to the Liquidlink team via [liquidlink.io@gmail.com](mailto:liquidlink.io@gmail.com) or your existing Liquidlink contact.
2. Share your project name and a short description of how you plan to use the dashboard data.
3. The team will provision an API key and, if needed, whitelist your origin IPs.
4. Keep the issued API key secret; rotate or revoke it by contacting the team again.

## Usage

```ts
import { LiquidlinkDashboardSDK } from "@liquidlink-lab/liquidlink-dashboard-sdk";

const sdk = new LiquidlinkDashboardSDK({
  apiKey: process.env.LIQUIDLINK_DASHBOARD_API_KEY!,
  // Optional overrides:
  // baseUrl: "https://price-indexer-api.vercel.app",
  // timeoutMs: 10_000,
});

const walletValues = await sdk.walletsTokenValue({
  addresses: ["ADDR1", "ADDR2"],
});

console.log(walletValues);
```

### Returned Data

The SDK surfaces the parsed `data` payload from the API as strongly-typed objects:

```ts
type WalletsTokenValueResponse = Array<{
  address: string;
  assets: Array<{
    tokenAddress: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    balanceRaw: string;
    price: number;
    value: number;
    iconUrl: string;
  }>;
  totalCoinValue: number;
}>;

type WalletValue = WalletsTokenValueResponse[number];
type WalletAsset = WalletValue["assets"][number];
```

`walletsTokenValue` resolves with `WalletsTokenValueResponse`, in the same order as the input addresses. Unsupported addresses return empty `assets` arrays with a `totalCoinValue` of `0`.

```json
[
  {
    "address": "ADDR1",
    "assets": [
      {
        "tokenAddress": "0x2::iota::IOTA",
        "name": "IOTA",
        "symbol": "IOTA",
        "decimals": 9,
        "balance": "0.046421026",
        "balanceRaw": "46421026",
        "price": 0.13390003,
        "value": 0.00621577677403078,
        "iconUrl": "https://iota.org/logo.png"
      }
    ],
    "totalCoinValue": 0.00621577677403078
  },
  {
    "address": "ADDR2",
    "assets": [
      {
        "tokenAddress": "0x2::iota::IOTA",
        "name": "IOTA",
        "symbol": "IOTA",
        "decimals": 9,
        "balance": "9.270060003",
        "balanceRaw": "9270060003",
        "price": 0.13390003,
        "value": 1.2412613125035001,
        "iconUrl": "https://iota.org/logo.png"
      },
      {
        "tokenAddress": "0x346778989a9f57480ec3fee15f2cd68409c73a62112d40a3efd13987997be68c::cert::CERT",
        "name": "Staked IOTA",
        "symbol": "stIOTA",
        "decimals": 9,
        "balance": "6.63505586",
        "balanceRaw": "6635055860",
        "price": 0.1432198353295457,
        "value": 0.9502716076715373,
        "iconUrl": "https://swirlstake.com/logo.svg"
      },
      {
        "tokenAddress": "0x387c459c5c947aac7404e53ba69541c5d64f3cf96f3bc515e7f8a067fb725b54::ibtc::IBTC",
        "name": "IOTA Bitcoin",
        "symbol": "iBTC",
        "decimals": 10,
        "balance": "0.0005074026",
        "balanceRaw": "5074026",
        "price": 108045.01999999,
        "value": 54.82232406504693,
        "iconUrl": "https://assets.echo-protocol.xyz/ibtc.svg"
      },
      {
        "tokenAddress": "0xd3b63e603a78786facf65ff22e79701f3e824881a12fa3268d62a75530fe904f::vusd::VUSD",
        "name": "Virtue USD",
        "symbol": "VUSD",
        "decimals": 6,
        "balance": "1.743489",
        "balanceRaw": "1743489",
        "price": 0.9815755226609039,
        "value": 1.7113661264285367,
        "iconUrl": "https://aqua-natural-grasshopper-705.mypinata.cloud/ipfs/bafkreidw4fvazp2uotvg3lxeat4c5l4aphdwtzhek73ry7hbca7wuaezmy"
      }
    ],
    "totalCoinValue": 58.7252231116505
  }
]
```

### Error Handling

- Network issues or timeouts reject with the underlying `undici` error.
- Missing or invalid parameters (for example, omitting `addresses`) surface as 4xx responses that the SDK rethrows with the `[LiquidlinkDashboardSDK]` prefix and API `message`.
- Other non-2xx HTTP responses throw an `Error` prefixed with `[LiquidlinkDashboardSDK]` and populated with the API's `message` field when available.
- If the API responds with malformed JSON, an `Error` with message `Invalid JSON: ...` is thrown.

Wrap calls in `try/catch` if you need to branch on failure:

```ts
try {
  const values = await sdk.walletsTokenValue({ addresses: ["0x...", "0x..."] });
  // handle values
} catch (err) {
  console.error("Failed to load wallet values:", err);
}
```

## API Reference

```ts
new LiquidlinkDashboardSDK(options);
```

```ts
type ClientOptions = {
  apiKey: string;
  baseUrl?: string; // default: https://price-indexer-api.vercel.app
  timeoutMs?: number; // default: 10_000 (ms)
};
```

```ts
sdk.walletsTokenValue(params: { addresses: string[] }): Promise<WalletsTokenValueResponse>
```

## License

MIT
