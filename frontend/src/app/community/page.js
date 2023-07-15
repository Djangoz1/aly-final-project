"use client";
import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { Layout } from "sections/Layout";
import { v4 as uuidv4 } from "uuid";
import { _getAllPubsState } from "utils/ui-tools/pubs-tools";
import {
  _getterPubsHub,
  _setterAccessControl,
  _setterPubsHub,
} from "utils/ui-tools/web3-tools";
import { CVName } from "components/inputs/inputsCV/CVName";
import { Icon } from "@iconify/react";
import { icfyHEART, icfyIMG, icfyMISSION, icfySEND } from "icones";
import { MyModal } from "components/modal/MyModal";
import { PubProfile } from "components/Pub/PubProfile";
import { InputText, InputTextArea } from "components/inputs";
import { createPubOnPinata } from "utils/ui-tools/pinata-tools";
import { ImagePin } from "components/Image/ImagePin";

const Community = () => {
  const { cv, missionId } = useAuthState();
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceModal, setForceModal] = useState(false);

  const getAllPubs = async () => {
    const pubs = await _getAllPubsState();
    setPubs(pubs);
  };

  useEffect(() => {
    getAllPubs();
  }, []);

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
    getAllPubs();
    setForceModal(true);
  };

  console.log(pubs[0]);
  return (
    <Layout>
      <div className="w-full flex flex-col">
        Community
        <div className="w-[200px] ml-auto  my-5">
          <MyModal
            force={forceModal}
            btn={"+"}
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
                  <input type="file" onChange={handleChangeImage} />
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
                    className="btn btn-info px-5 btn-sm ml-auto"
                    onClick={handleSubmit}
                  >
                    {!loading ? (
                      <Icon
                        icon={icfySEND}
                        className="text-[20px] text-white ml-auto cursor-pointer"
                      />
                    ) : (
                      <span className="loading loading-dots loading-md text-white" />
                    )}
                  </div>
                </div>
              </div>
            }
          />
        </div>
        {pubs?.map((pub) => (
          <div
            key={uuidv4()}
            className="bg-white rounded mb-4 p-4 w-full flex flex-col"
          >
            <PubProfile address={pub.owner} style={"mb-5"} />
            <p className="text-black font-black">{pub.title}</p>
            <p className="text-black">{pub.description}</p>
            <div className="w-[340px]">
              {pub?.image && <ImagePin CID={pub?.image} />}
            </div>
            <div className="flex ">
              <div className="flex mr-4 text-black/40 hover:text-info cursor-pointer">
                <Icon
                  icon={icfyMISSION}
                  className=" hover:text-info  text-2xl mr-2"
                />
                No Mission
              </div>
              <div className="flex hover:text-info cursor-pointer">
                <Icon icon={icfyHEART} className=" text-2xl mr-2 " />0
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Community;
