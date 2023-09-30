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
import React, { useEffect } from "react";
import { Layout } from "sections/Layout";

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
  console.log(stateInit?.superChecked?.function);
  useEffect(() => {
    if (modal) {
      doInitStateForm(dispatch, stateInit);
      doStateFormChecked({
        dispatch,
        pointer,
        form: stateInit?.form,
        checked: stateInit?.checked,
        superChecked: stateInit?.superChecked,
      });
    } else {
      doStateFormRefresh(dispatch);
      doStateFormDisabled(dispatch, true);
    }
  }, [stateInit, modal]);
  return <>{children}</>;
};
