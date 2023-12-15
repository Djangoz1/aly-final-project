"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import React, { useEffect, useState } from "react";

import { _form_create_profile } from "utils/ux-tools/form/profile";

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
  _apiPostPayable,
} from "utils/ui-tools/web3-tools";
import { useAuthDispatch, useAuthState } from "context/auth";
import { clientPocket, createURILaunchpad } from "utils/ui-tools/pinata-tools";

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
import { createURI } from "utils/controllers";

const PageCreateLaunchpad = () => {
  let { address, isConnected } = useAccount();
  let { cv, metadatas } = useAuthState();

  let dispatch = useAuthDispatch();
  let [isPrice, setIsPrice] = useState(null);
  let submitForm = async (form) => {
    if (isConnected) {
      let metadatas = {
        title: form?.title,
        description: form?.description,
        domain: form?.domain,
        bio: form?.bio,
        image: form?.image,
        banniere: form?.banniere,
        website: form?.website,
        // social: {
        //   facebook: form?.facebook,
        //   github: form?.github,
        //   linkedin: form?.linkedin,
        //   twitter: form?.twitter,
        // },
      };
      console.log(metadatas);

      const record = await createURI("launchpads", metadatas);
      let price = ethers?.utils?.parseEther(isPrice);
      let tokenURI = record;
      let saleStart = new Date(form.saleStart).getTime();
      let saleEnd = new Date(form.saleEnd).getTime();

      let maxCap = ethers.utils.parseEther(form.maxCap);
      let minCap = ethers.utils.parseEther(form.minCap);
      let minInvest = ethers.utils.parseEther(form.minInvest);
      let maxInvest = ethers.utils.parseEther(form.maxInvest);
      let launchpadData = {
        id: 0,
        minCap: BigInt(minCap._hex),
        maxCap: BigInt(maxCap._hex),
        minInvest: BigInt(minInvest._hex),
        maxInvest: BigInt(maxInvest._hex),
        saleStart: BigInt(saleStart),
        saleEnd: BigInt(saleEnd),
        amountRaised: 0n,
        totalUser: 0n,
      };

      await _apiPostPayable(
        "createLaunchpad",
        [launchpadData, tokenURI],
        `${price._hex}`
      );

      let launchpadID = await _apiGet("tokensLengthOf", [
        ADDRESSES["launchpadHub"],
      ]);

      return;
    }
  };

  useEffect(() => {
    if (!isPrice) {
      (async () => {
        setIsPrice(
          ethers.utils.formatEther(
            await _apiGetAt({
              func: "launchpadPrice",
              targetContract: "balancesHub",
            })
          )
        );
      })();
    }
  }, []);

  _form_create_launchpad[0].title = `Hello ${metadatas?.username} ! 👋`;

  return (
    <MyLayoutApp
      url={"/create/launchpad"}
      target={"launchpad"}
      initState={{ allowed: true }}
    >
      <MyFormCreate
        title={"Create Launchpad"}
        stateInit={{
          allowed: isPrice ? true : false,
          form: { ...moock_create_launchpad, price: isPrice },
          placeholders: moock_create_launchpad_placeholder,
          checked: moock_create_launchpad_checked,
          superChecked: moock_create_launchpad_superchecked,
        }}
        submit={submitForm}
        arr={_form_create_launchpad}
        components={[
          { component: <></>, label: "Introduction" },

          { component: <FormCreateLaunchpad1 />, label: "Informations" },
          { component: <FormCreateLaunchpad3 />, label: "Protocole" },
        ]}
        btn={
          <>
            <Icon icon={icfyROCKET} className={""} />
            Create launchpad
          </>
        }
      />
    </MyLayoutApp>
  );
};

export default PageCreateLaunchpad;
