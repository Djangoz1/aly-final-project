import { MyModal } from "components/myComponents/modal/MyModal";
import React, { useEffect, useRef, useState } from "react";
import { MyFormInfo } from "./MyFormInfo";
import { v4 as uuidv4, v4 } from "uuid";
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
import { MyCard1 } from "../card/MyCard";
import { Viewport } from "../layout/MyViewport";
import { Particle } from "../MyParticles";
import { Hg, Hg1 } from "components/text/HeroGradient";
import { useInView } from "framer-motion";

export const MyForm = ({
  stateInit,
  components,
  side,
  arr,
  submit,
  btn,
  styles,
  editer,
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
  arr,
  title,
  submit,
  children,
  btn,
  styles,
  editer,
}) => {
  return (
    <LayoutForm stateInit={stateInit}>
      <div className="fixed top-[9vh] left-[5vw] w-[20vw]  flex flex-col">
        {title && (
          <div className="flex items-center text-2xl font2 mb-2">
            <Icon icon={icfy.ux.plus} className="text-2xl mr-2" />
            <Hg>{title}</Hg>
          </div>
        )}
        {side && side}
      </div>

      <Child1
        editer={editer}
        components={components}
        side={side}
        submit={submit}
        arr={arr}
      />
    </LayoutForm>
  );
};

import { motion, AnimatePresence } from "framer-motion";
let Child1 = ({ components, side, arr, submit, editer }) => {
  let dispatch = useFormDispatch();
  let [isLoading, setIsLoading] = useState(null);
  let { form, placeholders, pointer, disabled, checked, superChecked } =
    useFormState();

  let { isConnected } = useAccount();

  console.log("form", form);
  useEffect(() => {
    if (!isConnected) doStateFormDisabled(dispatch, true);
    if (pointer === 0 && isConnected) doStateFormDisabled(dispatch, false);
    if (checked?.[pointer]?.length > 0) {
      // doStateFormChecked({ dispatch, pointer, form, checked, superChecked });
    }
  }, [isConnected, pointer]);

  // useEffect(() => {
  //   console.log(
  //     "disabled ...",
  //     // !disabled &&
  //     checked.length - 1
  //     // && checked?.[pointer]?.length === 0
  //   );

  //   if (
  //     !disabled &&
  //     pointer <= checked.length - 1 &&
  //     checked?.[pointer]?.length === 0
  //   ) {
  //     for (let index = 0; index < checked.length; index++) {
  //       const checks = checked[index];
  //       if (checks.length > 0 && index !== pointer) {
  //         // doStateFormPointer(dispatch, index);
  //         break;
  //         // return;
  //       }
  //     }
  //     // console.log("change pointer checked ...", checked);
  //     // doStateFormChecked({ dispatch, pointer, form, checked, superChecked });
  //     // doStateFormPointer(dispatch, pointer + 1);
  //   }
  // }, [disabled, isConnected]);

  let handleSubmit = async () => {
    if (isConnected) {
      setIsLoading(true);
      await submit(form);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Particle style={"fixed z-1"} />
      <Viewport full={true}>
        <div className="w-[100%]  ml-auto">
          <div>
            <AnimatePresence>
              <motion.div
                className=" flex overflow-hidden   flex-col relative box-border  rounded-lg shadow "
                key={components?.[pointer]?.label}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                // exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute w-full h-full bg-white/5 backdrop-blur z-0"></div>
                <div className="z-1 relative px-5 pt-3 pb-5 flex flex-col">
                  <MyFormInfo
                    title={arr?.[pointer]?.title}
                    description={arr?.[pointer]?.description}
                  />
                  {components?.[pointer]?.component}
                  <div className="mt-5 ml-auto">
                    {!isLoading && !editer && pointer > 0 && (
                      <button
                        onClick={() =>
                          doStateFormPointer(dispatch, pointer - 1)
                        }
                        className="btn btn-xs btn-outline btn-error mr-3"
                      >
                        Précédent
                      </button>
                    )}
                    {!editer && isConnected && pointer != arr?.length - 1 && (
                      <button
                        onClick={() =>
                          doStateFormPointer(dispatch, pointer + 1)
                        }
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Viewport>

      {/* {components?.map((el, i) => (
        <Elem index={i} elem={el} key={v4()} />
      ))} */}
    </>
  );
};

// <Viewport particles={"z-2 fixed"} full={true}>
//   <div className="flex w-[65vw] ml-auto">
//     {/* <div className="backdrop-blur  mb-1 rounded-lg px-3 max-h-[75vh] overflow-scroll hide-scrollbar w-2/5 mr-4 py-2">
//             <h6 className="text-lg">
//               {isConnected ? (
//                 <Hg1>{arr?.[pointer]?.title}</Hg1>
//               ) : (
//                 <span className="flex items-center">
//                   <Icon icon={icfy.ux.warning} className="text-warning mr-2" />{" "}
//                   Oops ... You're not connected
//                 </span>
//               )}
//             </h6>

//             {(arr?.[pointer]?.description || !isConnected) && (
//               <MyFormInfo
//                 description={
//                   isConnected
//                     ? arr?.[pointer]?.description
//                     : "Please connected on your account with your wallet provider ?"
//                 }
//               />
//             )}
//           </div> */}

//     <div
//       className={`w-full relative flex flex-col  px-4 py-2 max-h-[80vh] overflow-scroll hide-scrollbar   backdrop-blur  shadow-lg     box-border  rounded-lg `}
//     >
//       {(arr?.[pointer]?.description || !isConnected) && (
//         <MyFormInfo
//           title={
//             <h6 className="text-2xl">
//               {isConnected ? (
//                 arr?.[pointer]?.title
//               ) : (
//                 <span className="flex items-center">
//                   <Icon icon={icfy.ux.warning} className="text-warning mr-2" />{" "}
//                   Oops ... You're not connected
//                 </span>
//               )}
//             </h6>
//           }
//           description={
//             isConnected
//               ? arr?.[pointer]?.description
//               : "Please connected on your account with your wallet provider ?"
//           }
//         />
//       )}
//       {isConnected && components[pointer]}
//       <div className="h-full mb-5"></div>
//
//     </div>
//   </div>
// </Viewport>;
