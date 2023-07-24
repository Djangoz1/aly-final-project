import { v4 as uuidv4 } from "uuid";
import { LaunchpadCard } from "components/Launchpad/LaunchpadCard";
import React, { useEffect, useState } from "react";
import { _getterLaunchpadHub } from "utils/ui-tools/web3-tools";

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
      ListLaunchpad
      <div className="flex justify-evenly">
        {list.map((el) => (
          <LaunchpadCard address={el} key={uuidv4()} />
        ))}
      </div>
    </div>
  );
};
