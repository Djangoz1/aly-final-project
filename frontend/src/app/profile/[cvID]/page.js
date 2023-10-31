"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateMission,
  statePub,
} from "utils/ui-tools/state-tools";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icsystem } from "icones";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";
import { CVProfile } from "sections/Profile/state/CVProfile";
import { _apiGet } from "utils/ui-tools/web3-tools";
import { ADDRESSES } from "constants/web3";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";
import { CVOverview } from "sections/Profile/state/CVOverview";
import { ENUMS } from "constants/enums";
import { EditProfile } from "sections/Profile/form/edit/EditProfile";
import { Particle } from "components/myComponents/MyParticles";
import { AssetProfile1 } from "components/assets/AssetProfile";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { v4 } from "uuid";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { CVInfos } from "sections/Profile/state/CVInfos";
import {
  MyMenusDropdown,
  MyMenusDropdownProfile,
  MyMenusTabs,
} from "components/myComponents/menu/MyMenus";
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { BtnsSocial } from "components/btn/BtnsSocial";
import { Loader } from "@react-three/drei";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { doStateFormPointer } from "context/form";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { STATUS } from "constants/status";
import { MySub } from "components/myComponents/text/MySub";

function App({ params }) {
  const { cv } = useAuthState();

  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isState, setIsState] = useState(null);

  const cvID = params.cvID;

  let dispatch = useToolsDispatch();
  let fetch = async () => {
    setIsLoading(true);
    let _state = await doStateProfileTools({ dispatch, cvID });
    setIsState(_state);
    setIsLoading(false);
  };
  useEffect(() => {
    if (!isState || status === "reload") {
      fetch();
      console.log("Origin fetch is datas cv", isState);
    }
  }, [cvID, status]);

  return (
    <MyLayoutDashboard
      isLoading={isLoading}
      id={cvID}
      btn={{
        title: "Invite worker",
        info: <>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</>,
      }}
      refresh={() => doStateProfileTools({ dispatch, cvID })}
      owner={state?.profile?.metadatas}
      price={state?.profile?.datas?.amount}
      allowed={cv == cvID}
      statusObj={{
        current: state?.profile?.metadatas?.attributes?.[0]?.visibility ? 0 : 1,
        to: state?.profile?.metadatas?.attributes?.[0]?.visibility ? 1 : 0,
      }}
      header={state?.profile?.metadatas?.username}
      side={
        pointer === 2 ? (
          <CVMenusDropdown style={"  shadowh _hover bgprim w-full"} />
        ) : undefined
      }
      lists={[
        {
          title: "Social",
          description: (
            <div className="flex flex-col items-start c3">
              <div className="flex items-center">
                {state?.pubs?.length}

                <MySub style={"c4 ml-2 mr-4"}>post(s)</MySub>
              </div>

              <div className="flex items-center">
                {state?.profile?.datas?.followers}
                <MySub style={"c4 ml-2 mr-4"}>follower(s)</MySub>
              </div>

              <div className="flex items-center">
                {state?.profile?.datas?.follows}

                <MySub style={"c4 ml-2 "}>follow(s)</MySub>
              </div>
            </div>
          ),
          icon: icsystem.social,
        },
        {
          title: "Wadge",
          description: (
            <span className="flex items-center c3">
              <MySub size={"12"} style={"c4  mr-2"}>
                TJM:{" "}
              </MySub>
              0<MySub style=" c4 ml-3">ETH</MySub>
            </span>
          ),
          icon: icfyETHER,
        },
        {
          title: "Spécialité",
          description: (
            <span className="capitalize">
              {
                ENUMS.domain[state?.profile?.metadatas?.attributes?.[0]?.domain]
                  ?.name
              }
            </span>
          ),
          icon: ENUMS.domain[state?.profile?.metadatas?.attributes?.[0]?.domain]
            ?.icon,
        },
      ]}
      menus={[
        {
          title: "Profile",
          url: "#section0",
          icon: icfy.ux.admin,
        },
        {
          title: "Informations",
          url: "#section1",
          icon: icfy.ux.admin,
        },

        {
          title: "Overview",
          url: "#section2",
          icon: icfy.ux.admin,
        },
        {
          title: "Settings",
          url: "#section3",
          icon: icfy.tools.casual,
        },
      ]}
      target={"profile"}
      // initState={isState}
    >
      <>
        {console.log("state", state)}

        {pointer === 0 ? (
          <CVProfile />
        ) : pointer === 1 ? (
          <CVInfos />
        ) : pointer === 2 ? (
          <CVOverview />
        ) : pointer === 3 ? (
          <EditProfile />
        ) : undefined}

        {/* 

          
          {cv == cvID && (
            <Viewport id={"edit"} index={3}>
            </Viewport>
          )}
          <div className="fixed z-100 bottom-20  flex flex-col items-end right-10">
            <CreatePub
              style={"  c2  mb-4"}
              btn={<Icon icon={icfy?.msg?.chat} className="text-6xl m-2" />}
            />
            {state?.profile?.cvID != cv &&
              state?.profile?.metadatas?.attributes?.[0]?.visibility && (
                <EditWorker styles={"c2"} />
              )}
          </div> */}
      </>
    </MyLayoutDashboard>
  );
}

