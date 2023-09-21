// import React, { useEffect, useState } from "react";
// import { InputText } from "..";

// import { _getName } from "utils/ui-tools/auth-tools";

// import { Icon } from "@iconify/react";
// import { InputInviteOnly } from "./InviteOnly";
// import { InputWadge } from "./Wadge";
// import { ZERO_ADDRESS } from "constants/web3";
// import { _getAllCVs } from "utils/ui-tools/state-tools";
// import { _getterCV } from "utils/ui-tools/web3-tools";
// import { MyCard } from "components/myComponents/MyCard";

// export const InputAssignedWorker = ({ datas, setDatas }) => {
//   const [listNames, setListNames] = useState([]);

//   const getNames = async (_name) => {
//     const cvs = await _getAllCVs();
//     const arr = [];
//     for (let index = 0; index < cvs.length; index++) {
//       const element = cvs[index];

//       const name = await _getterCV(element, "name");

//       if (
//         name.toLowerCase().includes(_name.toLowerCase()) ||
//         element.toLowerCase().includes(_name.toLowerCase())
//       ) {
//         arr.push({ name, address: element });
//       }
//     }
//     setListNames(arr);
//     return arr;
//   };

//   const handleChange = async (_assignedWorker) => {
//     const _datas = { ...datas };

//     _datas.assignedWorker = _assignedWorker;
//     const stateNames = await getNames(_assignedWorker);
//     if (stateNames.length === 1) {
//       _datas.assignedWorker = stateNames[0].address;
//     }
//     setDatas(_datas);
//   };

//   const handleClick = async (_assignedWorker) => {
//     const _datas = { ...datas };
//     _datas.assignedWorker = _assignedWorker;
//     setDatas(_datas);
//   };

//   return (
//     <MyCard styles=" w-[360px] flex h-full flex-col ml-4">
//       <span className="flex text-white items-center mb-4">
//         <Icon icon={"pepicons-pencil:cv"} />
//         <p className="ml-3 uppercase mr-auto"> Worker</p>

//         <InputInviteOnly datas={datas} setDatas={setDatas} />
//       </span>
//       <div className="flex flex-col w-full ">
//         <InputWadge datas={datas} setDatas={setDatas} />

//         <InputText
//           value={
//             datas.assignedWorker !== ZERO_ADDRESS ? datas.assignedWorker : ""
//           }
//           setter={handleChange}
//           title="Please input name or address cv"
//         />
//         <div className="flex flex-col  p-2 ">
//           {listNames?.length === 0 ? (
//             <p className="text-xs text-info">
//               You can leave address empty for an open feature
//             </p>
//           ) : (
//             listNames?.map(
//               (elem, index) =>
//                 index < 5 && (
//                   <div
//                     className={`btn   flex my-1 justify-between ${
//                       index % 2 === 0
//                         ? "btn-primary"
//                         : "btn-secondary btn-outline"
//                     }`}
//                     key={elem?.address}
//                     onClick={() => handleClick(elem?.address)}
//                   >
//                     <p>{elem?.name}</p>
//                     <p className="flex flex-col items-start text-[8px]">
//                       <span className="">CV Address : </span>

//                       <span className="w-[70px] truncate">{elem?.address}</span>
//                     </p>
//                   </div>
//                 )
//             )
//           )}
//         </div>
//       </div>
//     </MyCard>
//   );
// };
