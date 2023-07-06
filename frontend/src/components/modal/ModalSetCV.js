import { Icon } from "@iconify/react";
import { doAuthCV, useAuthDispatch, useAuthState } from "context/auth";
import { icfySEND, icfySETTINGS } from "icones";

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
      <div className="btn btn-ghost absolute top-3 right-3">
        <Icon
          icon={icfySETTINGS}
          className="text-[30px] text-black"
          onClick={() => window.my_modal_4.showModal()}
        />
      </div>

      <dialog id="my_modal_4" className="modal">
        <form method="dialog" className="modal-box  w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">CV Informations</h3>
          <div className=" flex flex-col mt-10">
            <label htmlFor="name">Change name :</label>
            <div className="join">
              <input
                type="text"
                placeholder="Type a new name"
                className="input join-item input-bordered bg-white input-primary text-black w-full max-w-xs"
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="btn  btn-primary join-item"
                onClick={onClickSetName}
              >
                <Icon icon={icfySEND} className="text-white" />
              </button>
            </div>
          </div>
          <div className=" flex flex-col mt-4">
            <label htmlFor="name">Change ownership :</label>
            <div className="join">
              <input
                type="text"
                placeholder="Type a new address"
                className="input bg-white join-item text-black   w-full max-w-xs"
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="btn  btn-primary join-item"
                onClick={onClickSetName}
              >
                <Icon icon={icfySEND} className="text-white" />
              </button>
            </div>
          </div>

          <div className="modal-action">
            {/* if there is a button, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
};
