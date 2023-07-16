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
        className={`btn w-full ${
          styles?.btn ? styles?.btn : "btn-primary cursor-pointer btn-xs"
        }`}
        onClick={handleClick}
      >
        {btn}
      </button>
      {isOpen && (
        <div className="fixed h-screeen w-screen  top-0 left-0">
          <div
            className=" bg-black/40 top-0 left-0 h-screen w-screen"
            onClick={handleClick}
          />
          <div className="bg-white w-3/4 h-[70vh] p-5 rounded-xl shadow shadow-2xl border border-black/30 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {modal}
          </div>
        </div>
      )}
    </>
  );
};