// "use client";
// import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
// import { Viewport } from "components/myComponents/layout/MyViewport";
// import React from "react";

// import { _form_create_profile } from "utils/ux-tools/form/profile";
// import { MyFormModal } from "components/myComponents/form/MyFormModal";
// import { MySteps } from "components/myComponents/MySteps";
// import { MENUS } from "constants/menus";
// import { useAccount } from "wagmi";

// import {
//   moock_create_profile,
//   moock_create_profile_checked,
//   moock_create_profile_placeholder,
// } from "constants/moock";

// import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
// import { doAuthCV, useAuthDispatch } from "context/auth";
// import { createURICv } from "utils/ui-tools/pinata-tools";
// import { Icon } from "@iconify/react";
// import { icfyCV } from "icones";
// import { styles } from "styles/style";
// import { MyForm, MyFormCreate } from "components/myComponents/form/MyForm";
// import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
// import {
//   FormCreateProfile1,
//   FormCreateProfile2,
// } from "sections/Profile/form/create/FormCreateProfile1";

// const PageCreateProfile = () => {
//   let { address, isConnected } = useAccount();
//   let dispatch = useAuthDispatch();
//   let submitForm = async (form) => {
//     if (isConnected) {
//       let tokenURI = await createURICv(form);
//       await _apiPost("createCV", [tokenURI]);
//       await doAuthCV(dispatch, address);
//     }
//   };

//   return (
//     <MyLayoutApp>
//       <MyFormCreate
//         title={"Create profile"}
//         stateInit={{
//           form: moock_create_profile,
//           placeholders: moock_create_profile_placeholder,
//           checked: moock_create_profile_checked,
//         }}
//         submit={submitForm}
//         side={<MySteps arr={MENUS.profile.create} />}
//         arr={_form_create_profile}
//         styles={{ btn: styles.gbtn + " uppercase gb2 border-none" }}
//         components={[
//           {
//             component: <></>,
//             label: "Information",
//           },
//           {
//             component: <FormCreateProfile1 />,
//             label: "Profile",
//           },
//           {
//             component: <FormCreateProfile2 />,
//             label: "Social",
//           },
//         ]}
//         btn={
//           <>
//             <Icon icon={icfyCV} />
//             Create profile
//           </>
//         }
//       />
//     </MyLayoutApp>
//   );
// };

// export default PageCreateProfile;
