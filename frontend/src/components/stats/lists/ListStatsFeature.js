import React, { useEffect, useState } from "react";
import {
  _getStateFeatures,
  _getStateOwnerByCv,
} from "utils/ui-tools/auth-tools";
import { StatFeature } from "../StatFeature";
import { v4 as uuidv4 } from "uuid";
import { _setterCV } from "utils/ui-tools/web3-tools";
import { BtnJoinFeature } from "components/btn/BtnJoinFeature";

// Récupérer l'address du CV et si cv a des missions alors le component s'affiche
export const ListStatsFeature = ({ cvAddress, submit, link }) => {
  const [ownerObj, setOwnerObj] = useState(null);
  const [featuresList, setFeaturesList] = useState(null);

  useEffect(() => {
    if (!ownerObj) {
      getOwnerObj();
    }
  }, [cvAddress]);

  useEffect(() => {
    if (ownerObj?.missions) {
      getFeatures();
    }
  }, [ownerObj]);

  const getOwnerObj = async () => {
    let _ownerObj = await _getStateOwnerByCv(cvAddress);
    setOwnerObj(_ownerObj);
  };

  const getFeatures = async () => {
    const arr = [];
    for (let index = 0; index < ownerObj?.missions?.length; index++) {
      const features = await _getStateFeatures(ownerObj?.missions[index]);
      arr.push({ mission: ownerObj?.missions[index], feature: features });
    }

    setFeaturesList(arr);
  };

  return (
    <>
      {featuresList?.map((features, index) =>
        features?.feature?.map((elem) => (
          <div className="mr-5 my-2" key={uuidv4()}>
            <StatFeature
              feature={elem}
              mission={{
                address: features?.mission,
                owner: ownerObj?.name,
                ownerAddress: cvAddress,
              }}
              submit={submit && getFeatures}
              link={link}
            />
          </div>
        ))
      )}
    </>
  );
};
