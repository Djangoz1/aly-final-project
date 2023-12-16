import { motion, AnimatePresence } from "framer-motion";

import { MyMainBtn, MyMainBtn1 } from "../btn/MyMainBtn";

import React, { useEffect, useRef, useState } from "react";
import { MyFormInfo } from "./MyFormInfo";
import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import { LayoutForm } from "sections/Form/LayoutForm";
import { styles as _styles } from "styles/style";

import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import { icfy, icfyARROWD, icsystem } from "icones";
import { MyCard, MyCard1 } from "../card/MyCard";
import { Viewport } from "../layout/MyViewport";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { useInView } from "framer-motion";
import { v4 } from "uuid";
import { useToolsState } from "context/tools";
import { MyCardPrice } from "../card/MyCardPrice";
import { MyToggle } from "./MyToggle";
import { FormTxs } from "sections/Form/FormTxs";
import { FormResponseAI } from "sections/Form/FormResponseAI";
import { MyModal } from "../modal/MyModal";
import { MyTextArea } from "./MyTextArea";
import { MyFramerModal } from "../box/MyFramerModals";
import { controllers } from "utils/controllers";
import { useAuthState } from "context/auth";
import { TextAI } from "../text/TextAI";
import { MOOCK } from "constants/moock";

export const MyForm = ({
  stateInit,
  components,
  side,
  arr,
  submit,
  btn,
  styles,
  editer,
  template,
}) => {
  return (
    <LayoutForm stateInit={stateInit}>
      <Child
        stateInit={stateInit}
        editer={editer}
        _components={components}
        side={side}
        submit={submit}
        arr={arr}
      />
    </LayoutForm>
  );
};

