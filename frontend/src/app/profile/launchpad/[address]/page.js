// "use client";
// import { ImagePin } from "components/Image/ImagePin";
// import { LaunchpadDescription } from "components/Launchpad/LaunchpadDescription";
// import { LaunchpadHistory } from "components/Launchpad/LaunchpadHistory";
// import { LaunchpadIdentity } from "components/Launchpad/LaunchpadIdentity";
// import { LaunchpadStats } from "components/Launchpad/LaunchpadStats";
// import { MySection } from "components/myComponents/MySection";
// import React, { useEffect, useState } from "react";
// import { Layout } from "sections/Layout";
// import { getLaunchpadDatas } from "utils/ui-tools/launchpad-tools";

// const LaunchpadPage = ({ params }) => {
//   const launchAddr = params.address;

//   const [isDatas, setIsDatas] = useState(null);
//   const getDatas = async () => {
//     const datas = await getLaunchpadDatas(launchAddr);
//     setIsDatas(datas);
//   };
//   useEffect(() => {
//     if (launchAddr && !isDatas) getDatas();
//   }, [launchAddr]);
//   return (
//     <Layout banniere={<ImagePin CID={isDatas?.metadata?.image} />}>
//       <MySection>
//         <div className="relative   mb-auto w-full">
//           <div className="flex flex-col  ">
//             <div className="flex">
//               <LaunchpadStats datas={isDatas} />
//               <LaunchpadIdentity datas={isDatas} />
//             </div>
//             <div className="flex">
//               <LaunchpadDescription datas={isDatas} />
//               <LaunchpadHistory datas={isDatas} />
//             </div>
//           </div>
//         </div>
//       </MySection>
//     </Layout>
//   );
// };

// export default LaunchpadPage;
