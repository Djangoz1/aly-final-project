import { Icon } from "@iconify/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CVName } from "components/links/CVName";
import {
  BtnG1,
  BtnGb1,
  BtnGb2,
  BtnGr1,
  BtnGr2,
} from "components/myComponents/btn/MyGradientButton";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Avatar } from "components/profile/ProfileAvatar";
import { useAuthState } from "context/auth";
import { icfy, icfyHAMBURGER } from "icones";
import { styles } from "styles/style";
export const BtnAuth = () => {
  const { metadatas, cv } = useAuthState();
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
              if (!cv) {
                return (
                  <MyMainBtn
                    style={"uppercase font-extralight"}
                    icon={false}
                    url={`/create/profile`}
                    color={5}
                  >
                    Create account
                  </MyMainBtn>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
