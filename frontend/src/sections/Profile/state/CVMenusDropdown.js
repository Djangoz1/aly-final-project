import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { doIndexTools, useToolsDispatch, useToolsState } from "context/tools";
import Link from "next/link";
import { ENUMS } from "constants/enums";
import { Icon } from "@iconify/react";
import { icfy, icfyARROWD, icfyCODE, icfyCODER, icfyROCKET } from "icones";
import { Avatar } from "components/profile/ProfileAvatar";
import { STATUS } from "constants/status";

export const CVMenusDropdown = ({ setter, value, children, arr, target }) => {
  let { state, index } = useToolsState();
  let [isFolders, setIsFolders] = useState(null);
  let [isItems, setIsItems] = useState(null);
  let [isOpen, setIsOpen] = useState(0);

  console.log("state", state);
  useEffect(() => {
    if (!isFolders && state?.owner?.details) {
      let missions = state?.owner?.details?.missions;
      let jobs = state?.owner?.details?.features;
      let launchpads = state?.owner?.details?.launchpads?.arr;
      let object = JSON.parse(JSON.stringify(ENUMS.domain));
      let objectJobs = JSON.parse(JSON.stringify(ENUMS.domain));
      let objectCourt = JSON.parse(JSON.stringify(ENUMS.courts));

      let objectLaunchpads = JSON.parse(JSON.stringify(ENUMS.domain));

      let _id = 0;
      let items = [];
      for (let index = 0; index < missions?.length; index++) {
        const mission = missions?.[index];

        let id_ = _id;
        _id++;
        items.push({
          index: id_,
          target: "mission",
          props: [mission?.missionID],
        });
        if (!object[mission?.metadatas?.attributes?.[0]?.domain].arr?.length) {
          object[mission?.metadatas?.attributes?.[0]?.domain].arr = [];
          object[mission?.metadatas?.attributes?.[0]?.domain].id = _id;
          items.push({
            index: _id,
            target: "missionDomain",
            props: [mission?.metadatas?.attributes?.[0]?.domain],
          });
          _id++;
        }
        let object2 = JSON.parse(JSON.stringify(ENUMS.domain));

        for (
          let index1 = 0;
          index1 < mission?.details?.features?.length;
          index1++
        ) {
          let feature = mission?.details?.features?.[index1];

          if (!object2[feature?.domain]?.arr?.length) {
            object2[feature?.domain].arr = [];
            object2[feature?.domain].id = _id;
            items.push({
              index: _id,
              target: "featureDomain",
              props: [feature?.domain],
            });
            _id++;
          }
          if (!objectCourt[feature?.specification]?.arr?.length) {
            objectCourt[feature?.specification].arr = [];
            objectCourt[feature?.specification].name =
              objectCourt[feature?.specification].court;
            objectCourt[feature?.specification].icon =
              objectCourt[feature?.specification].badge;
          }
          if (feature?.specification >= 0) {
            items.push({
              index: _id,
              target: "feature",
              props: [feature?.featureID],
            });

            objectCourt[feature?.specification].arr.push({
              name: feature?.title,
              index: _id,
              icon: icfy.work.casual,
              component: (
                <div
                  className={`p-1 rounded-full bg-${
                    STATUS.feature[feature?.status]?.color
                  }`}
                />
              ),
            });
            _id++;
          }
          if (feature?.domain >= 0) {
            items.push({
              index: _id,
              target: "feature",
              props: [feature?.featureID],
            });

            object2[feature?.domain].arr.push({
              name: feature?.title,
              index: _id,
              icon: ENUMS.courts[feature?.specification]?.badge,
              component: (
                <div
                  className={`p-1 rounded-full bg-${
                    STATUS.feature[feature?.status]?.color
                  }`}
                />
              ),
            });
            _id++;
          }
        }

        if (mission?.metadatas?.attributes?.[0]?.domain >= 0) {
          object[mission?.metadatas?.attributes?.[0]?.domain].arr.push({
            name: mission?.metadatas?.title,
            index: id_,
            img: mission?.metadatas?.image,
            arr: object2.filter((el) => el?.arr),
          });
        }
      }
      for (let index = 0; index < jobs?.length; index++) {
        let feature = jobs[index];

        if (!objectJobs[feature?.domain]?.arr?.length) {
          objectJobs[feature?.domain].arr = [];
          objectJobs[feature?.domain].id = _id;
          items.push({
            index: _id,
            target: "domain",
            props: [feature?.domain],
          });
          _id++;
        }
        if (!objectCourt[feature?.specification]?.arr?.length) {
          objectCourt[feature?.specification].arr = [];
          objectCourt[feature?.specification].name =
            objectCourt[feature?.specification].court;
          objectCourt[feature?.specification].icon =
            objectCourt[feature?.specification].badge;
          objectCourt[feature?.domain].id = _id;
          items.push({
            index: _id,
            target: "court",
            props: [feature?.specification],
          });
          _id++;
        }
        if (feature?.specification >= 0) {
          items.push({
            index: _id,
            target: "feature",
            props: [feature?.featureID],
          });

          objectCourt[feature?.specification].arr.push({
            name: feature?.title,
            index: _id,
            icon: icfyCODER,
            component: (
              <div
                className={`p-1 rounded-full bg-${
                  STATUS.feature[feature?.status].color
                }`}
              />
            ),
          });
          _id++;
        }

        if (feature?.domain >= 0) {
          items.push({
            index: _id,
            target: "feature",
            props: [feature?.featureID],
          });

          objectJobs[feature?.domain].arr.push({
            name: feature?.title,
            index: _id,
            icon: ENUMS.courts[feature?.specification].badge,
            component: (
              <div
                className={`p-1 rounded-full bg-${
                  STATUS.feature[feature?.status].color
                }`}
              />
            ),
          });
          _id++;
        }
      }

      for (let index = 0; index < launchpads?.length; index++) {
        let launchpad = launchpads[index];
        if (!objectLaunchpads[launchpad?.domain].arr?.length) {
          objectLaunchpads[launchpad.domain].arr = [];
          objectLaunchpads[launchpad.domain].id = _id;
          items.push({
            index: _id,
            target: "domainLaunchpad",
            props: [launchpad?.domain],
          });
          _id++;
        }

        if (launchpad?.domain >= 0) {
          items.push({
            index: _id,
            target: "launchpad",
            props: [launchpad?.launchpadID],
          });

          objectLaunchpads[launchpad?.domain].arr.push({
            name: launchpad?.title,
            index: _id,
            icon: icfyROCKET,
          });
          _id++;
        }
      }

      items.push({ index: _id, target: "missions", props: ["table ?"] });

      let _missions = {
        arr: object?.filter((el) => el?.arr?.length > 0),
        name: "Missions",
        index: _id,
        icon: icfy.work.casual,
        color: "info",
      };
      _id++;

      items.push({ index: _id, target: "jobs", props: ["table ?"] });

      let _jobs = {
        arr: objectJobs?.filter((el) => el?.arr?.length > 0),
        name: "Jobs",
        index: _id,
        icon: icfyCODER,
        color: "secondary",
      };
      _id++;
      items.push({ index: _id, target: "jobs", props: ["table ?"] });

      let _courts = {
        arr: objectCourt?.filter((el) => el?.arr?.length > 0),
        name: "Technologies",
        index: _id,
        icon: icfyCODE,
        color: "error",
      };
      _id++;
      items.push({ index: _id, target: "launchpads", props: ["table ?"] });

      let _launchpads = {
        arr: objectLaunchpads?.filter((el) => el?.arr?.length > 0),
        name: "Launchpads",
        index: _id,
        icon: icfyROCKET,
        color: "primary",
      };
      _id++;
      console.log("object", object);
      setIsItems(items);
      setIsFolders([_missions, _jobs, _courts, _launchpads]);
    }
  }, [state?.owner?.details?.missions]);
  console.log("items", isItems?.[index]);
  console.log("indeeeex", index);
  console.log("isItems", isItems);
  let dispatch = useToolsDispatch();

  let handleChangeIndex = (index, i) => {
    doIndexTools(dispatch, index);
    if (i) {
      setIsOpen(isOpen === i ? null : i);
    }
  };

  return (
    <div className="flex flex-col w-full  ">
      {isFolders?.map((el, i) => (
        <div
          className={`flex flex-col text-xs box-border w-full ${
            isOpen === i && "bg-white/5"
          }`}
          key={v4()}
        >
          <div
            className="flex cursor-pointer py-3 items-center capitalize transition-all box-border w-full"
            onClick={() => handleChangeIndex(el?.index, i)}
          >
            <Icon
              icon={el?.icon}
              className={"mr-4 ml-2 text-lg text-" + el?.color}
            />
            {el?.name}
            <Icon
              icon={icfyARROWD}
              className={`ml-auto mr-2 ${isOpen !== i && "rotate-180"}`}
            />
          </div>

          {i === isOpen && (
            <div className="box-border h-fit  border flex-auto ml-2 border-l-1 border-r-0 border-y-0  border-white/10">
              {el?.arr?.map((el2) => (
                <Child
                  key={v4()}
                  setter={() => handleChangeIndex(el2?.index)}
                  element={el2}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

let Child = ({ element, setter }) => {
  let [isOpen, setIsOpen] = useState(false);
  let dispatch = useToolsDispatch();

  let handleChangeIndex = () => {
    console.log("element", element);
    doIndexTools(dispatch, element?.index);
  };

  return (
    <>
      <div
        onClick={handleChangeIndex}
        className={`flex  cursor-pointer  items-center py-3 ${
          isOpen ? "bg-white/5 text-white" : "hover:bg-white/10 text-white/40"
        }`}
      >
        {element?.icon && (
          <Icon
            icon={element?.icon}
            className={`
              mr-4 ml-2 text-lg ${element?.color && "text-" + element?.color}
            `}
          />
        )}
        {element?.img && <Avatar CID={element?.img} style="mr-2 ml-2 w-6" />}
        <p className="w-fit capitalize">{element?.name}</p>
        {element?.arr && (
          <Icon
            icon={icfyARROWD}
            className={`ml-auto  mr-3 text-xs   ${
              !isOpen ? "rotate-180 " : "rotate-0"
            }`}
          />
        )}
        {element?.component && (
          <div className={`ml-auto  mr-3 `}>{element?.component}</div>
        )}
      </div>
      {isOpen && (
        <div className="box-border h-fit border flex-auto ml-2 border-l-1 border-r-0 border-y-0  border-white/10">
          {element?.arr?.map((el) => (
            <Child key={v4()} element={el} />
          ))}
        </div>
      )}
    </>
  );
};
