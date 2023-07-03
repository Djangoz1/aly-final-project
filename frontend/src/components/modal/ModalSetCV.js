import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";

import React, { useState } from "react";
import { _setName } from "utils/ui-tools/auth-tools";
import { _setterCV } from "utils/ui-tools/web3-tools";
import { useAccount } from "wagmi";

export const ModalSetCV = () => {
  const { cv } = useAuthState();
  const { address } = useAccount();
  const [name, setName] = useState();
  const dispatch = useAuthDispatch();
  const onClickSetName = async () => {
    await _setterCV(cv, "setName", [name]);
    doAuthCV(dispatch, address);
  };
  return (
    <>
      {/* You can open the modal using ID.showModal() method */}
      <button className="btn" onClick={() => window.my_modal_4.showModal()}>
        Set a cv
      </button>
      <dialog id="my_modal_4" className="modal">
        <form method="dialog" className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">CV Informations :</h3>
          <div className=" join">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-primary w-full max-w-xs"
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn" onClick={onClickSetName}>
              Set
            </button>
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
