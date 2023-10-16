import { doStateFormModal, useFormDispatch, useFormState } from "context/form";
import React, { useEffect, useState } from "react";
import { styles as _styles } from "styles/style";
import { MyOverlay } from "../MyOverlay";
export const MyModal = ({ force, setForce, styles, modal, form, btn }) => {
  const [isOpen, setIsOpen] = useState(false);

  let formState = form && useFormState();

  let dispatch = form && useFormDispatch();
  const handleClick = () => {
    setIsOpen(!isOpen);
    if (form) {
      console.log("isOpen", !isOpen);
      doStateFormModal(dispatch, !isOpen);
    }
  };
  useEffect(() => {
    if (force && isOpen) {
      setIsOpen(false);
      setForce(false);
    }
    if (!isOpen && setForce) {
      setForce(true);
    }
  }, [force, isOpen]);

  useEffect(() => {
    if (form && !formState.modal) {
      setIsOpen(false);
    }
  }, [formState?.modal]);

  return (
    <>
      <button
        className={`btn  ${
          styles?.btn
            ? styles?.btn
            : _styles.gbtn + " w-fit gb1 cursor-pointer btn-xs"
        }`}
        onClick={handleClick}
      >
        {btn}
      </button>
      {isOpen && (
        <div className="absolute">
          <div className="fixed h-screeen justify-center flex items-center w-screen font2  top-0 left-0">
            <MyOverlay setter={handleClick} style={"debug left-0 top-0"} />
            <div
              className={`backdrop-blur bg-zinc-900  ${
                styles?.modal || "w-fit"
              } hide-scrollbar z-100 overflow-y-auto p-5 max-h-[90vh] rounded-xl shadow-2xl  relative   `}
            >
              {modal}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