export default App;
// "use client";

// import React, { useEffect, useRef, useState } from "react";

// import { useAuthState } from "context/auth";
// import {
//   doStateProfileTools,
//   useToolsDispatch,
//   useToolsState,
// } from "context/tools";

// import {
//   stateCV,
//   stateDetailsCV,
//   stateFeature,
//   stateMission,
//   statePub,
// } from "utils/ui-tools/state-tools";

// import { Icon } from "@iconify/react";
// import { icfy, icfyETHER, icfyMAIL, icsystem } from "icones";

// import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
// import { _table_features } from "utils/states/tables/feature";
// import { _table_invites } from "utils/works/feature";

// import { Viewport } from "components/myComponents/layout/MyViewport";
// import { CVProfile } from "sections/Profile/state/CVProfile";
// import { _apiGet } from "utils/ui-tools/web3-tools";
// import { ADDRESSES } from "constants/web3";
// import { MyModal } from "components/myComponents/modal/MyModal";
// import { ImagePin } from "components/Image/ImagePin";
// import { CVOverview } from "sections/Profile/state/CVOverview";
// import { ENUMS } from "constants/enums";
// import { EditProfile } from "sections/Profile/form/edit/EditProfile";
// import { Particle } from "components/myComponents/MyParticles";
// import { AssetProfile1 } from "components/assets/AssetProfile";
// import { MyFModal } from "components/myComponents/modal/MyFramerModal";
// import { CreatePub } from "sections/Pub/form/create/CreatePub";
// import { v4 } from "uuid";
// import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
// import { CVInfos } from "sections/Profile/state/CVInfos";
// import {
//   MyMenusDropdown,
//   MyMenusDropdownProfile,
//   MyMenusTabs,
// } from "components/myComponents/menu/MyMenus";
// import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
// import { BtnsSocial } from "components/btn/BtnsSocial";
// import { Loader } from "@react-three/drei";
// import { MyLoader } from "components/myComponents/layout/MyLoader";
// import { MyCardList } from "components/myComponents/card/MyCardList";
// import { doStateFormPointer } from "context/form";
// import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";

// function App({ params }) {
//   const { cv } = useAuthState();

//   const { state, status, pointer } = useToolsState();
//   let [isLoading, setIsLoading] = useState(null);
//   let [isState, setIsState] = useState(null);

//   const cvID = params.cvID;

