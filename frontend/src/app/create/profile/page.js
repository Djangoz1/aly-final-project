"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { Viewport } from "components/myComponents/layout/MyViewport";
import React from "react";

import { _form_create_profile } from "utils/ux-tools/form/profile";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { MySteps } from "components/myComponents/MySteps";
import { MENUS } from "constants/menus";
import { useAccount } from "wagmi";

import {
  moock_create_profile,
  moock_create_profile_checked,
  moock_create_profile_placeholder,
} from "constants/moock";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { doAuthCV, useAuthDispatch } from "context/auth";
import { clientPocket, createURICv } from "utils/ui-tools/pinata-tools";
import { Icon } from "@iconify/react";
import { icfy, icfyCV } from "icones";
import { styles } from "styles/style";
import { MyForm, MyFormCreate } from "components/myComponents/form/MyForm";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import {
  FormCreateProfile1,
  FormCreateProfile2,
} from "sections/Form/forms/create/FormCreateProfile1";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { MyCardPrice } from "components/myComponents/card/MyCardPrice";

const PageCreateProfile = () => {
  let { address, isConnected } = useAccount();
  let dispatch = useAuthDispatch();
  let submitForm = async (form) => {
    if (isConnected) {
      let metadatas = {
        username: form.username,
        description: form.description,

        visibility: form.visibility,
        banniere: form.banniere,
        email: form.email,

        cvImg: form?.cvImg,
        identity: JSON.stringify(
          {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            dateOfBirth: form.dateOfBirth,
            citizen: form.citizen,
          },
          null,
          2
        ),
        social: JSON.stringify(
          {
            linkedin: form.linkedin,
            github: form.github,
            twitter: form.twitter,
            facebook: form.facebook,
          },
          null,
          2
        ),
        languages: JSON.stringify(form.languges, null, 2),
        skills: JSON.stringify(form.skills, null, 2),
        domain: form.domain,
      };

      console.log("metadatas", metadatas);
      const client = clientPocket;
      const record = await client.records.create("accounts", metadatas);
      console.log("record", record);

      let tokenURI = record.id;
      await _apiPost("createCV", [tokenURI]);
      await doAuthCV(dispatch, address);
    }
  };

  return (
    <MyLayoutApp
      initState={{ allowed: true }}
      target={"profile"}
      url={"/create/profile"}
    >
      <MyFormCreate
        title={"Create profile"}
        stateInit={{
          allowed: true,
          form: moock_create_profile,
          placeholders: moock_create_profile_placeholder,
          checked: moock_create_profile_checked,
        }}
        submit={submitForm}
        sideImg={"/profile.gif"}
        arr={_form_create_profile}
        styles={{ btn: styles.gbtn + " uppercase gb2 border-none" }}
        components={[
          {},

          {
            component: <FormCreateProfile1 />,
            label: "Profile",
          },
          {
            component: <FormCreateProfile2 />,
            label: "Social",
          },
        ]}
        btn={
          <>
            <Icon icon={icfyCV} />
            Create profile
          </>
        }
      />
    </MyLayoutApp>
  );
};

export default PageCreateProfile;
