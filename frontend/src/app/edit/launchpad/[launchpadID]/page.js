"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import React, { useEffect, useState } from "react";

import { _form_create_profile } from "utils/ux-tools/form/profile";
import { MySteps } from "components/myComponents/MySteps";
import { MENUS } from "constants/menus";
import { useAccount } from "wagmi";

import {
  moock_create_launchpad,
  moock_create_launchpad_checked,
  moock_create_launchpad_placeholder,
  moock_create_launchpad_superchecked,
} from "constants/moock";

import {
  _apiGet,
  _apiGetAt,
  _apiPost,
  _apiPostAt,
} from "utils/ui-tools/web3-tools";
import { useAuthDispatch, useAuthState } from "context/auth";
import { createURILaunchpad } from "utils/ui-tools/pinata-tools";

import {
  MENU_LAUNCHPAD,
  _form_create_launchpad,
} from "utils/ux-tools/form/launchpad";

import { ethers } from "ethers";
import { Icon } from "@iconify/react";
import { icfy, icfyROCKET } from "icones";
import { styles, themes } from "styles/style";
import { ADDRESSES } from "constants/web3";
import { MyFormCreate } from "components/myComponents/form/MyForm";
import {
  FormCreateLaunchpad1,
  FormCreateLaunchpad2,
  FormCreateLaunchpad3,
} from "sections/Launchpad/form/FormCreateLaunchpad";
import { MyInput } from "components/myComponents/form/MyInput";
import { useToolsState } from "context/tools";
import { stateLaunchpad } from "utils/ui-tools/state-tools";

const PageInvestToken = ({ params }) => {
  const launchpadID = params.launchpadID;
  let { address, isConnected } = useAccount();
  let { state } = useToolsState();
  let dispatch = useAuthDispatch();

  let submitInvest = async (form) => {
    console.log("form", form);
    let value = ethers.utils.parseEther(form?.value)._hex;
    let hash = await _apiPost("buyTokens", [parseInt(launchpadID)], value);
    console.log(hash);
  };

  let { cv, metadatas } = useAuthState();
  let [isState, setIsState] = useState(null);
  let stateInit = async () =>
    setIsState({
      launchpad: await stateLaunchpad(launchpadID),
    });

  useEffect(() => {
    if (!isState) stateInit();
  }, [launchpadID]);
  _form_create_launchpad[0].title = `Hello ${metadatas?.username} ! 👋`;
  console.log("is state", isState);
  return (
    <MyLayoutApp
      id={launchpadID}
      url={"/edit/launchpad/" + launchpadID}
      initState={isState}
    >
      <MyFormCreate
        title={"Invest on token"}
        submit={submitInvest}
        components={[
          {
            component: (
              <MyInput
                min={ethers.utils.formatEther(
                  state?.launchpad?.datas?.minInvest || 0
                )}
                max={ethers.utils.formatEther(
                  state?.launchpad?.datas?.maxInvest || 0
                )}
                step={0.1}
                type={"number"}
                target={"value"}
              />
            ),
            label: "Invest",
          },
        ]}
        arr={[
          {
            title: (
              <span className={"flex"}>
                <Icon icon={icfyROCKET} className="text-error mr-4" /> Invest on
                launchpad
              </span>
            ),
            description: (
              <>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                harum beatae earum, placeat repellendus sequi reprehenderit
                libero necessitatibus magni voluptate sint aut! Labore aut sint
                suscipit fugit reiciendis. Aliquam, explicabo!
              </>
            ),
          },
        ]}
        stateInit={{
          form: {
            target: "Invest",
            value: null,
          },
          placeholders: {
            value: "300 ETH",
          },
        }}
        btn={"Participate"}
      />
    </MyLayoutApp>
  );
};

export default PageInvestToken;
