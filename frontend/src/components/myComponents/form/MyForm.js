import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

import { MyMainBtn } from "../btn/MyMainBtn";

import React, { useEffect } from "react";

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

import { useToolsState } from "context/tools";

import { FormTxs } from "sections/Form/FormTxs";
import { FormResponseAI } from "sections/Form/FormResponseAI";

import { controllers } from "utils/controllers";
import { useAuthState } from "context/auth";
import { TextAI } from "../text/TextAI";
import { MOOCK } from "constants/moock";

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
  let { isConnected } = useAccount();
  let components = _components.filter((el) => el?.label || el?.component);
  let dispatch = useFormDispatch();
  // if (!isConnected) {
  //   return (
  //     <TextAI
  //       text={"Please connect you to your wallet"}
  //       style={"  gap-10   items-center h-full justify-center relative "}
  //     ></TextAI>
  //   );
  // }
  let { form, placeholders, pointer, disabled, checked, superChecked } =
    useFormState();
  let test = useFormState();
  console.log("test", test);
  let { datas } = useAuthState();

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

  const _pointer = useMotionValue(pointer); // Initialize the pointer with a motion value of 0

  const spring = useSpring(_pointer, {
    stiffness: 700, // control the stiffness of the spring
    damping: 30, // control the damping (less damping = more bouncy)
  });
  const width = useTransform(spring, [0, components.length], ["0%", "100%"]);

  // Update the pointer value based on the range input
  useEffect(() => {
    spring.set(pointer); // This will animate with the spring transition
  }, [pointer, spring]);

  return (
    <>
      <div className="mx-auto mb-5  w-[20vw] bg-white/5 rounded-full overflow-hidden   relative border border-white/30 ">
        <motion.div
          className="transition shadow1 bg3 "
          style={{
            width,
            height: "13px",
            transition: spring,
          }}
        />
      </div>
      <AnimatePresence>
        <motion.div
          key={`form-${pointer}`}
          initial={{ opacity: 0 }} // Initial state of the element when it's about to be mounted
          animate={{ opacity: 1, y: 0 }} // Animate to a visible state
          transition={{ duration: 0.5 }} // Duration of the animation
          className=" h-[70vh]  w-full flex flex-col items-center overflow-y-auto justify-center "
        >
          {pointer === components?.length ? (
            <FormTxs />
          ) : components?.[pointer]?.label ? (
            <TextAI
              text={components?.[pointer]?.label}
              style={"  gap-10   items-center h-full justify-center relative "}
            >
              {components?.[pointer]?.component}
            </TextAI>
          ) : (
            components?.[pointer]?.component
          )}
        </motion.div>
      </AnimatePresence>

      {(form?.result === undefined && pointer === components.length + 1) ||
      !form ||
      !isConnected ? (
        <></>
      ) : (
        <div className="  absolute bottom-0  left-0   w-full    items-center justify-center grid grid-cols-1 divide-white/5 divide-y gap-3">
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
    </>
  );
};
