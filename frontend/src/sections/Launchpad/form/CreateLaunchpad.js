import { _form_create_profile } from "utils/ux-tools/form/profile";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { MySteps } from "components/myComponents/MySteps";
import { MENUS } from "constants/menus";
import { useAccount } from "wagmi";

import {
  moock_create_launchpad,
  moock_create_launchpad_checked,
  moock_create_launchpad_placeholder,
  moock_create_launchpad_superchecked,
} from "constants/moock";

import { _apiGet, _apiGetAt, _apiPost } from "utils/ui-tools/web3-tools";
import { useAuthDispatch, useAuthState } from "context/auth";
import { createURILaunchpad } from "utils/ui-tools/pinata-tools";

import { _form_create_launchpad } from "utils/ux-tools/form/launchpad";

import {
  FormCreateLaunchpad1,
  FormCreateLaunchpad2,
  FormCreateLaunchpad3,
} from "./FormCreateLaunchpad";
import { ethers } from "ethers";
import { Icon } from "@iconify/react";
import { icfy, icfyROCKET } from "icones";
import { themes } from "styles/style";

export const CreateLaunchpad = () => {
  let { address, isConnected } = useAccount();
  let dispatch = useAuthDispatch();
  let submitForm = async (form) => {
    if (isConnected) {
      let { launchpadURI, tokenURI } = await createURILaunchpad(form);

      let dateStart = new Date(form.saleStart);
      let saleStart = dateStart.getTime();
      let dateEnd = new Date(form.saleEnd);
      let saleEnd = dateEnd.getTime();
      let price = await _apiGetAt({
        func: "launchpadPrice",
        targetContract: "balancesHub",
      });

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

      await _apiPost(
        "createLaunchpad",
        [launchpadData, tiersDatas, tokenURI],
        `${price}`
      );
      return;
    }
  };
  let { cv, metadatas } = useAuthState();

  _form_create_launchpad[0].title = `Hello ${metadatas?.username} ! 👋`;
  return (
    <MyFormModal
      stateInit={{
        form: moock_create_launchpad,
        placeholders: moock_create_launchpad_placeholder,
        checked: moock_create_launchpad_checked,
        superChecked: moock_create_launchpad_superchecked,
      }}
      submit={submitForm}
      side={<MySteps arr={MENUS.launchpad.create} />}
      arr={_form_create_launchpad}
      styles={{ btn: "cta-button border-none project-owner" }}
      components={[
        "",
        <FormCreateLaunchpad1 />,
        <FormCreateLaunchpad2 />,
        <FormCreateLaunchpad3 />,
      ]}
      btn={
        <>
          <Icon icon={icfyROCKET} className={""} />
          Create launchpad
        </>
      }
    />
  );
};
