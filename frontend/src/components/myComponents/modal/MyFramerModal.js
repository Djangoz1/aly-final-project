import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MyOverlay } from "../MyOverlay";
import { doStateFormModal, useFormDispatch, useFormState } from "context/form";
import { useToolsDispatch } from "context/tools";
import { useAccount } from "wagmi";
import { useAuthState } from "context/auth";
import { MyBtnPost } from "../btn/MyBtnPost";

export const MyFModal = ({ children, btns, isForm, submit, styles, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  let formState = isForm && useFormState();
  let { cv } = useAuthState();
  let dispatch = isForm && useFormDispatch();

  let openModal = () => {
    if (isForm) {
      doStateFormModal(dispatch, !isOpen);
      setIsOpen(!isOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  let handleSubmit = async () => {
    console.log("je submit");

    await submit(formState?.form);

    setIsOpen(false);
    if (isForm) {
      doStateFormModal(dispatch, false);
    }
  };
  const modalVariants = {
    hidden: {
      y: "100vh",
    },
    visible: {
      y: 0,
    },
  };

  return (
    <>
      <button className={styles?.btn} onClick={openModal}>
        {btns?.btn}
      </button>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed w-screen debug h-screen z-[100] flex items-end justify-center top-0 left-0">
            <MyOverlay setter={openModal} />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className=" w-fit h-fit p-5 relative  min-w-[40vw]  bg-zinc-300/40 z-100 backdrop-blur-3xl"
              variants={modalVariants}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 400,
              }}
              style={{
                borderTopLeftRadius: "20px", // Rayon supérieur gauche
                borderTopRightRadius: "20px", // Rayon supérieur droit
              }}
            >
              {/* Contenu de la modal */}

              <div className="text-lg">{title}</div>
              <div className="max-h-[80vh] overflow-y-scroll hide-scrollbar">
                {children}
              </div>
              {btns?.submit && cv > 0 && (
                <MyBtnPost
                  setter={handleSubmit}
                  style="btn btn-xs my-2 ml-auto flex items-center h-fit  btn-outline c2"
                >
                  {btns?.submit}
                </MyBtnPost>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
