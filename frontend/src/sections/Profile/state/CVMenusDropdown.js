import React, { useEffect, useMemo, useRef, useState } from "react";

import { useToolsState } from "context/tools";
import Link from "next/link";
import { ENUMS } from "constants/enums";

import { icfy, icfyARROWD, icfyCODE, icfyCODER, icfyROCKET } from "icones";

import { STATUS } from "constants/status";

import {
  stateDispute,
  stateFeature,
  stateLaunchpad,
  stateMission,
} from "utils/ui-tools/state-tools";
import { MyMenusDropdown } from "components/myComponents/menu/MyMenus";

export const CVMenusDropdown = ({ style }) => {
  let { state } = useToolsState();
  let [isFolders, setIsFolders] = useState(null);

  let fetchDisputes = async () => {
    if (isFolders?.disputes?.arr === null) {
      await fetchMission();
      await fetchJobs();
      await fetchArbitration();
    }
  };

  let [isCvID, setIsCvID] = useState(null);

  let fetchLaunchpads = async () => {
    let launchpads = state?.profile?.datas?.launchpads;
    let folders = { ...isFolders };

    if (folders?.launchpads?.arr === null) {
      console.log("----- fetch launchpad ------");

      let objectLaunchpads = JSON?.parse(JSON?.stringify(ENUMS.domain));

      for (let index = 0; index < launchpads?.length; index++) {
        let launchpad = await stateLaunchpad(launchpads[index]);
        let domain = launchpad?.metadatas?.attributes?.[0]?.domain;
        if (!objectLaunchpads[domain].arr?.length) {
          objectLaunchpads[domain].arr = [];
        }

        if (domain >= 0) {
          objectLaunchpads[domain].arr.push({
            target: "launchpad",
            props: [launchpad?.launchpadID],
            name: launchpad?.metadatas?.title,
            icon: icfyROCKET,
          });
        }
      }

      folders.launchpads.arr = objectLaunchpads.filter(
        (el) => el?.arr?.length > 0
      );

      folders.launchpads.arr.push({
        icon: icfy.ux.plus,
        name: <Link href={"/create/launchpad"}>Create launchpad</Link>,
        color: "success",
      });
      setIsFolders(folders);
    }
    return folders.launchpads.arr;
  };

  let fetchArbitration = async () => {
    let allowed = true;
    let folders = { ...isFolders };
    folders?.disputes?.arr?.filter((el) =>
      el?.name === "Arbitration" ? (allowed = false) : null
    );

    let arbitrators = state?.profile?.details?.arbitrators;
    console.log("aerrrere", arbitrators);
    if (allowed && arbitrators?.length > 0) {
      let objectCourt = JSON?.parse?.(JSON?.stringify(ENUMS.courts));
      console.log("----fetch arbitration------");

      for (let index = 0; index < arbitrators?.length; index++) {
        const arbitrator = arbitrators[index];
        console.log("arbitrato", arbitrator);

        for (let index = 0; index < arbitrator?.disputes?.length; index++) {
          const dispute = await stateDispute(
            arbitrator?.disputes[index]?.disputeID
          );
          if (!objectCourt[dispute?.datas?.courtID]?.arr?.length) {
            objectCourt[dispute?.datas?.courtID].arr = [];
            objectCourt[dispute?.datas?.courtID].name =
              objectCourt[dispute?.datas?.courtID].court;
            objectCourt[dispute?.datas?.courtID].icon =
              objectCourt[dispute?.datas?.courtID].badge;
          }

          objectCourt[dispute?.datas?.courtID].arr.push({
            name: dispute?.metadatas?.title,
            target: "disputes",
            props: [dispute?.disputeID],
            icon: icfy.court.injustice,
            color: "success",
          });
        }
      }

      let disputesArbitration = {
        name: "Arbitration",
        arr: objectCourt?.filter((el) => el?.arr?.length > 0),
        icon: icfy?.court?.hammer,
        color: "info",
      };
      if (disputesArbitration?.arr?.length > 0) {
        if (folders?.disputes?.arr === null) {
          folders.disputes.arr = [disputesArbitration];
        } else {
          folders.disputes.arr.push(disputesArbitration);
        }

        setIsFolders(folders);
      }
    }
    return isFolders.disputes.arr;
  };

  let fetchTechnos = async () => {
    let _jobs = await fetchJobs();
    let _missions = await fetchMission();
    let jobs = _jobs?.filter((el) => el?.arr?.length > 0);
    let folders = { ...isFolders };

    if (folders?.technologies?.arr === null) {
      console.log("----fetch technos -----");
      let technos = JSON?.parse(JSON?.stringify(ENUMS.courts));

      for (let index = 0; index < jobs?.length; index++) {
        let elem = jobs[index];

        for (let index = 0; index < elem.arr.length; index++) {
          const elem1 = elem.arr[index];
          if (!technos[elem1?.pointer].arr?.length) {
            technos[elem1?.pointer].arr = [];
            technos[elem1?.pointer].name = technos[elem1?.pointer].court;
            technos[elem1?.pointer].icon = technos[elem1?.pointer].badge;
          }

          technos[elem1?.pointer].arr.push({
            target: "feature",
            props: elem1?.props,
            name: elem1?.name,
            icon: icfy.code.casual,
            component: elem1?.component,
          });
        }
      }

      for (let index = 0; index < _missions?.length; index++) {
        const elem = _missions[index];

        for (let index1 = 0; index1 < elem?.arr?.length; index1++) {
          const elem1 = elem?.arr[index1];

          for (let index = 0; index < elem1?.arr?.length; index++) {
            const elem2 = elem1?.arr[index];

            for (let index = 0; index < elem2?.arr?.length; index++) {
              const elem3 = elem2?.arr[index];

              if (!technos[elem3?.pointer].arr?.length) {
                technos[elem3?.pointer].arr = [];
                technos[elem3?.pointer].name = technos[elem3?.pointer].court;
                technos[elem3?.pointer].icon = technos[elem3?.pointer].badge;
              }
              technos[elem3?.pointer].arr.push({
                target: "feature",
                props: elem3?.props,
                name: elem3?.name,
                icon: icfy.work?.casual,
                component: elem3?.component,
              });
            }
          }
        }
      }

      folders.missions.arr = _missions;
      folders.jobs.arr = _jobs;
      folders.technologies.arr = technos.filter((el) => el?.arr?.length > 0);
      setIsFolders(folders);
    }
  };

  let fetchMission = async () => {
    let folders = { ...isFolders };
    if (folders?.missions?.arr === null) {
      console.log("----fetch mission------");
      let missions = state?.profile?.datas?.missions;

      let object = JSON?.parse(JSON?.stringify(ENUMS.domain));

      let objectCourt = JSON?.parse(JSON?.stringify(ENUMS.courts));

      for (let index = 0; index < missions?.length; index++) {
        const mission = await stateMission(missions?.[index]);

        if (!object[mission?.metadatas?.attributes?.[0]?.domain].arr?.length) {
          object[mission?.metadatas?.attributes?.[0]?.domain].arr = [];
        }
        let object2 = JSON?.parse(JSON?.stringify(ENUMS.domain));

        for (
          let index1 = 0;
          index1 < mission?.details?.features?.length;
          index1++
        ) {
          let feature = mission?.details?.features?.[index1];

          if (!object2[feature?.domain]?.arr?.length) {
            object2[feature?.domain].arr = [];
          }

          if (
            !objectCourt[feature?.specification]?.arr?.length &&
            feature?.dispute > 0
          ) {
            objectCourt[feature?.specification].arr =
              isFolders?.disputes?.arr || [];
            objectCourt[feature?.specification].name =
              objectCourt[feature?.specification].court;
            objectCourt[feature?.specification].icon =
              objectCourt[feature?.specification].badge;
          }
          if (feature?.dispute > 0) {
            objectCourt[feature?.specification].arr.push({
              name: feature?.title,
              target: "dispute",
              props: [feature?.dispute],
              icon: icfy.court.hammer,
              component: (
                <div
                  className={`p-1 rounded-full bg-${
                    STATUS.feature[feature.status]?.color
                  }`}
                />
              ),
            });
          }

          if (feature?.domain >= 0) {
            object2[feature?.domain].arr.push({
              target: "feature",
              props: [feature?.id],
              name: feature?.title,
              pointer: feature?.specification,
              icon: ENUMS.courts[feature?.specification]?.badge,
              component: (
                <div
                  className={`badge badge-xs badge-${
                    STATUS.feature[feature?.status]?.color
                  }`}
                />
              ),
            });
          }
        }

        if (mission?.metadatas?.attributes?.[0]?.domain >= 0) {
          object[mission?.metadatas?.attributes?.[0]?.domain].arr.push({
            name: mission?.metadatas?.title,
            target: "mission",
            props: [mission?.missionID],
            img: mission?.metadatas?.image,
            arr: object2.filter((el) => el?.arr),
          });
        }
      }

      folders.missions = {
        arr: object?.filter((el) => el?.arr?.length > 0),
        name: "Missions",
        icon: icfy.work.casual,
        color: "info",
      };
      let allowed = true;
      folders?.disputes?.arr?.filter((el) =>
        el?.name === "Owner" ? (allowed = false) : null
      );

      if (allowed) {
        let disputesOwner = {
          name: "Owner",
          arr: objectCourt?.filter((el) => el?.arr?.length > 0),
          icon: icfy?.work?.casual,
          color: "info",
        };
        if (disputesOwner?.arr?.length > 0) {
          if (folders?.disputes?.arr === null) {
            folders.disputes.arr = [disputesOwner];
          } else {
            folders.disputes.arr.push(disputesOwner);
          }
        }
      }

      folders.missions.arr.push({
        icon: icfy.ux.plus,
        name: <Link href={"/create/mission"}>Create mission</Link>,
        color: "success",
      });
      setIsFolders(folders);
    }
    return folders.missions.arr;
  };

  let fetchJobs = async () => {
    let jobs = state?.profile?.datas?.proposals;
    let folders = { ...isFolders };
    if (folders?.jobs?.arr === null) {
      console.log("-----fetch jobs -----");

      let objectJobs = JSON?.parse(JSON?.stringify(ENUMS.domain));
      let objectCourt = JSON?.parse(JSON?.stringify(ENUMS.courts));

      for (let index = 0; index < jobs?.length; index++) {
        let feature = await stateFeature(jobs[index]);
        let domain = feature?.metadatas?.attributes?.[0]?.domain;
        let specification = feature?.datas?.specification;
        if (!objectJobs[domain]?.arr?.length) {
          objectJobs[domain].arr = [];
        }
        if (!objectCourt[specification]?.arr?.length) {
          objectCourt[specification].arr = [];
          objectCourt[specification].name = objectCourt[specification]?.court;
          objectCourt[specification].icon = objectCourt[specification]?.badge;
        }

        if (feature?.datas?.dispute > 0) {
          objectCourt[specification].arr.push({
            name: feature?.metadatas?.title,
            target: "dispute",
            props: [feature?.datas?.dispute],
            icon: icfy.court.hammer,
            component: (
              <div
                className={`p-1 rounded-full bg-${
                  STATUS.feature[feature.status]?.color
                }`}
              />
            ),
          });
        }

        if (domain >= 0) {
          objectJobs[domain].arr.push({
            target: "feature",
            pointer: specification,
            props: [feature?.featureID],
            name: feature?.metadatas?.title,
            icon: ENUMS.courts[specification].badge,
            component: (
              <div
                className={`badge badge-xs badge-${
                  STATUS.feature[feature?.datas?.status].color
                }`}
              />
            ),
          });
        }
      }
      let allowed = true;
      folders?.disputes?.arr?.filter((el) =>
        el?.name === "Worker" ? (allowed = false) : null
      );

      if (allowed) {
        let disputesWorker = {
          name: "Worker",
          arr: objectCourt?.filter((el) => el?.arr?.length > 0),
          icon: icfyCODER,
          color: "info",
        };
        if (disputesWorker?.arr?.length > 0) {
          if (folders?.disputes?.arr === null) {
            folders.disputes.arr = [disputesWorker];
          } else {
            folders.disputes.arr.push(disputesWorker);
          }
        }
      }
      folders.jobs.arr = objectJobs?.filter((el) => el?.arr?.length > 0);
      folders.jobs.arr.push({
        icon: icfy.ux.plus,
        name: <Link href={"/create/feature"}>Create Feature</Link>,
        color: "success",
      });
      setIsFolders(folders);
    }
    return folders.jobs.arr;
  };

  let funcs = {
    disputes: fetchDisputes,
    missions: fetchMission,
    jobs: fetchJobs,
    launchpads: fetchLaunchpads,
    technologies: fetchTechnos,
  };

  useEffect(() => {
    if (
      (!isFolders && state?.profile?.details) ||
      (state?.profile?.cvID != isCvID && state?.profile?.details)
    ) {
      console.log("Mount dropdown profile ...");
      setIsCvID(state?.profile?.cvID);

      let _missions = {
        arr: null,
        name: "Missions",

        icon: icfy.work.casual,
        color: "info",
      };

      let _jobs = {
        arr: null,
        name: "Jobs",
        icon: icfyCODER,
        color: "secondary",
      };

      let _technos = {
        arr: null,
        name: "Technologies",
        icon: icfyCODE,
        color: "error",
      };

      let _launchpads = {
        arr: null,
        name: "Launchpads",
        icon: icfyROCKET,
        color: "primary",
      };

      let _disputes = {
        name: "Disputes",

        icon: icfy?.court.injustice,
        arr: null,
        color: "warning",
      };

      let folders = {
        missions: _missions,
        jobs: _jobs,
        technologies: _technos,
        launchpads: _launchpads,
        disputes: _disputes,
      };
      setIsFolders(folders);
    }
  }, [state?.profile?.details?.missions, state?.profile?.cvID]);

  return (
    <div className={style}>
      <MyMenusDropdown funcs={funcs} isFolders={isFolders}>
        All
      </MyMenusDropdown>
    </div>
  );
};
