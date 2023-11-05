import React, { useEffect, useState } from "react";

import {
  doIndexTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { ENUMS } from "constants/enums";
import { MyMenusDropdown } from "components/myComponents/menu/MyMenus";
import { STATUS } from "constants/status";
import { icfy } from "icones";
import Link from "next/link";

export const MissionMenusDropdown = ({}) => {
  let { state, index } = useToolsState();
  let [isFolders, setIsFolders] = useState(null);

  useEffect(() => {
    if (!isFolders && state?.features?.length > 0) {
      let object = ENUMS.domain;

      for (let index = 0; index < state?.features?.length; index++) {
        const feature = state?.features?.[index];
        feature.index = index;
        if (!object[feature?.metadatas?.domain].arr?.length) {
          object[feature?.metadatas?.domain].arr = [];
        }
        if (feature?.metadatas?.domain >= 0) {
          object[feature?.metadatas?.domain].arr.push({
            target: "feature",
            props: [index],
            name: feature?.metadatas?.title,
            component: (
              <div
                className={
                  "badge badge-xs badge-" +
                  STATUS.feature?.[feature?.datas?.status].color
                }
              ></div>
            ),
            icon: ENUMS.courts?.[feature?.datas?.specification]?.badge,
          });
        }
      }
      let _arr = object.filter((el) => el?.arr?.length > 0);
      let result = {};
      for (let index = 0; index < _arr.length; index++) {
        const element = _arr[index];
        result[element?.name] = element;
      }
      result.create = {
        icon: icfy.ux.plus,
        name: <Link href={"/create/feature"}>Create feature</Link>,
        color: "success",
        blockDrop: true,
      };

      setIsFolders(result);
    }
  }, [state?.features]);

  let dispatch = useToolsDispatch();

  return (
    <>
      <MyMenusDropdown
        funcs={{
          feature: (index) => doIndexTools(dispatch, index),
        }}
        isFolders={isFolders}
      ></MyMenusDropdown>
    </>
  );
};
