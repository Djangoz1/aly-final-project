import { MyModal } from "components/myComponents/modal/MyModal";
import React, { useEffect, useState } from "react";
import { MyFormInfo } from "./MyFormInfo";
import { v4 as uuidv4 } from "uuid";
import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  doStateFormModal,
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import { LayoutForm } from "sections/Form/LayoutForm";
import { styles as _styles } from "styles/style";

import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { MyFModal } from "../modal/MyFramerModal";

export const MyFormModal = ({
  stateInit,
  component,
  side,
  arr,
  btns,
  submit,
  children,
  title,
  styles,
  editer,
}) => {
  return (
    <LayoutForm stateInit={stateInit}>
      <MyFModal
        isForm={true}
        title={title}
        submit={submit}
        btns={btns}
        styles={{
          btn: `    ${styles?.btn}`,
          modal: `overflow-y-auto ${
            styles?.modal || "w-[80vw]  min-h-[80vh] max-h-[90vh]"
          }`,
        }}
      >
        {children}
      </MyFModal>
    </LayoutForm>
  );
};
