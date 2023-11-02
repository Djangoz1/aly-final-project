import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

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
import {
  doIndexTools,
  doReloadTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MyForm } from "components/myComponents/form/MyForm";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { LayoutForm } from "sections/Form/LayoutForm";

export const EditProfile = ({ styles }) => {
  let { address, isConnected } = useAccount();
  let { metadatas, datas, cv } = useAuthState();
  let { state } = useToolsState();

  let dispatch = useToolsDispatch();
  let dispatchAuth = useAuthDispatch();

  let submitForm = async (form) => {
    if (isConnected && cv) {
      let tokenURI = await createURICv(form);
      await _apiPost("setTokenURIOf", [cv, tokenURI, ADDRESSES["cvsHub"]]);
      await doAuthCV(dispatchAuth, address);
      doReloadTools(dispatch);
    }
  };

  let moock = toMockProfile({ address, metadatas, cvID: cv });

  return (
    <div className="bgprim  min-h-[60vh] w-full flex h-full">
      <LayoutForm
        stateInit={{
          allowed: true,
          form: moock,
          placeholders: moock,
        }}
      >
        <MyMenusTabs
          template={1}
          value={state?.indexSettings || 0}
          target={"title"}
          color={1}
          setter={(i) => doStateTools(dispatch, { ...state, indexSettings: i })}
          style={" w-1/5 rounded-none "}
          arr={MENUS.profile?.edit}
        />
        <div className="  px-3 py-5 h-full">
          {
            [<FormEditProfile1 />, <FormEditProfile2 />, <FormEditProfile4 />][
              state?.indexSettings || 0
            ]
          }
        </div>
      </LayoutForm>
    </div>
  );
};
