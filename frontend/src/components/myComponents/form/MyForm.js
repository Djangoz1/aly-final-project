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
        components={components}
        side={side}
        submit={submit}
        arr={arr}
      />
    </LayoutForm>
  );
};

let Child = ({ components, side, arr, submit, editer }) => {
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
export const MyFormCreate = ({
  stateInit,
  components,
  side,
  template,
  arr,
  sideImg,
  title,
  inherit,
  submit,
  children,
  btn,
  styles,
  editer,
}) => {
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
      <Child1
        children={children}
        sideImg={sideImg}
        template={template}
        title={title}
        editer={editer}
        components={components}
        inherit={inherit}
        side={side}
        submit={submit}
        arr={arr}
      />
    </LayoutForm>
  );
};

let Child1 = ({
  components,

  sideImg,

  template,
  title,
  arr,
  submit,
  editer,
}) => {
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
        {
          [
            <div className="h-full w-full   flex flex-row">
              <div className="     overflow-y-scroll hide-scrollbar relative  pb-10 bg-[#f7f6f2]   px-10 py-3 flex   min-w-[40%] w-[40%]  flex-col h-auto items-center gap-4 ">
                {/* <div className="absolute -z-2 w-full h-full  backdrop-blur-[3px]"></div> */}
                <div className="flex relative z-3 justify-between items-end w-full ">
                  <h2 className=" mt-3 text-black max-w-[55px] text-3xl font-extrabold md:text-3xl text-left uppercase w-full">
                    {title}
                  </h2>

                  {(sideImg || target) && (
                    <img
                      src={sideImg || `/${target}.gif`}
                      alt=""
                      className=" w-64 h-64 ml-3 inline-block"
                    />
                  )}
                </div>
                <AnimatePresence>
                  <motion.div
                    key={pointer}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    // exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className=" w-full  text-justify text-xs  whitespace-break-spaces c4"
                  >
                    {arr?.[pointer]?.description || (
                      <>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Asperiores mollitia in dignissimos quia maxime excepturi
                        harum ex eius rem aliquid voluptatum debitis
                        necessitatibus tempora quo, reprehenderit atque magni
                        porro molestias?
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
                {isConnected && (
                  <div className="flex w-full relative mt-auto">
                    {pointer !== 0 && (
                      <button
                        onClick={() =>
                          doStateFormPointer(dispatch, pointer - 1)
                        }
                        className="btn btn-outline  shadow hover:bg-black hover:text-error text-black"
                      >
                        <Icon
                          icon={icfy.ux.arrow}
                          className="-rotate-90 mr-2"
                        />
                        <span className=" flex items-center">Previous </span>
                      </button>
                    )}
                    {pointer === 0 && (
                      <MyToggle
                        style={form?.ia === true ? "c1" : "text-error"}
                        target={"aiAssisted"}
                      >
                        Active / Désactive Aly
                      </MyToggle>
                    )}

                    {(editer || pointer >= components?.length) && (
                      <MyMainBtn
                        template={1}
                        style={
                          "ml-auto bg1 flex w-fit items-center text-white hover:border-[#202361] shadow hover:bg-transparent hc1"
                        }
                        _refresh={false}
                        setter={handleSubmit}
                        disabled={disabled}
                        // className="btn btn-xs btn-outline h-fit  btn-info "
                      >
                        {editer || "Submit"}
                      </MyMainBtn>
                    )}
                    {pointer < components?.length && !arr?.[pointer]?.error && (
                      <button
                        disabled={disabled}
                        onClick={() =>
                          doStateFormPointer(dispatch, pointer + 1)
                        }
                        className="btn ml-auto shadow z-3 relative  hover:bg-white hover:text-success  bg-black text-white"
                      >
                        Next <Icon icon={icfy.ux.arrow} className="rotate-90" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div
                template={4}
                className="magicpattern  overflow-y-scroll hide-scrollbar rounded-sm  shadowh _hover   px-8 pt-6 pb-10 w-full "
              >
                {!isConnected ? (
                  <div className="flex flex-col  h-1/2 justify-between items-center w-full text-center">
                    <span className="text-[44px] font-light text-warning">
                      Please connect to your account !
                    </span>

                    <img src="/404.gif" />
                    {/* <div className="🤚">
                    <div className="👉"></div>
                    <div className="👉"></div>
                    <div className="👉"></div>
                    <div className="👉"></div>
                    <div className="🌴"></div>
                    <div className="👍"></div>
                  </div> */}
                  </div>
                ) : (
                  pointer <= components?.length - 1 && (
                    <ol className=" gap-5 w-full    flex">
                      {arr?.map((el, i) => (
                        <div
                          key={v4()}
                          className={`w-full pt-1 rounded-lg ${
                            i === pointer ? "g1 gb1" : "bg-neutral-600"
                          }`}
                        />
                      ))}
                    </ol>
                  )
                )}

                {isConnected ? (
                  <AnimatePresence>
                    <motion.div
                      key={arr?.[pointer]?.title}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      // exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mx-auto h-full mt-10 overflow-y-scroll hide-scrollbar w-full "
                    >
                      {pointer !== 0 &&
                      /**
                       * @dev check if client is assisted by AI
                       * @dev if yes render AIResponse
                       * @dev if not render FormTxs
                       */
                      ((pointer !== components?.length + 1 &&
                        form?.aiAssisted) ||
                        (!form?.aiAssisted &&
                          pointer !== components?.length)) &&
                      target ? (
                        components?.[pointer]?.component
                      ) : isConnected && pointer === 0 ? (
                        <MyCardPrice
                          style={"mx-auto"}
                          btn={{ no: true }}
                          lists={arr?.map((el, i) => {
                            return (
                              i > 0 && {
                                title: el?.title,

                                check:
                                  pointer === components?.length ? true : false,
                              }
                            );
                          })}
                          price={form?.price}
                          color={2}
                          badge={{ title: title, icon: icsystem?.[target] }}
                        />
                      ) : (
                        <FormTxs />
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : undefined}
              </div>
            </div>,
            <div className="flex  relative flex-col  justify-between h-full magicpattern  pt-20  ">
              <div className="  w-full h-full flex flex-col items-center justify-center ">
                {pointer === components?.length ? (
                  <FormTxs />
                ) : components?.[pointer]?.label ? (
                  <TextAI
                    text={components?.[pointer]?.label}
                    style={"  gap-10   items-center justify-center "}
                  >
                    {components?.[pointer]?.component}
                  </TextAI>
                ) : (
                  components?.[pointer]?.component
                )}
              </div>
              {form?.result === undefined && (
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
                        style={
                          " bg1  w-fit items-center text-white  shadow  hc1"
                        }
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
            </div>,
          ]?.[template || 0]
        }
      </div>
    </>
  );
};
