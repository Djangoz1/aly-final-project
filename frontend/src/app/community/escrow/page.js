"use client";

import React, { useEffect, useState } from "react";

import { styles } from "styles/style";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Hg1 } from "components/text/HeroGradient";

import { icfy } from "icones";

import { MyCardIc } from "components/myComponents/card/MyCardIc";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { useToolsDispatch, useToolsState } from "context/tools";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";

const EscrowPage = () => {
  let [isList, setIsList] = useState(null);
  let { pointer } = useToolsState();
  let { metadatas, cv } = useAuthState();

  let dispatch = useToolsDispatch();

  console.log("pointer", pointer);
  return (
    <>
      <MyLayoutDashboard
        template={2}
        url={"/community/escrow"}
        target={"escrowIntro"}
        noMenu={true}
        menus={[{ title: "hero" }, { title: "intro" }]}
      >
        <div className="w-full   items-end h-full flex">
          <div className=" flex   items-end  mt-auto">
            <div className="flex flex-col">
              <Hg1
                className="text-xs leading-0 font2 uppercase"
                gradient={[
                  "to right",
                  "rgba(201,78,21,0.92), rgba(201,21,103,1)",
                ]}
              >
                Powered by workers experiment
              </Hg1>
              <h3 className={styles.hero}>
                Trust on
                <br />
                <Hg1 style={"font-normal"}>Protocole</Hg1>
                <br />
                Code is <Hg1 style={"font-normal"}>Law</Hg1>
              </h3>

              <div className="flex mt-3 items-center">
                <div className="badge badge-warning badge-xs mr-3" />
                Build our trustless protocole
              </div>
            </div>
            <MyMainBtn
              template={1}
              style={"ml-10"}
              url={"/community/escrow/lists"}
            >
              View court
            </MyMainBtn>
          </div>
        </div>
        <div className=" my-auto w-full font2">
          <div className="flex justify-evenly">
            <MyCardIc icon={icfy.court.injustice} title={"Protect by Juror"} />

            <MyCardIc icon={icfy.ux.warning} title={"Escrow protocole"} />
            <MyCardIc icon={icfy.court.justice} title={"Became juror"} />
          </div>
        </div>
      </MyLayoutDashboard>
    </>
  );
};

export default EscrowPage;
