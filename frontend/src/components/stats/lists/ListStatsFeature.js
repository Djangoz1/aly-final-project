import React, { useEffect, useState } from "react";
import {
  _getStateFeature,
  _getStateFeatures,
  _getStateOwnerByCv,
} from "utils/ui-tools/auth-tools";
import { StatFeature } from "../StatFeature";
import { v4 as uuidv4 } from "uuid";
import { _setterCV } from "utils/ui-tools/web3-tools";
import { BtnJoinFeature } from "components/btn/BtnJoinFeature";

// Récupérer l'address du CV et si cv a des missions alors le component s'affiche
export const ListStatsFeature = ({ cvAddress, _ownerObj, submit, link }) => {
  const [ownerObj, setOwnerObj] = useState(null);

  useEffect(() => {
    if (!ownerObj) getOwnerObj();
  }, [cvAddress]);

  const getOwnerObj = async () => {
    if (_ownerObj) {
      setOwnerObj(_ownerObj);
    } else {
      let object = await _getStateOwnerByCv(cvAddress);
      setOwnerObj(object);
    }
  };

  return (
    <>
      {ownerObj?.features?.map((elem, index) => (
        <div className="mr-5 my-2" key={uuidv4()}>
          <StatFeature
            obj={ownerObj}
            feature={elem}
            submit={submit && getOwnerObj}
            link={link}
          />
        </div>
      ))}
    </>
  );
};