let Child = ({ _components, side, arr, submit, editer }) => {
  let components = _components;
  let dispatch = useFormDispatch();

  let [isLoading, setIsLoading] = useState(null);
  let { form, placeholders, pointer, disabled, checked, superChecked } =
    useFormState();

  let { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) doStateFormDisabled(dispatch, true);
    if (pointer === 0 && isConnected) doStateFormDisabled(dispatch, false);

    doStateFormChecked({ dispatch, pointer, form, checked, superChecked });
  }, [isConnected, pointer]);

  let handleSubmit = async () => {
    if (isConnected) {
      setIsLoading(true);
      await submit(form);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="backdrop-blur  mb-1 rounded-lg px-3 py-2">{side}</div>

      <div
        className={`w-full relative flex flex-col  px-4 py-2 max-h-[60vh] overflow-scroll hide-scrollbar   backdrop-blur  shadow-lg     box-border  rounded-lg `}
      >
        {(arr?.[pointer]?.description || !isConnected) && (
          <MyFormInfo
            title={
              <h6 className="text-2xl">
                {isConnected ? (
                  arr?.[pointer]?.title
                ) : (
                  <span className="flex items-center">
                    <Icon
                      icon={icfy.ux.warning}
                      className="text-warning mr-2"
                    />{" "}
                    Oops ... You're not connected
                  </span>
                )}
              </h6>
            }
            description={
              isConnected
                ? arr?.[pointer]?.description
                : "Please connected on your account with your wallet provider ?"
            }
          />
        )}
        {isConnected && components[pointer]}
        <div className="h-full mb-5"></div>
        <div className="mt-auto ml-auto">
          {!isLoading && !editer && pointer > 0 && (
            <button
              onClick={() => doStateFormPointer(dispatch, pointer - 1)}
              className="btn btn-xs btn-outline btn-error mr-3"
            >
              Précédent
            </button>
          )}

          {!editer && isConnected && pointer != arr?.length - 1 && (
            <button
              onClick={() => doStateFormPointer(dispatch, pointer + 1)}
              className="btn btn-xs btn-outline btn-success "
              disabled={disabled}
            >
              Suivant
            </button>
          )}
          {isConnected && (editer || pointer === arr?.length - 1) && (
            <button
              onClick={handleSubmit}
              disabled={disabled}
              className="btn btn-xs btn-outline h-fit  btn-info "
            >
              {editer || "Submit"}
              {isLoading && (
                <span className="loading loading-bars loading-md"></span>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export const MyFormCreate = ({ stateInit, components, submit, editer }) => {
  let { target } = useToolsState();
  return (
    <LayoutForm
      stateInit={{
        ...stateInit,
        allowed:
          target &&
          (stateInit?.form || MOOCK?.[target]?.form) &&
          stateInit?.form != target
            ? stateInit?.allowed
            : false,
        form: stateInit?.form
          ? { target: target, ...stateInit?.form }
          : { ...MOOCK?.[target]?.form, target },
        placeholders: stateInit?.placeholders
          ? stateInit?.placeholders
          : MOOCK?.[target]?.placeholders,
      }}
    >
      <Child1 editer={editer} _components={components} submit={submit} />
    </LayoutForm>
  );
};

let Child1 = ({
  _components,

  submit,
  editer,
}) => {
  let components = _components.filter((el) => el?.label || el?.component);
  let dispatch = useFormDispatch();

  let { form, placeholders, pointer, disabled, checked, superChecked } =
    useFormState();
  let test = useFormState();
  console.log("test", test);
  let { datas } = useAuthState();
  let { isConnected } = useAccount();

  const { target } = useToolsState();

  console.log("form", form);

  useEffect(() => {
    if (!isConnected) doStateFormDisabled(dispatch, true);
    if (pointer === 0 && isConnected) doStateFormDisabled(dispatch, false);
    if (checked?.[pointer]?.length > 0) {
      doStateFormChecked({ dispatch, pointer, form, checked, superChecked });
    }
  }, [isConnected, pointer]);

  let handleSubmit = async () => {
    if (isConnected) {
      let result = submit
        ? await submit(form)
        : await controllers.create?.[target]({ datas: datas, ...form });
      await doInitStateForm(dispatch, { ...form, result });
    } else {
      throw new Error("You need to be connected");
    }
  };

  return (
    <>
      <div className="w-screen    h-screen">
        <div className="flex  relative flex-col  justify-between h-full magicpattern  pt-20  ">
          <div className="  w-full h-full flex flex-col items-center justify-center ">
            {pointer === components?.length ? (
              <FormTxs />
            ) : components?.[pointer]?.label ? (
              <TextAI
                text={
                  isConnected
                    ? components?.[pointer]?.label
                    : "Please connect you to your wallet"
                }
                style={
                  "  gap-10   items-center h-full justify-center relative "
                }
              >
                {components?.[pointer]?.component}
              </TextAI>
            ) : (
              components?.[pointer]?.component
            )}
          </div>
          {(form?.result === undefined && pointer === components.length + 1) ||
          !form ||
          !isConnected ? (
            <></>
          ) : (
            <div className="    w-full    items-center justify-center grid grid-cols-1 divide-white/5 divide-y gap-3">
              <div className="w-full flex  justify-center">
                {pointer > 0 && (
                  <MyMainBtn
                    setter={() => doStateFormPointer(dispatch, pointer - 1)}
                    color={1}
                    _refresh={false}
                    icon={false}
                  >
                    {" "}
                    Previous
                  </MyMainBtn>
                )}
              </div>
              <div className="w-full flex py-4 justify-center">
                {editer || pointer >= components?.length ? (
                  <MyMainBtn
                    style={" bg1  w-fit items-center text-white  shadow  hc1"}
                    _refresh={false}
                    setter={handleSubmit}
                    disabled={disabled}
                    // className="btn btn-xs btn-outline h-fit  btn-info "
                  >
                    {editer || "Submit"}
                  </MyMainBtn>
                ) : (
                  <MyMainBtn
                    _refresh={false}
                    setter={() => doStateFormPointer(dispatch, pointer + 1)}
                  >
                    Next
                  </MyMainBtn>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
