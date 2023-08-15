import React, { useState } from "react";
import { PubProfile } from "./PubProfile";
import { InputText, InputTextArea } from "components/inputs";
import { createPubOnPinata } from "utils/ui-tools/pinata-tools";
import { _setterAccessControl } from "utils/ui-tools/web3-tools";
import { MyModal } from "components/modal/MyModal";
import { useAuthState } from "context/auth";
import { Icon } from "@iconify/react";
import { icfyMISSION, icfySEND } from "icones";

export const CreationPub = () => {
  const { cv } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [forceModal, setForceModal] = useState(false);
  const [datas, setDatas] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleChange = (target, value) => {
    setDatas({ ...datas, [target]: value });
  };

  const handleChangeImage = (e) => {
    setDatas({ ...datas, image: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    const tokenURI = await createPubOnPinata(datas);
    await _setterAccessControl("createPub", [tokenURI]);
    setLoading(false);

    setForceModal(true);
  };
  return (
    <MyModal
      styles={{ modal: "h-fit" }}
      force={forceModal}
      btn={"Create"}
      modal={
        <div className="flex flex-col  h-full">
          <PubProfile address={cv} />
          <div className="mt-5 mb-3">
            <InputText
              value={datas.title}
              setter={handleChange}
              target={"title"}
              title={"Title ..."}
            />
          </div>

          <InputTextArea
            value={datas.description}
            setter={handleChange}
            target={"description"}
            title={"What's new ?"}
          />
          <div className="flex items-center mt-5">
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary file-input-xs w-full max-w-xs"
              onChange={handleChangeImage}
            />

            {/* <Icon
                      icon={icfyIMG}
                      // onClick={handleChangeImage}
                      className="text-[40px] cursor-pointer text-info mr-5"
                    /> */}

            <Icon
              icon={icfyMISSION}
              className="text-[40px] text-info mr-5 cursor-pointer"
            />
            <div
              className="btn btn-primary text-white px-5 btn-sm ml-auto"
              onClick={handleSubmit}
            >
              {!loading ? (
                <>
                  Submit
                  <Icon
                    icon={icfySEND}
                    className="text-xl  ml-auto cursor-pointer"
                  />
                </>
              ) : (
                <span className="loading loading-dots loading-md text-white" />
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};
