"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { LensClient, development } from "@lens-protocol/client";

const lensClient = new LensClient({
  environment: development,
});
const { chains, publicClient, webSocketPublicClient } = configureChains(
  // [hardhat],
  [polygonMumbai],
  [
    //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "dd7425657f4fc28fd70a178c2a6ee85c",
  chains,
});

const wagmiConfig = createConfig({
  //
  autoConnect: true,
  publicClient,
  // webSocketPublicClient,
  connectors,
});

export const AccountProvider = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      {/* <LensProvider config={lensConfig}> */}
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      {/* </LensProvider> */}
    </WagmiConfig>
  );
};
