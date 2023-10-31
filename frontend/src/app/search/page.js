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
import {
  icfy,
  icfyETHER,
  icfyLOCK,
  icfyROCKET,
  icfySEARCH,
  icfyUNLOCK,
  icsystem,
} from "icones";
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
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
export default function PageLaunchpad({ params }) {
  let { address } = useAccount();
  let state = useMissionState();

  return (
    <MyLayoutDashboard
      color={2}
      id={0}
      menus={[
        { title: "Jobs", icon: icsystem.feature },
        { title: "Freelancers", icon: icsystem.profile },
        { title: "Launchpad", ic: icsystem.escrow },
        { title: "Disputes", icon: icsystem.escrow },
      ]}
      template={1}
    >
      <Page />
    </MyLayoutDashboard>
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
    <div id={1} className="flex relative flex-col h-full   w-full">
      <div className="w-full flex rounded-lg items-center justify-between  bg-gradient-to-l from-neutral-200 to-neutral-300 mb-3">
        {/* <MyMenusTabs
          target={"value"}
          value={isPointer}
          color={0}
          setter={setIsPointer}
          arr={[
            { value: "Jobs", icon: icsystem.feature },
            { value: "Freelancers", icon: icsystem.profile },
            { value: "Launchpad", ic: icsystem.escrow },
            { value: "Disputes", icon: icsystem.escrow },
          ]}
        /> */}
        <div className="flex absolute -translate-y-full -top-5 right-0 items-center">
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
        {isExtend ? (
          <>
            <div className="flex  absolute flex-col w-full overflow-scroll hide-scrollbar">
              <p className="text-xs mb-1">Language techno</p>

              <MyMenusTabs
                setter={setIsCourt}
                value={isCourt}
                arr={ENUMS.courts.map((el) => (
                  <div className="flex items-center ">
                    <Icon icon={el.badge} className={"mr-3 "} />
                    {el?.court}
                  </div>
                ))}
              >
                All
              </MyMenusTabs>

              <div className="flex flex-row"></div>
            </div>

            <div className="flex  flex-col w-full">
              <p className="text-xs my-1">Domaine</p>

              <MyMenusTabs
                setter={setIsDomain}
                value={isDomain}
                arr={ENUMS.domain.map((el) => (
                  <div className="flex items-center">
                    <Icon icon={el.icon} className={"mr-3 text-" + el.color} />

                    {el?.name}
                  </div>
                ))}
              >
                All
              </MyMenusTabs>

              <div className="flex flex-row">
                <div className="flex mr-5 flex-col">
                  <p className="text-xs my-1">Invite only</p>

                  <MyMenusTabs
                    setter={setIsInvite}
                    value={isInvite}
                    arr={[
                      <div className="flex items-center">
                        <Icon icon={icfyLOCK} className="mr-3 text-error" />
                        Yes
                      </div>,
                      <div className="flex items-center">
                        <Icon icon={icfyUNLOCK} className="mr-3 text-success" />
                        No
                      </div>,
                    ]}
                  >
                    All
                  </MyMenusTabs>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs my-1">Visibility</p>

                  <MyMenusTabs
                    setter={setIsInvite}
                    value={isInvite}
                    arr={[
                      <div className="flex items-center">
                        {" "}
                        <Icon
                          icon={icfy.eye.open}
                          className="mr-3 text-success"
                        />
                        Disponible
                      </div>,
                      <div className="flex items-center">
                        {" "}
                        <Icon
                          icon={icfy.eye.close}
                          className="mr-3 text-error"
                        />
                        Indisponible
                      </div>,
                    ]}
                  >
                    All
                  </MyMenusTabs>
                </div>
                <div className="flex flex-col ml-5">
                  <p className="text-xs my-1">Experience</p>

                  <MyMenusTabs
                    setter={setIsStarted}
                    value={isStarted}
                    arr={[
                      <div className="flex items-center">Junior</div>,
                      <div className="flex items-center">
                        <Icon
                          icon={icfy.eye.close}
                          className="mr-3 text-error"
                        />
                        Senior
                      </div>,
                    ]}
                  >
                    All
                  </MyMenusTabs>
                </div>
              </div>
            </div>
          </>
        ) : (
          []
        )}
      </div>
      {lists?.[isPointer]}
      {/* <ListLaunchpads /> */}
      {/* <ListJobs /> */}
      {/* <ListProfiles /> */}
    </div>
  );
};
