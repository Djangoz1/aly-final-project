import React from "react";

export const ModalSetCV = () => {
  return (
    <>
      {/* You can open the modal using ID.showModal() method */}
      <button className="btn" onClick={() => window.my_modal_4.showModal()}>
        Set a cv
      </button>
      <dialog id="my_modal_4" className="modal">
        <form method="dialog" className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">CV Informations :</h3>
          <div className="flex flex-col">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-primary w-full max-w-xs"
            />
          </div>
          <p className="py-4">Click the button below to close</p>
          <div className="modal-action">
            {/* if there is a button, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
};
