import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CVName } from "components/inputs/inputsCV/CVName";
import {
  BtnG1,
  BtnGb1,
  BtnGb2,
  BtnGr1,
  BtnGr2,
} from "components/myComponents/btn/MyGradientButton";
import { useAuthState } from "context/auth";
import { icfy, icfyHAMBURGER } from "icones";
import { styles } from "styles/style";
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
                  <BtnGr1
                    setter={openConnectModal}
                    style={"   z-10 relative btn-sm "}
                  >
                    <Icon icon={icfy.ux.enter} className="text-lg " /> Connect
                    Wallet
                  </BtnGr1>
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
                // <div
                //   className="cta-button project-owner font-light border-none btn normal-case font2"
                //   style={{ display: "flex", gap: 12 }}
                // >
                <BtnGb1
                  style={
                    "font-light relative z-10 btn-sm border-box normal-case pl-0 overflow-hidden"
                  }
                >
                  <div className="bg-zinc-900 h-full flex items-center pl-4 pr-5 justify-between ">
                    {drawerBtn}
                  </div>
                  <div
                    className="flex items-center"
                    // className="bg-zinc-900 h-full flex items-center px-5 justify-between  rounded-lg"
                  >
                    <CVName metadata={metadatas} styles=" mx-4" />
                    <div className="" onClick={openAccountModal}>
                      {account.displayBalance
                        ? ` ${account.displayBalance}`
                        : ""}
                    </div>
                  </div>
                </BtnGb1>
                // </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
