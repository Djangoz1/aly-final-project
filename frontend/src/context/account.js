"use client";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { CONFIG, configs } from "constants/config";

const { chains, publicClient } = configureChains(configs[CONFIG].chain, [
  //alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "dd7425657f4fc28fd70a178c2a6ee85c",
  chains,
});

const wagmiConfig = createConfig({
  //
  autoConnect: true,
  connectors,
  publicClient,
});

export const AccountProvider = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};
