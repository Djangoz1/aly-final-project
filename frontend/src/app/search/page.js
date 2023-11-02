"use client";

import { _table_features } from "utils/states/tables/feature";

import { icfy, icfyLOCK, icfySEARCH, icfyUNLOCK, icsystem } from "icones";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAccount } from "wagmi";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";
import { ListJobs } from "sections/list/ListJobs";
import { ListProfiles } from "sections/list/ListProfiles";
import { ListLaunchpads } from "sections/list/ListLaunchpads";
import { ENUMS } from "constants/enums";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";

import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { doPointerTools, useToolsDispatch, useToolsState } from "context/tools";
import { MySub } from "components/myComponents/text/MySub";
export default function PageSearch({ params }) {
  let { address } = useAccount();
  let { state, pointer } = useToolsState();
  let dispatch = useToolsDispatch();
  let [isPointer, setIsPointer] = useState();
  return (
    <MyLayoutDashboard
      color={2}
      id={0}
      menus={[
        { url: "#section0", title: "Jobs", icon: icsystem.feature },
        { url: "#section1", title: "Freelancers", icon: icsystem.profile },
        { url: "#section2", title: "Launchpad", ic: icsystem.escrow },
        { url: "#section3", title: "Disputes", icon: icsystem.escrow },
      ]}
      template={1}
    >
      <Page />
    </MyLayoutDashboard>
  );
}

let Page = () => {
  let { pointer } = useToolsState();
  let [isExtend, setIsExtend] = useState(null);
  let dispatch = useToolsDispatch();
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
     flex-col h-full   w-full"
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
        {isExtend ? (
          <div className="w-full flex flex-col   items-center justify-between  h-fit bg3 p-3 mb-3">
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

            <>
              <div className="flex  c1 flex-col w-full overflow-scroll hide-scrollbar">
                <MySub style={"mt-2 mb-5 font-bold"}>Language techno</MySub>

                <MyMenusTabs
                  template={2}
                  color={0}
                  setter={setIsCourt}
                  value={isCourt}
                  target={"title"}
                  arr={ENUMS.courts.map((el) => ({
                    title: el?.court,
                    icon: el?.badge,
                  }))}
                >
                  All
                </MyMenusTabs>

                <div className="flex flex-row"></div>
              </div>

              <div className="flex c1 flex-col w-full">
                <MySub style={"mt-2  mb-5 font-bold"}>Domaine</MySub>

                <MyMenusTabs
                  template={2}
                  color={2}
                  setter={setIsDomain}
                  value={isDomain}
                  target={"name"}
                  arr={ENUMS.domain}
                >
                  All
                </MyMenusTabs>

                <div className="flex flex-row">
                  <div className="flex mr-5 flex-col">
                    <MySub style={"mt-2  mb-5 font-bold"}>Invite only</MySub>

                    <MyMenusTabs
                      template={2}
                      color={0}
                      setter={setIsInvite}
                      value={isInvite}
                      arr={[
                        <div className="flex items-center">
                          <Icon icon={icfyLOCK} className="mr-3 text-error" />
                          Yes
                        </div>,
                        <div className="flex items-center">
                          <Icon
                            icon={icfyUNLOCK}
                            className="mr-3 text-success"
                          />
                          No
                        </div>,
                      ]}
                    >
                      All
                    </MyMenusTabs>
                  </div>
                  <div className="flex flex-col">
                    <MySub style={"mt-2  mb-5 font-bold"}>Visibility</MySub>

                    <MyMenusTabs
                      setter={setIsInvite}
                      value={isInvite}
                      template={2}
                      color={2}
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
                    <MySub style={"mt-2  mb-5 font-bold"}>experience</MySub>

                    <MyMenusTabs
                      setter={setIsStarted}
                      value={isStarted}
                      template={2}
                      color={0}
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
          </div>
        ) : (
          []
        )}
        <div className="overflow-y-scroll pt-10 backdrop-blur">
          {lists?.[pointer]}
        </div>
        {/* <ListLaunchpads /> */}
        {/* <ListJobs /> */}
        {/* <ListProfiles /> */}
      </div>
    </>
  );
};
