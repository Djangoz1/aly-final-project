"use client";

import React, { useEffect, useState } from "react";

import { styles } from "styles/style";

import { ADDRESSES } from "constants/web3";
import { _apiGet } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Hg1 } from "components/text/HeroGradient";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { icfy } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { Viewport } from "components/myComponents/layout/MyViewport";
import { MyCardIc } from "components/myComponents/card/MyCardIc";

const EscrowPage = () => {
  let [isList, setIsList] = useState(null);

  let { metadatas, cv } = useAuthState();
  let fetchLaunchpads = async () => {
    let length = parseInt(
      await _apiGet("tokensLengthOf", [ADDRESSES["launchpadHub"]])
    );
    let arr = [];
    for (let index = 1; index <= length; index++) {
      arr.push(index);
    }
    setIsList(arr);
  };

  useEffect(() => {
    if (!isList) {
      fetchLaunchpads();
    }
  }, [cv]);

  return (
    <>
      <div className="bg-animation">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>

      <MyLayoutApp>
        <Viewport full={true} particles={true} id={"hero"} index={0}>
          <div className="w-full   items-center h-full flex">
            <div className="w-2/4 mt-auto">
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
              <div className="flex items-center">
                <div className="badge badge-warning badge-xs mr-3" />
                Build our trustless protocole
              </div>
            </div>
          </div>
        </Viewport>

        <Viewport full={true} particles={true} id={"presentation"} index={1}>
          <div className=" my-auto font2">
            <h2
              className={`text-center font-light text-white/20 text-[34px] mb-[6vh]`}
            >
              <Hg1 style={"font-light "}>Escrow protocole</Hg1>
            </h2>
            <div className="flex justify-evenly">
              <MyCardIc
                icon={icfy.court.injustice}
                title={"Protect by Juror"}
              />

              <MyCardIc icon={icfy.ux.warning} title={"Escrow protocole"} />
              <MyCardIc icon={icfy.court.justice} title={"Became juror"} />
            </div>
          </div>
        </Viewport>
      </MyLayoutApp>
    </>
  );
};

export default EscrowPage;
