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
  const [featuresList, setFeaturesList] = useState(null);

  useEffect(() => {
    if (!ownerObj) getOwnerObj();
  }, [cvAddress]);

  useEffect(() => {
    if (ownerObj?.missions) {
      getFeatures();
    }
  }, [ownerObj]);

  const getOwnerObj = async () => {
    if (_ownerObj) {
      setOwnerObj(_ownerObj);
    } else {
      let object = await _getStateOwnerByCv(cvAddress);
      setOwnerObj(object);
    }
  };

  const getFeatures = async () => {
    const features = [];
    for (let index = 0; index < ownerObj?.features?.length; index++) {
      const feature = await _getStateFeature(
        parseInt(ownerObj?.features[index])
      );
      features.push(feature);
    }

    setFeaturesList({ mission: ownerObj, features });
  };

  return (
    <>
      {featuresList?.features?.map((elem, index) => (
        <div className="mr-5 my-2" key={uuidv4()}>
          <StatFeature
            obj={featuresList}
            feature={elem}
            // mission={{
            //   address: elem?.mission,
            //   owner: ownerObj?.name,
            //   ownerAddress: cvAddress,
            // }}
            submit={submit && getFeatures}
            link={link}
          />
        </div>
      ))}
    </>
  );
};
