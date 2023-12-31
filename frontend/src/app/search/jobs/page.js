"use client";

import { icfy, icfySEARCH, icsystem } from "icones";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAccount } from "wagmi";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";

import { ENUMS } from "constants/enums";

import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import {
  doPointerTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MySub } from "components/myComponents/text/MySub";
import { v4, v5 } from "uuid";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyBtns } from "components/myComponents/btn/MyBtns";
import { useAuthState } from "context/auth";
import { controllers } from "utils/controllers";

import { MyStatus } from "components/myComponents/item/MyStatus";

import { MissionName } from "components/links/MissionName";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { FeatureName } from "components/links/FeatureName";
import { MyBadge } from "components/myComponents/box/MyList";
import { MyCardInfos } from "components/myComponents/card/MyCard";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Avatar } from "components/profile/ProfileAvatar";
import { CVName } from "components/links/CVName";
import { MyTimer } from "components/myComponents/MyCountdown";
export default function PageSearch({ params }) {
  let { address } = useAccount();
  let [isLoading, setIsLoading] = useState(null);
  let { metadatas } = useAuthState();
  let { state, pointer } = useToolsState();
  let dispatch = useToolsDispatch();
  let [isPointer, setIsPointer] = useState();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      doStateTools(dispatch, {
        lists: await controllers.get.feature.list({
          expand: "missionID",
          filter: "",
        }),
      });
      setIsLoading(false);
    })();
  }, []);
  console.log(state);
  return (
    <MyLayoutDashboard
      color={2}
      isLoading={isLoading}
      target={"search"}
      owner={metadatas}
      url={"/search/jobs"}
      template={0}
    >
      <Page />
    </MyLayoutDashboard>
  );
}