//   let dispatch = useToolsDispatch();
//   let fetch = async () => {
//     setIsLoading(true);
//     let _state = await doStateProfileTools({ dispatch, cvID });
//     setIsState(_state);
//     setIsLoading(false);
//   };
//   useEffect(() => {
//     if (!isState || status === "reload") {
//       fetch();
//       console.log("Origin fetch is datas cv", isState);
//     }
//   }, [cvID, status]);

//   return (
//     <MyLayoutApp
//       notLoad={true}
//       particles={true}
//       id={cvID}
//       url={`/profile/${cvID}`}
//       subMenus={
//         !isLoading && [
//           { title: "Profile", tag: "profile" },
//           { title: "Informations", tag: "infos" },
//           { title: "Overview", tag: "overview" },
//           cv == cvID && { title: "Settings", tag: "settings" },
//         ]
//       }
//       target={"profile"}
//       // initState={isState}
//     >
//       {!isLoading ? (
//         <>
//           {console.log(state)}
//           <Viewport full={true} id={"profile"} index={0}>
//             <MyCardList
//               price={state?.sds}
//               head={{
//                 title: <></>,
//                 component: (
//                   <div className="h-[8vh]">
//                     <MyMenusTabs
//                       style={"absolute top-0 left-0 w-full"}
//                       color={1}
//                       target={"value"}
//                       arr={[
//                         {
//                           value: "Profile",
//                           url: "#section0",
//                           icon: icfy.ux.admin,
//                         },
//                         {
//                           value: "Informations",
//                           url: "#section1",
//                           icon: icfy.ux.admin,
//                         },

//                         {
//                           value: "Overview",
//                           url: "#section2",
//                           icon: icfy.ux.admin,
//                         },
//                       ]}
//                       value={pointer}
//                       setter={(index) => doStateFormPointer(dispatch, index)}
//                     />
//                   </div>
//                 ),
//               }}
//               arr={[
//                 {
//                   title: "Social",
//                   description: (
//                     <div className="flex items-end">
//                       <div className="flex flex-col">
//                         <p>Posts</p>
//                         <p>{state?.pubs?.length}</p>
//                       </div>
//                       <div className="flex flex-col mx-5">
//                         <p>Followers</p>
//                         <p>{state?.pubs?.length}</p>
//                       </div>
//                       <div className="flex flex-col">
//                         <p>Follows</p>
//                         <p>{state?.pubs?.length}</p>
//                       </div>
//                     </div>
//                   ),
//                   icon: icsystem.social,
//                 },
//                 { title: "OK", description: "oui", icon: icfy.eye.close },
//                 { title: "OK", description: "oui", icon: icfy.eye.close },
//                 { title: "OK", description: "oui", icon: icfy.eye.close },
//                 { title: "OK", description: "oui", icon: icfy.eye.close },
//                 { title: "OK", description: "oui", icon: icfy.eye.close },
//               ]}
//             >
//               <CVProfile />
//             </MyCardList>
//           </Viewport>
//           <Viewport id={"informations"} index={1}>
//             <CVInfos />
//           </Viewport>

//           <Viewport side={<CVMenusDropdown />} id={"overview"} index={2}>
//             <CVOverview />
//           </Viewport>
//           {cv == cvID && (
//             <Viewport id={"edit"} index={3}>
//               <EditProfile />
//             </Viewport>
//           )}
//           <div className="fixed z-100 bottom-20  flex flex-col items-end right-10">
//             <CreatePub
//               style={"  c2  mb-4"}
//               btn={<Icon icon={icfy?.msg?.chat} className="text-6xl m-2" />}
//             />
//             {state?.profile?.cvID != cv &&
//               state?.profile?.metadatas?.attributes?.[0]?.visibility && (
//                 <EditWorker styles={"c2"} />
//               )}
//           </div>
//         </>
//       ) : (
//         <Viewport full={true} index={null}>
//           <div className="flex items-center justify-center w-full h-full">
//             <MyLoader />
//           </div>
//         </Viewport>
//       )}
//     </MyLayoutApp>
//   );
// }

// export default App;
