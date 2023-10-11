import { doStateFormModal, useFormDispatch, useFormState } from "context/form";
import React, { useEffect, useState } from "react";
import { styles as _styles } from "styles/style";
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
        <div className="fixed h-screeen justify-center flex items-center w-screen font2  z-150 top-0 right-0">
          <div
            className=" bg-black/40 absolute   top-0 left-0 h-screen w-screen"
            onClick={handleClick}
          />
          <div
            className={`backdrop-blur  ${
              styles?.modal || "w-fit"
            } hide-scrollbar z-100 overflow-y-auto p-5 max-h-[90vh] rounded-xl shadow-2xl  relative   `}
          >
            {modal}
          </div>
        </div>
      )}
    </>
  );
};
