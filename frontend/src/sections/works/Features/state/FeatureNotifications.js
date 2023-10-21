import { MyCardInfos } from "components/myComponents/card/MyCard";
import {
  doStateMissionTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import React, { useEffect, useState } from "react";
import { _apiPost } from "utils/ui-tools/web3-tools";
import { STATUS } from "constants/status";
import { Icon } from "@iconify/react";
import { parseTimestamp } from "helpers";
import { ENUMS } from "constants/enums";
import { MyCardInfo } from "components/myComponents/card/MyCardInfo";
import { MyBtnPost } from "components/btn/MyBtnPost";

import { useAuthState } from "context/auth";
import { Avatar } from "components/profile/ProfileAvatar";

export const FeatureNotifications = ({ feature }) => {
  let { state, index } = useToolsState();

  let { cv } = useAuthState();

  let dispatch = useToolsDispatch();

  let handlePost = async (func, id, id2) => {
    if (!id2) {
      await _apiPost(func, [id]);
    } else {
      await _apiPost(func, [id, id2]);
    }
    doStateMissionTools(dispatch, state?.mission?.missionID);
  };

  let [isFeature, setIsFeature] = useState(null);

  useEffect(() => {
    if (feature) {
      setIsFeature(feature);
    } else if (state?.features?.[index]) {
      setIsFeature(state?.features?.[index]);
    }
  }, [feature, index]);

  let [isInfos, setIsInfos] = useState(null);

  useEffect(() => {
    if ((!isInfos || isInfos?.length === 0) && isFeature?.details?.demands) {
      let arr = [];

      isFeature?.details?.demands?.map((profile) => {
        arr.push({
          title: (
            <>
              <Avatar style={"w-8 mr-3"} CID={profile?.metadatas?.image} />
              {profile?.metadatas?.username}{" "}
            </>
          ),
          value: (
            <>
              <MyBtnPost
                setter={() =>
                  handlePost("signWorker", isFeature?.featureID, profile?.cvID)
                }
                style={
                  "h-fit ml-auto btn-xs c2 btn-outline text-[10px] normal-case "
                }
              >
                Sign
              </MyBtnPost>
            </>
          ),
        });
      });

      setIsInfos(arr);
    }
    if (!isFeature?.details?.demands) {
      setIsInfos(null);
    }
  }, [state, index]);

  return (
    <>
      <div className="flex w-full">
        <MyCardInfos
          title={"Worker demands"}
          arr={isInfos}
          style={"mr-3 w-1/3 rounded-tl-none "}
        ></MyCardInfos>
      </div>
    </>
  );
};
