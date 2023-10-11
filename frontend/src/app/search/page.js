"use client";

import { MyTable } from "components/myComponents/table/MyTable";

import {
  HEAD_table_features,
  _table_features,
} from "utils/states/tables/feature";

import { LayoutMission } from "sections/works/Missions/LayoutMission";
import {
  doStateMission,
  useMissionDispatch,
  useMissionState,
} from "context/hub/mission";
import {
  MyCard,
  MyCard1,
  MyCardList,
} from "components/myComponents/card/MyCard";
import { icfy, icfyETHER, icfyROCKET, icfySEARCH } from "icones";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { CVName } from "components/inputs/inputsCV/CVName";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { doStateCV } from "context/hub/cv";

import { MyCalendar } from "components/myComponents/MyCalendar";
import { MENUS_EDIT } from "constants/menus";
import { doAuthCV, useAuthDispatch } from "context/auth";
import { useAccount } from "wagmi";
import { LayoutLaunchpad } from "sections/Launchpad/LayoutLaunchpad";
import { useLaunchpadState } from "context/hub/launchpad";
import { MyCountdown } from "components/myComponents/MyCountdown";
import { Hg } from "components/text/HeroGradient";
import { STATUS } from "constants/status";
import { ethers } from "ethers";
import { ProfileAvatar } from "components/profile/ProfileAvatar";
import useSpline from "@splinetool/r3f-spline";
import { OrthographicCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Spline from "@splinetool/react-spline";
import { FormProvider, useFormState } from "context/form";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { Layout } from "sections/Layout";
import { MySection } from "components/myComponents/MySection";
import { ListJobs } from "sections/list/ListJobs";
import { ListProfiles } from "sections/list/ListProfiles";
import { ListLaunchpads } from "sections/list/ListLaunchpads";
import { ENUMS } from "constants/enums";
import { Viewport } from "components/myComponents/layout/MyViewport";
import { LayoutTools } from "sections/Layout/LayoutTools";
export default function PageLaunchpad({ params }) {
  let { address } = useAccount();
  let state = useMissionState();

  return (
    <LayoutTools>
      <Viewport id={"All"} index={0} styles={"items-start"}>
        <Page />
      </Viewport>
    </LayoutTools>
  );
}

let Page = () => {
  let [isPointer, setIsPointer] = useState(0);
  let [isExtend, setIsExtend] = useState(null);
  let filterJobs = (job) => {
    let allowed = false;

    if (
      (job?.datas?.specification === isCourt || isCourt <= 1) &&
      ((job?.datas?.isInviteOnly && isInvite === 1) ||
        (!job?.datas?.isInviteOnly && isInvite === 2) ||
        isInvite === 0) &&
      (isStarted === 0 ||
        (isStarted === 1 && parseInt(job?.datas?.startedAt) > 0) ||
        (isStarted === 2 && parseInt(job?.datas?.startedAt) === 0))
    ) {
      allowed = true;
    }

    return allowed;
  };
  let filterProfile = (profile) => {
    let allowed = false;

    if (
      (profile?.details?.badges.includes(isCourt) || isCourt <= 1) &&
      ((profile?.metadatas?.attributes?.[0]?.visibility && isInvite === 1) ||
        (!profile?.metadatas?.attributes?.[0]?.visibility && isInvite === 2) ||
        isInvite === 0) &&
      (isStarted === 0 ||
        (isStarted === 2 && profile?.datas?.proposals?.length > 0) ||
        (isStarted === 1 && profile?.datas?.proposals?.length === 0))
    ) {
      allowed = true;
    }
    console.log("filter profile page search ....", allowed);

    return allowed;
  };

  let lists = [
    <ListJobs bool={filterJobs} />,
    <ListProfiles bool={filterProfile} />,
    <ListLaunchpads />,
  ];
  let [isCourt, setIsCourt] = useState(0);
  let [isDomain, setIsDomain] = useState(null);
  let [isInvite, setIsInvite] = useState(0);
  let [isStarted, setIsStarted] = useState(0);

  let setterMenu = (index) => {
    setIsPointer(index);
    setIsCourt(0);
    setIsInvite(0);
    setIsStarted(0);
    setIsDomain(0);
  };
  return (
    <div
      id={1}
      className="flex flex-col h-full overflow-scroll hide-scrollbar w-full"
    >
      <MyCard1
        styles={"w-full mb-10"}
        color={1}
        setterMenu={setterMenu}
        menus={["Jobs", "Freelancers", "Launchpad", "Disputes"]}
        head={{
          title: "Search",
          component: (
            <button
              onClick={() => setIsExtend(!isExtend)}
              className="absolute top-0 right-0 btn btn-outline btn-xs"
            >
              Filter
            </button>
          ),
          icon: icfySEARCH,
        }}
        components={
          isExtend
            ? [
                <div className="flex  flex-col w-full">
                  <p className="text-xs mb-1">Language techno</p>

                  <div className="flex w-full overflow-x-scroll hide-scrollbar">
                    <button
                      onClick={() => setIsCourt(0)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        0 === isCourt ? "c1 bg2" : "c2"
                      }`}
                    >
                      All
                    </button>
                    {ENUMS.courts.map(
                      (el, i) =>
                        i > 1 && (
                          <button
                            onClick={() => setIsCourt(i)}
                            className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                              i === isCourt ? "c1 bg2" : "c2"
                            }`}
                            key={v4()}
                          >
                            <Icon icon={el.badge} />
                            {el?.court}
                          </button>
                        )
                    )}
                  </div>
                  <p className="text-xs my-1">Invite only</p>

                  <div className="flex w-full  overflow-x-scroll hide-scrollbar">
                    <button
                      onClick={() => setIsInvite(0)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        0 === isInvite ? "c1 bg2" : "c2"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setIsInvite(1)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        1 === isInvite ? "c1 bg2" : "c2"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setIsInvite(2)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        2 === isInvite ? "c1 bg2" : "c2"
                      }`}
                    >
                      No
                    </button>
                  </div>
                  <p className="text-xs my-1">Started</p>

                  <div className="flex w-full  overflow-x-scroll hide-scrollbar">
                    <button
                      onClick={() => setIsStarted(0)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        0 === isStarted ? "c1 bg2" : "c2"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setIsStarted(1)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        1 === isStarted ? "c1 bg2" : "c2"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setIsStarted(2)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        2 === isStarted ? "c1 bg2" : "c2"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>,
                <div className="flex  flex-col w-full">
                  <p className="text-xs mb-1">Language techno</p>

                  <div className="flex w-full overflow-x-scroll hide-scrollbar">
                    <button
                      onClick={() => setIsCourt(0)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        0 === isCourt ? "c1 bg2" : "c2"
                      }`}
                    >
                      All
                    </button>
                    {ENUMS.courts.map(
                      (el, i) =>
                        i > 1 && (
                          <button
                            onClick={() => setIsCourt(i)}
                            className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                              i === isCourt ? "c1 bg2" : "c2"
                            }`}
                            key={v4()}
                          >
                            <Icon icon={el.badge} />
                            {el?.court}
                          </button>
                        )
                    )}
                  </div>
                  <p className="text-xs my-1">Domaine</p>

                  <div className="flex w-full overflow-x-scroll hide-scrollbar">
                    <button
                      onClick={() => setIsDomain(null)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        isDomain === null ? "c1 bg2" : "c2"
                      }`}
                    >
                      All
                    </button>
                    {ENUMS.domain.map(
                      (el, i) =>
                        i > 1 && (
                          <button
                            onClick={() => setIsDomain(i)}
                            className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                              i === isDomain ? "c1 bg2" : "c2"
                            }`}
                            key={v4()}
                          >
                            <Icon
                              icon={el.icon}
                              className={"text-" + el.color}
                            />
                            {el?.name}
                          </button>
                        )
                    )}
                  </div>
                  <p className="text-xs my-1">Visibility</p>

                  <div className="flex w-full  overflow-x-scroll hide-scrollbar">
                    <button
                      onClick={() => setIsInvite(0)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        0 === isInvite ? "c1 bg2" : "c2"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setIsInvite(1)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        1 === isInvite ? "c1 bg2" : "c2"
                      }`}
                    >
                      Disponible
                    </button>
                    <button
                      onClick={() => setIsInvite(2)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        2 === isInvite ? "c1 bg2" : "c2"
                      }`}
                    >
                      Indisponible
                    </button>
                  </div>
                  <p className="text-xs my-1">Experience</p>

                  <div className="flex w-full  overflow-x-scroll hide-scrollbar">
                    <button
                      onClick={() => setIsStarted(0)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        0 === isStarted ? "c1 bg2" : "c2"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setIsStarted(1)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        1 === isStarted ? "c1 bg2" : "c2"
                      }`}
                    >
                      Junior
                    </button>
                    <button
                      onClick={() => setIsStarted(2)}
                      className={`flex btn-xs rounded-full   mr-8  items-center btn  ${
                        2 === isStarted ? "c1 bg2" : "c2"
                      }`}
                    >
                      Senior
                    </button>
                  </div>
                </div>,
              ]
            : []
        }
      ></MyCard1>
      {lists?.[isPointer]}
      {/* <ListLaunchpads /> */}
      {/* <ListJobs /> */}
      {/* <ListProfiles /> */}
    </div>
  );
};
