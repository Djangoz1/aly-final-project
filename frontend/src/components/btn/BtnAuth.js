import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CVName } from "components/inputs/inputsCV/CVName";
import { useAuthState } from "context/auth";
import { icfy, icfyHAMBURGER } from "icones";
export const BtnAuth = ({ drawerBtn }) => {
  const { metadatas } = useAuthState();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="btn gradient-button border-none font2"
                    onClick={openConnectModal}
                    type="button"
                  >
                    <Icon icon={icfy.ux.enter} className="text-lg" /> Connect
                    Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div
                  className="cta-button project-owner font-light border-none btn normal-case font2"
                  style={{ display: "flex", gap: 12 }}
                >
                  {drawerBtn}

                  <button
                    className="font2"
                    onClick={openAccountModal}
                    type="button"
                  >
                    <span className="font-black">{metadatas?.username}</span>
                    {account.displayBalance ? ` ${account.displayBalance}` : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
