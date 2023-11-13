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

const PageCreateProfile = () => {
  let { address, isConnected } = useAccount();
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
        social: JSON.stringify(
          {
            facebook: form?.facebook,
            github: form?.github,
            linkedin: form?.linkedin,
            twitter: form?.twitter,
          },
          null,
          2
        ),
      };

      console.log("meztadatas", metadatas);

      const record = await clientPocket.records.create("launchpads", metadatas);

      let launchpadURI = record.id;
      let tokenURI = record.id; // ! USELESS to delete on blockchain

      let dateStart = new Date(form.saleStart);
      let saleStart = dateStart.getTime();
      let dateEnd = new Date(form.saleEnd);
      let saleEnd = dateEnd.getTime();

      let minInvest = ethers.utils.parseEther(form.minInvest);
      let maxInvest = ethers.utils.parseEther(form.maxInvest);
      let launchpadData = {
        id: 0,
        tokenAddress: form.tokenAddress,
        numberOfTier: BigInt(form.rounds),
        maxCap: 0n,
        minCap: 0n,
        minInvest: BigInt(minInvest._hex),
        maxInvest: BigInt(maxInvest._hex),
        saleStart: BigInt(saleStart),
        saleEnd: BigInt(saleEnd),
        lockedTime: BigInt(form.lockedTime),
        totalUser: 0n,
        tokenURI: launchpadURI,
      };

      let tiersDatas = [];
      for (let index = 0; index < parseInt(form.rounds); index++) {
        let tierDatas = {
          minTierCap: BigInt(
            ethers.utils.parseEther(form.minTiersCap[index])._hex
          ),
          maxTierCap: BigInt(
            ethers.utils.parseEther(form.maxTiersCap[index])._hex
          ),
          tokenPrice: BigInt(
            ethers.utils.parseEther(form.tokenPrice[index])._hex
          ),
          amountRaised: 0n,
          users: 0n,
        };
        tiersDatas.push(tierDatas);
      }

      await _apiPostPayable(
        "createLaunchpad",
        [launchpadData, tiersDatas, tokenURI],
        `${ethers?.utils?.parseEther(form?.price)}`
      );

      let launchpadID = await _apiGet("tokensLengthOf", [
        ADDRESSES["launchpadHub"],
      ]);
      let launchpadAddress = await _apiGet("addressOfLaunchpad", [launchpadID]);
      if (
        (await _apiGet("ownerOfToken", [
          launchpadID,
          ADDRESSES["launchpadHub"],
        ])) == address
      ) {
        let hash = await _apiPostAt({
          func: "approve",
          targetContract: "erc20",
          address: form?.tokenAddress,
          args: [launchpadAddress, parseInt(form.tokenAllowance)],
        });

        hash = await _apiPost("lockTokens", [
          launchpadID,
          parseInt(form.tokenAllowance),
        ]);
      }
      return;
    }
  };
  let { cv, metadatas } = useAuthState();

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
          { component: <FormCreateLaunchpad2 />, label: "Tokens" },
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

export default PageCreateProfile;
