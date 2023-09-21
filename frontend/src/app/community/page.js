"use client";
import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { Layout } from "sections/Layout";

// import { v4 as uuidv4 } from "uuid";

// import { _getAllPubsState } from "utils/ui-tools/pubs-tools";
// import {
//   _getterPubsHub,
//   _setterAccessControl,
//   _setterPubsHub,
// } from "utils/ui-tools/web3-tools";

// import { MyTabs } from "components/myComponents/MyTabs";
// import { sectionCommunity } from "constants/text";

// import { useRouter } from "next/navigation";

// import { CreationPub } from "components/Pub/CreationPub";
// import { MySection } from "components/myComponents/MySection";
// import { Pub } from "components/Pub";

const Community = () => {
  //   const { cv, missionId } = useAuthState();

  //   const [isTabs, setIsTabs] = useState(sectionCommunity[0]);
  //   const [pubs, setPubs] = useState([]);
  //   const router = useRouter();
  //   const handleClick = (status) => {
  //     router.push(status.link);
  //     setIsTabs(status);
  //   };

  //   const getAllPubs = async () => {
  //     const _length = parseInt(await _getterPubsHub("getTokensLength"));
  //     const _pubs = [];
  //     for (let index = 1; index <= _length; index++) {
  //       _pubs.push(index);
  //     }

  //     setPubs(_pubs);
  //   };

  //   useEffect(() => {
  //     if (pubs.length === 0) {
  //       getAllPubs();
  //     }
  //   }, [pubs]);
  return (
    <Layout>
      {/* <MySection styles={" flex-col "}>
        <div className="w-full flex h-full min-h-full flex-1 flex-auto flex-col">
          <div className="flex items-start justify-between mb-5">
            <MyTabs
              arr={sectionCommunity}
              setter={handleClick}
              value={isTabs}
            />
            <div className="w-1/6">
              <CreationPub />
            </div>
          </div>
          <div className=" ">
            {pubs?.map((id) => (
              <Pub key={uuidv4()} id={id} />
            ))}
          </div>
        </div>
      </MySection> */}
    </Layout>
  );
};

export default Community;
