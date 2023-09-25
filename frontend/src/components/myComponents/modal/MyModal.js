import { doStateFormModal, useFormDispatch, useFormState } from "context/form";
import React, { useEffect, useState } from "react";

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
          styles?.btn ? styles?.btn : " w-fit btn-primary cursor-pointer btn-xs"
        }`}
        onClick={handleClick}
      >
        {btn}
      </button>
      {isOpen && (
        <div className="fixed h-screeen w-screen font2  z-50 top-0 left-0">
          <div
            className=" bg-black/40 top-0 left-0 h-screen w-screen"
            onClick={handleClick}
          />
          <div
            className={`bg-zinc-900 ${
              styles?.modal || "w-fit"
            } hide-scrollbar overflow-y-auto p-5 max-h-[90vh] rounded-xl shadow-2xl  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
          >
            {modal}
          </div>
        </div>
      )}
    </>
  );
};
