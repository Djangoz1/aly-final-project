import { MySection } from "components/myComponents/MySection";
import {
  FormProvider,
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  doStateFormRefresh,
  useFormDispatch,
  useFormState,
} from "context/form";
import { useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { Layout } from "sections/Layout";
import { useAccount } from "wagmi";

export const LayoutForm = ({ stateInit, children }) => {
  return (
    <FormProvider>
      <Child stateInit={stateInit} children={children} />
    </FormProvider>
  );
};

const Child = ({ stateInit, children }) => {
  let { form, status, modal, checked, pointer } = useFormState();
  let dispatch = useFormDispatch();
  let { isConnected } = useAccount();
  let ref = useRef(null);

  useEffect(() => {
    if (
      (modal || stateInit?.allowed) &&
      isConnected &&
      stateInit?.form?.target !== form?.target
    ) {
      doInitStateForm(dispatch, stateInit);
      doStateFormChecked({
        dispatch,
        pointer,
        form: stateInit?.form,
        checked: stateInit?.checked,
        superChecked: stateInit?.superChecked,
      });
      console.log("Anormal ! Init layout form ...", stateInit);
    }
  }, [stateInit, isConnected, modal]);
  return <>{children}</>;
};
