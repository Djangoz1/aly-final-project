"use client";

import {
  icfy,
  icfyETHER,
  icfyLOCK,
  icfySEARCH,
  icfyUNLOCK,
  icsystem,
} from "icones";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAccount } from "wagmi";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";

import { ENUMS } from "constants/enums";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";

import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import {
  doPointerTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MySub } from "components/myComponents/text/MySub";
import { v4 } from "uuid";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyBtns } from "components/myComponents/btn/MyBtns";
import { useAuthState } from "context/auth";
import { controllers } from "utils/controllers";

import { MyCardPrice } from "components/myComponents/card/MyCardPrice";
import { CVName } from "components/links/CVName";
import { MyStatus } from "components/myComponents/item/MyStatus";
import Link from "next/link";
import { MissionName } from "components/links/MissionName";
import { MyCardDropdown } from "components/myComponents/card/MyCardDropdown";
import { FeatureName } from "components/links/FeatureName";
import { MyBadge } from "components/myComponents/box/MyList";
import { MyCardInfos } from "components/myComponents/card/MyCard";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Avatar } from "components/profile/ProfileAvatar";
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
        id={1}
        className="flex relative   hide-scrollbar
      h-full   w-full"
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
            <button
              onClick={() => setIsExtend(!isExtend)}
              className=" btn btn-outline relative  "
            >
              <Icon icon={icfy.ux.filter} className="text-3xl c3  " />
            </button>
          </LayoutForm>
        </div>

        <div className="grid box-border gap-2 h-fit w-full 2xl:grid-cols-3 lg:grid-cols-2 px-3 grid-cols-1  md:grid-cols-2  ">
          {state?.lists?.map((el) => (
            <MyCardDropdown
              style={"h-fit w-full"}
              title={
                <FeatureName
                  missionID={el?.datas?.missionID}
                  metadatas={el?.metadatas}
                />
              }
              header={
                <div className="flex items-center text-[9px] gap-4">
                  <MyBadge style={"text-[9px]"} color={el?.metadatas?.domain}>
                    {ENUMS.domain?.[el?.metadatas?.domain]?.name}
                  </MyBadge>
                  <MyBadge
                    style={"text-[9px]"}
                    color={el?.datas?.specification}
                  >
                    {ENUMS.courts?.[el?.datas?.specification]?.court}
                  </MyBadge>
                  <MySub size={8} style={"flex items-center gap-1"}>
                    <MyNum num={el?.datas?.wadge}></MyNum>
                    ETH
                  </MySub>
                </div>
              }
              footer={
                <div className="flex w-full -mt-2 gap-2 flex-col">
                  <div className="text-[9px] font-light">
                    <MySub style={"c4 w-1/3"}>Resume</MySub>
                    {el?.metadatas?.abstract}
                  </div>
                  <div className="flex items-center w-full gap-2">
                    <MyStatus
                      target={"feature"}
                      status={el?.datas?.status}
                      padding={"px-2 py-1"}
                      style={"text-[9px] w-full"}
                    />

                    <MyMainBtn
                      template={1}
                      style={"btn-xs text-[10px]"}
                      url={`/mission/${el?.datas?.missionID}`}
                    >
                      View more
                    </MyMainBtn>
                  </div>
                </div>
              }
              key={v4()}
            >
              <MyCardInfos
                template={5}
                arr={[
                  {
                    title: "owner",
                    value: (
                      <Avatar designation={true} _cvID={el?.datas?.owner} />
                    ),
                  },
                  {
                    title: "Invite only",
                    value: `${el?.datas?.isInviteOnly ? "Yes" : "No"}`,
                  },
                  {
                    title: "mission",
                    value: (
                      <MissionName
                        id={el?.datas?.missionID}
                        metadatas={el?.metadatas?.["@expand"]?.missionID?.title}
                      />
                    ),
                  },

                  {
                    title: "description",
                    value: (
                      <div className="flex flex-col">
                        <MySub size={8}>Mission</MySub>
                        <article
                          dangerouslySetInnerHTML={{
                            __html: `
                              ${el?.metadatas?.["@expand"]?.missionID?.abstract}
                              ${el?.metadatas?.["@expand"]?.missionID?.description}
                                `,
                          }}
                        />
                        <MySub style={"mt-4"} size={8}>
                          Feature
                        </MySub>

                        <article
                          dangerouslySetInnerHTML={{
                            __html: `${el?.metadatas?.abstract}
                              ${el?.metadatas?.description}`,
                          }}
                        />
                      </div>
                    ),
                  },
                  {
                    title: "skills required",
                    value: (
                      <div className="flex flex-wrap w-2/3 gap-1">
                        {el?.metadatas?.skills?.map((el, i) => (
                          <MyBadge color={i} style={"text-[10px]"}>
                            {el}
                          </MyBadge>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "Temps estimés",
                    num: el?.datas?.estimatedDays,
                    value: "Days",
                  },

                  {
                    title: "Currency",
                    value: (
                      <MyStatus
                        style={"text-[9px]"}
                        padding={"px-2 py-1"}
                        target={"token"}
                        status={el?.datas?.acceptToken ? 0 : 1}
                      />
                    ),
                  },
                ]}
              />
            </MyCardDropdown>
          ))}
          {/* // <MyCardPrice
            //   description={
            //     <div className="flex flex-col">
            //       <div className="flex items-center">
            //         <Icon icon={icfy.work.casual} />
            //         <CVName
            //           cvID={el?.datas?.owner}
            //           metadata={el?.owner?.metadatas}
            //           styles={"text-xs text-white/60 mx-auto"}
            //         />
            //       </div>
            //     </div>
            //   }
            //   lists={[
            //     {
            //       title: "On invitation",
            //       check: el?.datas?.isInviteOnly,
            //     },
            //     {
            //       title: "Accept token ERC 20",
            //       check: false,
            //     },
            //     {
            //       title: (
            //         <div className="flex items-center">
            //           <span className="c4 mr-2">Worker:</span>
            //           <CVName cvID={el?.datas?.cvWorker} />
            //         </div>
            //       ),
            //       check: el?.datas?.cvWorker > 0,
            //     },
            //     {
            //       title: (
            //         <MyStatus
            //           status={el?.datas?.status}
            //           normal={true}
            //           target={"feature"}
            //         />
            //       ),
            //       check: el?.datas?.status === 2,
            //     },
            //   ]}
            //   price={el?.datas?.wadge}
            //   color={el?.datas?.status}
            //   badge={{
            //     title: el?.metadatas?.title,
            //     icon: ENUMS.courts?.[el?.datas?.specification]?.badge,
            //   }}
            //   style={"mx-10 mx-auto   mb-20 h-fit "}
            //   key={v4()}
            //   url={`/mission/${el?.datas?.missionID}`}
            //   title={
            //     <>
            //       <Link className="hover:text-info mx-auto"></Link>
            //       {el?.datas?.status === 0 && (
            //         <span className="flex absolute top-3 right-1 items-center text-xs mx-auto text-white/90">
            //           {el?.datas?.wadge}
            //           <Icon icon={icfyETHER} className="mr-1 text-3xl" />
            //         </span>
            //       )}
            //       <MyStatus
            //         status={el?.datas?.status}
            //         style={"mx-auto my-1"}
            //         target={"feature"}
            //       />
            //     </>
            //   }
            //   setter={
            //     el?.datas?.status === 0
            //       ? () => _apiPost("askToJoin", [el?.featureID])
            //       : null
            //   }
            //   btn={
            //     el?.datas?.status === 0 && cv && cv != el?.datas?.owner
            //       ? "Ask to join"
            //       : null
            //   }
            //   header={{
            //     icon: ENUMS.courts?.[el?.datas?.specification]?.badge,
            //     title: el?.metadatas?.title,
            //     component: <MissionName id={el?.datas?.missionID} />,
            //   }}
            //   main={{
            //     text: el?.metadatas?.description,
            //   }}
            // >
            //   <div className="w-full flex flex-col text-justify items-start">
            //     <MissionName id={el?.datas?.missionID} style={"text-xs mb-2"} />
            //     <p className="line-clamp-6">{el?.metadatas?.description}</p>
            //   </div>
            // </MyCardPrice> */}
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
