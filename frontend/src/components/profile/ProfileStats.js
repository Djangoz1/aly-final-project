// import { MyCard } from "components/myComponents/MyCard";
// import { MyTitle } from "components/myComponents/MyTitle";
// import React from "react";
// import { subText } from "styles/style";

// export const ProfileStats = () => {
//   const missions = {
//     javascript: 10,
//     typescript: 5,
//     react: 3,
//     node: 2,
//     python: 1,
//   };
//   return (
//     <MyCard styles={"flex flex-col"}>
//       <div className="flex items-start justify-between">
//         <MyTitle title={"Statistics"} />
//         <div className="flex items-start">
//           <div className="flex flex-col items-center mr-3 justify-center">
//             <input
//               type="checkbox"
//               className="toggle  toggle-sm toggle-primary"
//               checked
//             />
//             <p className="text-xs">Work</p>
//           </div>
//           <div className="flex flex-col items-center justify-center">
//             <input
//               type="checkbox"
//               className="toggle toggle-sm bg-white toggle-secondary"
//               checked
//             />
//             <p className="text-xs">Enterprise</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-evenly">
//         {Object.keys(missions).map((key) => (
//           <div className="flex flex-col items-end justify-center">
//             <div
//               className={"px-2 bg-black/20 rounded shadow-2xl mt-auto mx-auto"}
//               style={{ height: `${10 + missions[key] * 10}px` }}
//             ></div>
//             <p className="">{key}</p>
//           </div>
//         ))}
//       </div>
//     </MyCard>
//   );
// };
