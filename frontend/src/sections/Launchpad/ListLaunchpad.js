import { v4 as uuidv4 } from "uuid";
import { LaunchpadCard } from "components/Launchpad/LaunchpadCard";
import React, { useEffect, useState } from "react";
import { _getterLaunchpadHub } from "utils/ui-tools/web3-tools";
import { Icon } from "@iconify/react";
import { icfySEARCH } from "icones";

export const ListLaunchpad = () => {
  const [list, setList] = useState([]);
  const getLaunchpads = async () => {
    const length = parseInt(await _getterLaunchpadHub("getTokensLength"));
    const arr = [];
    console.log(length);
    for (let index = 1; index <= length; index++) {
      const element = await _getterLaunchpadHub("getLaunchpad", [index]);
      arr.push(element);
    }
    setList(arr);
  };
  console.log(list);
  useEffect(() => {
    getLaunchpads();
  }, []);
  return (
    <div>
      <div className="flex flex-wrap justify-evenly">
        {list.map((el) => (
          <div className="mb-3 mx-1" key={uuidv4()}>
            <LaunchpadCard address={el} />
          </div>
        ))}
      </div>
    </div>
  );
};
