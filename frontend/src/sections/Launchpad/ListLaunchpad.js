import { v4 as uuidv4 } from "uuid";
import { LaunchpadCard } from "components/Launchpad/LaunchpadCard";
import React, { useEffect, useState } from "react";
import { _getterLaunchpadHub } from "utils/ui-tools/web3-tools";

export const ListLaunchpad = () => {
  const [list, setList] = useState([]);
  const getLaunchpads = async () => {
    const length = parseInt(await _getterLaunchpadHub("getTokensLength"));
    const arr = [];

    for (let index = 1; index <= length; index++) {
      const element = await _getterLaunchpadHub("getLaunchpad", [index]);
      arr.push(element);
    }
    setList(arr);
  };

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
