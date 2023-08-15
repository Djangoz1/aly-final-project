import React, { useEffect, useState } from "react";

export const MyModal = ({ force, styles, btn, modal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (force) {
      setIsOpen(false);
    }
  }, [force]);
  return (
    <>
      <button
        className={`btn  ${
          styles?.btn
            ? styles?.btn
            : " w-full btn-primary cursor-pointer btn-xs"
        }`}
        onClick={handleClick}
      >
        {btn}
      </button>
      {isOpen && (
        <div className="fixed h-screeen w-screen  z-50 top-0 left-0">
          <div
            className=" bg-black/40 top-0 left-0 h-screen w-screen"
            onClick={handleClick}
          />
          <div className="bg-zinc-900 w-3/4 hide-scrollbar overflow-y-auto p-5 max-h-[90vh] rounded-xl shadow-2xl border border-white/30 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {modal}
          </div>
        </div>
      )}
    </>
  );
};
