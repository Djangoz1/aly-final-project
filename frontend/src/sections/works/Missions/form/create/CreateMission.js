import React, { useEffect, useState } from "react";

import { useAuthState } from "context/auth";

import { MySteps } from "components/myComponents/MySteps";
import { MENUS_CREATE_MISSION } from "constants/menus";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { _form_create_mission } from "utils/ux-tools/form/mission";
import { FormCreateMission1, FormCreateMission2 } from "./FormCreateMission";
import {
  moock_create_mission,
  moock_create_mission_placeholder,
  moock_create_profile,
  moock_create_profile_placeholder,
} from "constants/moock";

import { _apiGet, _apiGetAt, _apiPost } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { ethers } from "ethers";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { Icon } from "@iconify/react";
import { icfyETHER } from "icones";
import { CVName } from "components/inputs/inputsCV/CVName";
import { createURI } from "utils/ui-tools/pinata-tools";
import { useCVState } from "context/hub/cv";
import { useAccount } from "wagmi";

export const CreateMission = ({ styles }) => {
  let [price, setPrice] = useState(null);
  let { metadatas, cv } = useAuthState();
  let { cvID } = useCVState();
  let { isConnected } = useAccount();
  _form_create_mission[0].title = (
    <>
      Salut <CVName metadata={metadatas} /> ! 👋
    </>
  );

  let getPrice = async () => {
    let _price = await _apiGetAt({
      func: "missionPrice",
      targetContract: "balancesHub",
    });
    let eth = await ethers?.utils?.formatEther(`${_price}`);

    setPrice(eth);
  };

  useEffect(() => {
    if (!price) getPrice();
  }, [price]);

  let submitForm = async (form) => {
    let id = parseInt(
      await _apiGet("tokensLengthOf", [ADDRESSES["missionsHub"]])
    );
    let images = [];
    if (form?.image) {
      images.push({ image: form?.image, target: "image" });
    }
    if (form?.banniere) {
      images.push({
        image: form?.banniere,
        target: "banniere",
        attributes: true,
      });
    }

    let metadatas = {
      description: form?.description,
      title: form?.title,
      attributes: [
        {
          reference: form?.reference,
          launchpad: form?.launchpad,
          domain: form?.domain,
        },
      ],
    };
    let uri = await createURI({ id, title: "Mission", images, metadatas });
    let price = await _apiGetAt({
      func: "missionPrice",
      targetContract: "balancesHub",
    });
    await _apiPost("createMission", [uri], price);
  };

  return (
    isConnected && (
      <MyFormModal
        submit={submitForm}
        stateInit={{
          form: moock_create_mission,
          placeholders: moock_create_mission_placeholder,
          checked: [[], ["title", "domain", "description"]],
        }}
        btn={"Create mission"}
        styles={{ btn: styles }}
        side={<MySteps arr={MENUS_CREATE_MISSION} />}
        arr={_form_create_mission}
        components={[
          <MyFormInfo
            title={
              <>
                <Icon icon={icfyETHER} className="mr-2 text-white text-2xl" />
                <span>{price} ETH</span>
              </>
            }
          />,
          <FormCreateMission1 />,
          <FormCreateMission2 />,
        ]}
      />
    )
  );
};
