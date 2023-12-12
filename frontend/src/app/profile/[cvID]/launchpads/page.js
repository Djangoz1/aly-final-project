"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsDispatch, useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";

import { _apiGet } from "utils/ui-tools/web3-tools";
import { ENUMS } from "constants/enums";
import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";
import { MyTable } from "components/myComponents/table/MyTable";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { CVName } from "components/links/CVName";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { MyBadge } from "components/myComponents/box/MyList";
import { ethers } from "ethers";
import { parseTimestamp } from "helpers";
import Link from "next/link";
import { LaunchpadName } from "components/links/LaunchpadName";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let ref = useRef(null);
  const cvID = params.cvID;

  let [isAmount, setIsAmount] = useState(null);

  useEffect(() => {
    if (state?.launchpads && !isAmount) {
      let amount = 0;
      for (let index = 0; index < state?.launchpads.length; index++) {
        const element = state?.launchpads[index];

        amount += parseFloat(element?.datas?.wadge);
      }

      setIsAmount(amount);
    }
  }, [state?.launchpads]);

  let dispatch = useToolsDispatch();
  let { colors } = ENUMS;
  return (
    <LayoutProfile
      controller={"launchpads"}
      cvID={cvID}
      target={"profile"}
      url={"/launchpads"}
    >
      <div className="flex w-full flex-col-reverse">
        <div className="flex w-full">
          <MyScrolledXDiv>
            <>
              {state?.launchpads?.map((el) => (
                <MyCardDropdown
                  footer={
                    <MyStatus
                      padding={"px-2 py-1"}
                      style={" w-full text-[9px]"}
                      target={"launchpad"}
                      status={el?.datas?.status}
                    />
                  }
                  header={
                    <>
                      <Icon icon={icfy.ux.admin} className="mr-1" />
                      <CVName metadata={el?.owner} />
                      <Icon icon={icfyETHER} className="ml-3 mr-1" />{" "}
                      <MyNum num={el?.datas?.amountRaised} />
                    </>
                  }
                  title={
                    <LaunchpadName
                      launchpadID={el?.launchpadID}
                      metadatas={el?.metadatas}
                    />
                  }
                  key={v4()}
                >
                  <MyCardInfos
                    style={"w-full"}
                    arr={[
                      {
                        title: "description",
                        value: el?.metadatas?.description,
                      },
                      {
                        title: "website",
                        value: (
                          <Link href={el?.metadatas?.website}>Website</Link>
                        ),
                      },
                      {
                        title: "min cap",
                        num: ethers.utils.formatEther(el?.datas?.minCap),
                      },
                      {
                        title: "max cap",
                        num: ethers.utils.formatEther(el?.datas?.maxCap),
                      },
                      {
                        title: "min invest",
                        num: ethers.utils.formatEther(el?.datas?.minInvest),
                      },
                      {
                        title: "max invest",
                        num: ethers.utils.formatEther(el?.datas?.maxInvest),
                      },
                      {
                        title: "sale end",
                        value: parseTimestamp(el?.datas?.saleEnd),
                      },
                      {
                        title: "sale start",
                        value: parseTimestamp(el?.datas?.saleStart),
                      },
                      {
                        title: "domain",
                        icon: ENUMS.domain[el?.metadatas?.domain]?.icon,
                        value: (
                          <MyBadge>
                            {ENUMS.domain[el?.metadatas?.domain]?.name}
                          </MyBadge>
                        ),
                      },
                    ]}
                  />
                </MyCardDropdown>
              ))}
            </>
          </MyScrolledXDiv>
        </div>
      </div>

      {/* <MissionProfile missionID={state?.front?.props?.[0]} /> */}
    </LayoutProfile>
  );
}

export default App;
