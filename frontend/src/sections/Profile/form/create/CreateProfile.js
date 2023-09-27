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
import { FormCreateProfile1, FormCreateProfile2 } from "./FormCreateProfile1";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { doAuthCV, useAuthDispatch } from "context/auth";
import { createURICv } from "utils/ui-tools/pinata-tools";

export const CreateProfile = () => {
  let { address, isConnected } = useAccount();
  let dispatch = useAuthDispatch();
  let submitForm = async (form) => {
    if (isConnected) {
      let tokenURI = await createURICv(form);
      await _apiPost("createCV", [tokenURI]);
      await doAuthCV(dispatch, address);
    }
  };
  return (
    <MyFormModal
      stateInit={{
        form: moock_create_profile,
        placeholders: moock_create_profile_placeholder,
        checked: moock_create_profile_checked,
      }}
      submit={submitForm}
      side={<MySteps arr={MENUS.profile.create} />}
      arr={_form_create_profile}
      styles={{ btn: "cta-button freelance normal-case" }}
      components={["", <FormCreateProfile1 />, <FormCreateProfile2 />]}
      btn={"Create profile"}
    />
  );
};