let Page = () => {
  let { pointer, state } = useToolsState();
  let [isExtend, setIsExtend] = useState(null);
  let dispatch = useToolsDispatch();
  let { cv } = useAuthState();
  let [isCourt, setIsCourt] = useState(0);
  let [isDomain, setIsDomain] = useState(null);
  let [isInvite, setIsInvite] = useState(0);
  let [isStarted, setIsStarted] = useState(0);

  let setterMenu = (index) => {
    // setIsPointer(index);
    doPointerTools(dispatch, index);
    setIsCourt(0);
    setIsInvite(0);
    setIsStarted(0);
    setIsDomain(0);
  };
  return (
    <>
      <div
        className="flex mt-20 relative
 w-full"
      >
        <div className="flex  c1 absolute -translate-y-full -top-5 right-5 items-center">
          <LayoutForm
            stateInit={{
              placeholders: { search: "Search ..." },
              allowed: true,
              form: { target: "search", search: null },
            }}
          >
            <MyInput label={false} target={"search"} icon={icfySEARCH} />
          </LayoutForm>
        </div>

        <div className="grid box-border gap-2 h-fit w-full pb-20  px-3 grid-cols-1    ">
          {state?.lists?.map((el) => (
            <div
              key={v4()}
              className="px-4 py-3 hover:bg-white/10 backdrop-blur hover:border-white/15 border border-white/5 rounded-xl bg-white/5 rouded-lg shadow flex items-center justify-between w-full"
            >
              <Icon
                icon={ENUMS.courts[el?.datas?.specification]?.badge}
                className="text-[34px] mr-3 "
              />
              <div className="flex flex-col flex-auto h-full  gap-2">
                <MyTitle>{el?.metadatas?.title}</MyTitle>
                <div className="flex c4 gap-2   items-center">
                  <div className="flex gap-2 items-center">
                    <div className="p-2 rounded bg-white/5 ">
                      <Icon icon={icsystem.mission} />
                    </div>
                    <div className="flex flex-col">
                      <MySub size={8}>Mission</MySub>
                      <MissionName
                        style={
                          "c3 whitespace-nowrap max-w-[100px] truncate hover:max-w-fit text-xs"
                        }
                        id={el?.datas?.missionID}
                        missionHash={el?.metadatas?.missionID}
                      />
                    </div>
                  </div>
                  <div className="flex items-center c4 gap-2">
                    <div className="p-2 rounded bg-white/5 ">
                      <Icon icon={icfy.ux.admin} />
                    </div>
                    <div className="flex flex-col">
                      <MySub size={8}>Owner</MySub>
                      <CVName
                        styles={"c3 text-xs"}
                        cvID={el?.datas?.owner}
                        metadata={
                          el?.datas?.owner == state?.profile?.cvID
                            ? state?.profile?.metadatas
                            : undefined
                        }
                      />
                    </div>
                  </div>
                  {el?.datas?.cvWorker && (
                    <div className="flex items-center c4 gap-2">
                      <div className="p-2 rounded bg-white/5 ">
                        <Icon icon={icsystem.feature} />
                      </div>
                      <div className="flex flex-col">
                        <MySub size={8}>worker</MySub>
                        <CVName
                          styles={"c3 text-xs"}
                          cvID={el?.datas?.cvWorker}
                          metadata={
                            el?.datas?.cvWorker == state?.profile?.cvID
                              ? state?.profile?.metadatas
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                {el?.metadatas?.abstract ? (
                  <p className="text-[9px] max-w-[500px] text-white/70 font-light">
                    {el?.metadatas?.abstract}
                  </p>
                ) : (
                  <></>
                )}
                <div className="mt-auto flex items-center gap-2">
                  <MyStatus
                    status={el?.datas?.cvWorker ? el?.datas?.status : "hiring"}
                    target={el?.datas?.cvWorker ? "feature" : "_feature"}
                  />
                  <MyBadge color={1}>
                    {ENUMS.domain[el?.metadatas?.domain]?.name}
                  </MyBadge>
                </div>
              </div>
              <div className="flex h-full items-end min-w-1/4 w-1/4 justify-between flex-col">
                <div className="flex gap-2 justify-end">
                  <div className="c4 flex items-center gap-4">
                    <MySub size={8}>Claimable</MySub>
                    <MyTimer
                      style={"text-error text-[10px] whitespace-nowrap"}
                      days={el?.datas?.estimatedDays}
                      started={parseInt(el?.datas?.startedAt)}
                    />
                  </div>
                  <MyMainBtn color={2} style={"btn-xs"} icon={icfy.ux.star} />
                </div>
                <div className="flex gap-1 flex-wrap max-w-full justify-end my-2 ">
                  {el?.metadatas?.skills?.map((el) => (
                    <MyBadge
                      style={
                        "text-white/70 font-light text-[9px] hover:text-white/90"
                      }
                      color={1}
                      key={v4()}
                    >
                      <span className="truncate hover:max-w-fit max-w-[100px]">
                        {el}
                      </span>
                    </MyBadge>
                  ))}
                </div>
                <div className="flex gap-3 items-end">
                  <div className="c4">
                    <MySub size={8}>Wadge</MySub>
                    <MyNum style={"c3"} num={el?.datas?.wadge}>
                      <span className="c4 ml-1 text-xs">ETH</span>
                    </MyNum>
                  </div>

                  <MyMainBtn
                    url={"/mission/" + el?.datas?.missionID}
                    style={"btn-sm"}
                  >
                    View more
                  </MyMainBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-1/6  ml-auto overflow-y-scroll h-full  border border-white/5 border-r-white/0 border-b-white/0">
          <div className="border flex flex-wrap px-2 mb-5  border-t-white/5 border-white/0 py-4 gap-2">
            <MyTitle style={"mt-2 mb-3 font-bold"}>Language techno</MyTitle>
            <MyBtns
              value={isCourt}
              setter={setIsCourt}
              arr={ENUMS.courts.map((el) => el?.court)}
            >
              All
            </MyBtns>
          </div>

          <div className="border flex flex-wrap px-2 mb-5  border-t-white/5 border-white/0 py-4 gap-2">
            <MyTitle style={"mt-2  mb-5 font-bold w-full"}>Domaine</MyTitle>
            <MyBtns
              value={isDomain}
              setter={setIsDomain}
              arr={ENUMS.domain.map((el) => el?.name)}
            >
              All
            </MyBtns>
          </div>
          <div className="border flex flex-wrap px-2 mb-5  border-t-white/5 border-white/0 py-4 gap-2">
            <MyTitle style={"mt-2 w-full mb-5 font-bold"}>Invite only</MyTitle>

            <MyBtns setter={setIsInvite} value={isInvite} arr={["Yes", "No"]}>
              All
            </MyBtns>
          </div>
          <div className="border flex flex-wrap px-2 mb-5  border-t-white/5 border-white/0 py-4 gap-2">
            <MyTitle style={"mt-2  mb-5 font-bold w-full"}>Visibility</MyTitle>

            <MyBtns
              setter={setIsInvite}
              value={isInvite}
              arr={["Disponible", "Indisponible"]}
            >
              All
            </MyBtns>
          </div>
          <div className="border flex flex-wrap px-2 mb-5  border-t-white/5 border-white/0 py-4 gap-2">
            <MySub style={"mt-2  mb-5 w-full font-bold"}>experience</MySub>

            <MyBtns
              setter={setIsStarted}
              value={isStarted}
              arr={["Junior", "Senior"]}
            >
              All
            </MyBtns>
          </div>
        </div>
      </div>
    </>
  );
};
