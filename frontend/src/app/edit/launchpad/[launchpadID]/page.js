// "use client";
// import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
// import React, { useEffect, useState } from "react";

// import { _form_create_profile } from "utils/ux-tools/form/profile";
// import { MySteps } from "components/myComponents/MySteps";
// import { MENUS } from "constants/menus";
// import { useAccount } from "wagmi";

// import {
//   _apiGet,
//   _apiGetAt,
//   _apiPost,
//   _apiPostAt,
// } from "utils/ui-tools/web3-tools";
// import { useAuthDispatch, useAuthState } from "context/auth";

// import { _form_create_launchpad } from "utils/ux-tools/form/launchpad";

// import { ethers } from "ethers";
// import { Icon } from "@iconify/react";
// import { icfy, icfyROCKET } from "icones";
// import { MyFormCreate } from "components/myComponents/form/MyForm";

// import { MyInput } from "components/myComponents/form/MyInput";
// import { useToolsState } from "context/tools";
// import { stateLaunchpad } from "utils/ui-tools/state-tools";

// const PageInvestToken = ({ params }) => {
//   const launchpadID = params.launchpadID;
//   let { address, isConnected } = useAccount();
//   let { state } = useToolsState();
//   let dispatch = useAuthDispatch();

//   let submitInvest = async (form) => {
//     console.log("form", form);
//     let value = ethers.utils.parseEther(form?.value)._hex;
//     let hash = await _apiPost("buyTokens", [parseInt(launchpadID)], value);
//     console.log(hash);
//   };

//   let { cv, metadatas } = useAuthState();
//   let [isState, setIsState] = useState(null);
//   let stateInit = async () =>
//     setIsState({
//       launchpad: await stateLaunchpad(launchpadID),
//     });

//   useEffect(() => {
//     if (!isState) stateInit();
//   }, [launchpadID]);
//   _form_create_launchpad[0].title = `Hello ${metadatas?.username} ! 👋`;
//   console.log("is state", isState);
//   return (
//     <MyLayoutApp
//       id={launchpadID}
//       url={"/edit/launchpad/" + launchpadID}
//       initState={isState}
//     >
//       <MyFormCreate
//         title={"Invest on token"}
//         submit={submitInvest}
//         components={[
//           {
//             component: (
//               <MyInput
//                 max={ethers.utils.formatEther(
//                   state?.launchpad?.datas?.maxInvest || 0
//                 )}
//                 step={0.1}
//                 type={"number"}
//                 target={"value"}
//               />
//             ),
//             label: "Invest",
//           },
//         ]}
//         arr={[
//           {
//             title: (
//               <span className={"flex"}>
//                 <Icon icon={icfyROCKET} className="text-error mr-4" /> Invest on
//                 launchpad
//               </span>
//             ),
//             description: (
//               <>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. In
//                 harum beatae earum, placeat repellendus sequi reprehenderit
//                 libero necessitatibus magni voluptate sint aut! Labore aut sint
//                 suscipit fugit reiciendis. Aliquam, explicabo!
//               </>
//             ),
//           },
//         ]}
//         stateInit={{
//           allowed: true,
//           form: {
//             target: "Invest",
//             value: 0,
//           },
//           placeholders: {
//             value: "300 ETH",
//           },
//         }}
//         editer={"Participate"}
//       />
//     </MyLayoutApp>
//   );
// };

// export default PageInvestToken;
