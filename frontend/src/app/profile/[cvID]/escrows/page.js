"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import { useToolsState } from "context/tools";

import { Icon } from "@iconify/react";
import { icfyETHER, icsystem } from "icones";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { ENUMS } from "constants/enums";
import { v4 } from "uuid";

import { MySub } from "components/myComponents/text/MySub";

import { LayoutProfile } from "sections/Layout/layouts/LayoutProfile";

import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyStatus } from "components/myComponents/item/MyStatus";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";

import { MyBadge, MyList } from "components/myComponents/box/MyList";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
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

  return (
    <LayoutProfile
      controller={"arbitrators"}
      cvID={cvID}
      target={"profile"}
      url={"/escrows"}
    >
      <div className="flex w-full flex-col-reverse">
        <MyList
          title={"Arbitrators"}
          description={"All invitations disputes"}
          withoutBtn={true}
          arr={state?.arbitrators
            ?.flatMap((el, i) => el?.invitations)
            ?.map((el, i) => {
              return [
                el?.metadatas?.["@expand"]?.featureID?.title,
                el?.datas?.nbArbitrators - el?.datas?.arbitrators?.length,
                <MyStatus
                  style={"text-[9px] w-full"}
                  padding={"px-2 py-1"}
                  target={"dispute"}
                  status={el?.datas?.rules?.status}
                />,
                <MyBadge>
                  <MyNum num={el?.datas?.value} /> ETH
                </MyBadge>,
                !el?.datas?.arbitrators?.includes(
                  state?.arbitrators?.[i]?.datas?.id
                ) ? (
                  <div className="flex items-center gap-2 w-fit ml-auto">
                    <MyMainBtn
                      template={1}
                      style={"btn-xs "}
                      color={3}
                      setter={async () =>
                        await _apiPost("refuseArbitration", [el?.disputeID])
                      }
                    >
                      Refuse
                    </MyMainBtn>
                    <MyMainBtn
                      color={2}
                      template={1}
                      style={"btn-xs "}
                      setter={async () =>
                        await _apiPost("acceptArbitration", [el?.disputeID])
                      }
                    >
                      Join
                    </MyMainBtn>
                  </div>
                ) : (
                  <MySub>
                    Waiting{" "}
                    {el?.datas?.rules?.status == 2 ? "votes" : "arbitrators"}
                  </MySub>
                ),
              ];
            })}
          head={["Feature", "Arbitrators slots", "Status", "Value", ""]}
        />

        <div className="flex w-full">
          <MyScrolledXDiv>
            <>
              {state?.arbitrators?.map((el) => (
                <MyCardDropdown
                  title={
                    <div classname="flex gap-1 flex-row w-fit">
                      <Icon icon={ENUMS.courts?.[el?.datas?.courtID]?.badge} />
                      {ENUMS.courts?.[el?.datas?.courtID]?.court}
                    </div>
                  }
                  key={v4()}
                  header={
                    <>
                      <Icon className="mr-1" icon={icsystem.escrow} />
                      <MyNum num={parseInt(el?.datas?.nbArbitrations)}>
                        <MySub style="ml-2">Arbitrations</MySub>
                      </MyNum>
                    </>
                  }
                  footer={
                    <MyStatus
                      style={"text-[9px] w-full"}
                      padding={"px-2 py-1"}
                      status={el?.datas?.banned ? 1 : 0}
                      target={"arbitrator"}
                    />
                  }
                ></MyCardDropdown>
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
