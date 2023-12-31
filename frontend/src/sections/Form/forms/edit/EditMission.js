import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

import { _form_edit_profile } from "utils/ux-tools/form/profile";
import { MENUS } from "constants/menus";

import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { toMockMission, toMockProfile } from "constants/moock";
import {
  FormEditProfile1,
  FormEditProfile2,
  FormEditProfile3,
  FormEditProfile4,
} from "sections/Form/forms/edit/FormEditProfile";
import { useAccount } from "wagmi";

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
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { MyLayoutHeader } from "components/myComponents/layout/MyLayoutHeader";
import { MySelect } from "components/myComponents/form/MySelects";
import { useState } from "react";
import { FormEditMission1 } from "./FormEditMission";

export const EditMission = ({ styles }) => {
  let { address, isConnected } = useAccount();
  let { metadatas, datas, cv } = useAuthState();
  let { state } = useToolsState();

  let [isIndex, setIsIndex] = useState(0);
  let moock = toMockMission({
    metadatas: state?.mission?.metadatas,
    address,
    missionID: state?.mission?.missionID,
  });
  return (
    <div className="  min-h-[60vh] w-full flex flex-col h-full">
      <LayoutForm
        stateInit={{
          allowed: state?.mission?.metadatas ? true : undefined,
          form: moock,
          placeholders: {
            ...moock,
            abstract:
              moock?.abstract ||
              "This description will appear on preview asset",
          },
        }}
      >
        <MyLayoutHeader
          metadatas={metadatas}
          cvID={cv}
          image={metadatas?.avatar}
          username={metadatas?.username}
          allowed={cv > 0}
        >
          {/* <MySelect target={'domain'} label={"What's your domain ?"}/> */}
        </MyLayoutHeader>
        <MyMenusTabs
          template={3}
          value={isIndex}
          color={1}
          setter={(i) => setIsIndex(i)}
          // style={" w-1/5 rounded-none "}
          arr={["Informations", "Social"]}
        />
        <div className="  px-3 py-5 h-full">
          {[<FormEditMission1 />, <FormEditProfile2 />][isIndex]}
        </div>
      </LayoutForm>
    </div>
  );
};
