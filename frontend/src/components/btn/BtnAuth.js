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
import { Avatar } from "components/profile/ProfileAvatar";
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
            className="w-full"
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
                    onClick={openConnectModal}
                    className="c1 whiteglass-text py-2  hover:text-success transition-all flex items-center"
                  >
                    <Icon icon={icfy.ux.enter} className="mr-3" /> Connect
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
                // <div
                //   className="cta-button project-owner font-light border-none btn normal-case font2"
                //   style={{ display: "flex", gap: 12 }}
                // >
                <div
                  className={
                    "py-1 whiteglass-text  w-full flex c1 shadow relative mt-3 z-10 border  border-white/5 h-fit rounded-lg   normal-case "
                  }
                >
                  <Avatar
                    metadatas={metadatas}
                    CID={metadatas?.avatar}
                    style={"w-12 ml-2 mr-4 rounded-full"}
                  />
                  <div
                    className="flex flex-col text-xs justify-center items-start"
                    // className="backdrop-blur  h-full flex items-center px-5 justify-between  rounded-lg"
                  >
                    <CVName metadata={metadatas} styles=" " />
                    <div className="" onClick={openAccountModal}>
                      {account.displayBalance
                        ? ` ${account.displayBalance}`
                        : ""}
                    </div>
                  </div>
                </div>
                // </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
