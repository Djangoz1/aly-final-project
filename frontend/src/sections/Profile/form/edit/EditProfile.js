import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

import { MyMenus } from "components/myComponents/menu/MyMenus";
import { _form_edit_profile } from "utils/ux-tools/form/profile";
import { MENUS } from "constants/menus";

import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { toMockProfile } from "constants/moock";
import {
  FormEditProfile1,
  FormEditProfile2,
  FormEditProfile3,
  FormEditProfile4,
} from "sections/Profile/form/edit/FormEditProfile";
import { useAccount } from "wagmi";
import { doStateCV, useCVDispatch, useCVState } from "context/hub/cv";

import { _apiPost, _apiPostAt } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { createURICv } from "utils/ui-tools/pinata-tools";

export const EditProfile = ({ styles }) => {
  let { address, isConnected } = useAccount();
  let { metadatas, datas, cv } = useAuthState();

  let { cvID } = useCVState();
  let dispatch = useCVDispatch();
  let dispatchAuth = useAuthDispatch();

  let submitForm = async (form) => {
    if (isConnected && cv == cvID) {
      let tokenURI = await createURICv(form);
      await _apiPost("setTokenURIOf", [cv, tokenURI, ADDRESSES["cvsHub"]]);
      await doAuthCV(dispatchAuth, address);
      await doStateCV(dispatch, cvID);
    }
  };

  let moock = toMockProfile({ address, metadatas, cvID });
  return (
    <MyFormModal
      stateInit={{
        form: moock,
        placeholders: moock,
      }}
      editer={"Update account"}
      btn={"Edit profile"}
      styles={{ btn: styles }}
      arr={_form_edit_profile}
      submit={submitForm}
      side={
        <MyMenus
          styles={{
            box: "flex-col w-full bg-black/10 mr-10 h-full",
            el: "px-5 text-left",
          }}
          menus={MENUS.profile.edit}
        />
      }
      components={[
        <FormEditProfile1 />,
        <FormEditProfile2 />,
        <FormEditProfile3 />,
        <FormEditProfile4 />,
      ]}
    />
  );
};
