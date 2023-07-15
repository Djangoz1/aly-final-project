"use client";
import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { Layout } from "sections/Layout";
import { v4 as uuidv4 } from "uuid";
import { _getAllPubsState } from "utils/ui-tools/pubs-tools";
import { _getterPubsHub } from "utils/ui-tools/web3-tools";
import { CVName } from "components/inputs/inputsCV/CVName";
import { Icon } from "@iconify/react";
import { icfyHEART, icfyMISSION } from "icones";

const Community = () => {
  const { cv, missionId } = useAuthState();
  const [pubs, setPubs] = useState([]);
  useEffect(() => {
    (async () => {
      const pubs = await _getAllPubsState();
      setPubs(pubs);
    })();
  }, []);

  return (
    <Layout>
      <div className="w-full flex flex-col">
        Community
        <button className="btn btn-info rounded-full text-white ml-auto">
          +
        </button>
        {pubs?.map((pub) => (
          <div
            key={uuidv4()}
            className="bg-white rounded mb-4 p-4 w-full flex flex-col"
          >
            <div className="flex mb-5 ">
              <img
                alt="photo profile"
                src={"/profile.jpeg"}
                className="w-[70px] rounded-full "
              />
              <div className="flex flex-col justify-end ml-5">
                <CVName
                  styles={"text-black font-bold text-2xl"}
                  address={pub?.owner}
                />
                <span className="text-[9px]">{pub?.owner}</span>
              </div>
            </div>
            <p className="text-black font-black">{pub.title}</p>
            <p className="text-black">{pub.description}</p>
            <img
              src="/github.jpeg"
              alt="publication image"
              className="w-3/4 rounded-xl my-5 mx-auto"
            />
            <div className="flex">
              <div className="flex mr-4">
                <Icon
                  icon={icfyMISSION}
                  className="text-black/40 text-2xl mr-2"
                />
                No Mission
              </div>
              <div className="flex ">
                <Icon
                  icon={icfyHEART}
                  className="text-black/40 text-2xl mr-2"
                />
                0
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Community;
