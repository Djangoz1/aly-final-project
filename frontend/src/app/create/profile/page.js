"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";

import React from "react";

import { useAccount } from "wagmi";

import { MOOCK } from "constants/moock";

import { _apiGet, _apiPost } from "utils/ui-tools/web3-tools";
import { useAuthDispatch, useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyMAIL } from "icones";
import { styles } from "styles/style";
import { MyFormCreate } from "components/myComponents/form/MyForm";

import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MySelect } from "components/myComponents/form/MySelects";
import { ENUMS } from "constants/enums";
import { v4 } from "uuid";
import { FormSocial, labelFormSocial } from "components/myComponents/form";

const PageCreateProfile = () => {
  let { address, isConnected } = useAccount();

  let { cv } = useAuthState();
  return (
    <MyLayoutApp
      initState={{ allowed: true }}
      target={"profile"}
      url={"/create/profile"}
    >
      <MyFormCreate
        template={1}
        title={"Create profile"}
        stateInit={{
          allowed: !cv && isConnected ? true : false,
          checked: MOOCK.profile.checked,
        }}
        styles={{ btn: styles.gbtn + " uppercase gb2 border-none" }}
        components={
          cv
            ? [{ label: "Hop hop hop ! ✋ You already have an account" }]
            : [
                {
                  component: (
                    <div className="flex flex-col w-full gap-2">
                      <MyCheckboxes
                        label={false}
                        target={"citizen"}
                        checkboxes={[
                          { title: "M.", value: "Mr" },
                          { title: "Mme.", value: "Mme" },
                        ]}
                      />
                      <div className={"flex w-full gap-5  "}>
                        <MyInput
                          styles={"w-full "}
                          target={"firstName"}
                          label={"Prénom"}
                        />
                        <MyInput
                          styles={"w-full"}
                          target={"lastName"}
                          label={"Nom"}
                        />
                      </div>
                      <div className={"flex w-full gap-5  "}>
                        <MyInput
                          target={"phone"}
                          styles={"w-full"}
                          icon={icfy.ux.phone}
                          type={"phone"}
                        />
                        <MyInput
                          styles={"w-full"}
                          target={"dateOfBirth"}
                          label={"Date de naissance"}
                          type={"date"}
                        />
                      </div>
                    </div>
                  ),
                  label: "Please provide your personal informations",
                },

                {
                  component: (
                    <div className={"flex w-full gap-2"}>
                      <MyInput target={"username"} styles={"w-full "} />
                      <MyInput
                        target={"email"}
                        styles={"w-full"}
                        icon={icfyMAIL}
                        type={"mail"}
                      />
                    </div>
                  ),
                  label: "Please provide your mail and username",
                },
                {
                  component: (
                    <div className={"flex flex-col items-center w-full gap-2"}>
                      <MyInputFile label={"Photo de profil"} target={"image"} />

                      <MyTextArea
                        target={"description"}
                        styles={"w-full "}
                        label={false}
                      />
                    </div>
                  ),
                  label: "Please provide your social information",
                },
                {
                  component: (
                    <div className="">
                      <MyInputFile label={"CV"} target={"cvImg"} />
                      {/* <p className="text-light c4 font-light text-xs mt-2 mb-1 ">
                  Vous pouvez renseigner votre CV hors plateforme afin qu'il
                  soit vu par les recruteurs.
                </p> */}
                    </div>
                  ),
                  label: "Do you want add your personal CV ?",
                },
                {
                  component: (
                    <MySelect
                      style={"w-1/2 mx-auto justify-center flex-wrap"}
                      target={"experience"}
                      arr={[
                        "- d'1 semaine",
                        "- de 4 semaines",
                        "+ de 4 semaines",
                        "+ de 3 mois",
                        "Ouvert",
                      ]}
                    />
                  ),
                  label: "Wich kind of mission do you search ?",
                },
                {
                  component: <FormSocial />,
                  label: labelFormSocial,
                },

                {
                  component: (
                    <div className="flex flex-col  justify-between">
                      <MySelect
                        style={" flex-wrap justify-center max-w-[30vw]"}
                        target={"skills"}
                        arr={[
                          ...ENUMS.courts.map((el) => (
                            <div key={v4()} className="flex gap-2 items-center">
                              <Icon icon={el.badge} />
                              {el.court}
                            </div>
                          )),
                        ]}
                        label={"Compétences"}
                      />
                      <MyInput
                        styles={
                          "w-3/4 left-1/2 -translate-x-1/2 absolute bottom-3"
                        }
                        color={1}
                        _placeholder={"Add more"}
                        setter={(value, form, dispatch) => {
                          if (!form?.skills.includes(value)) {
                            console.log("value", value);
                            console.log("");
                            let skills = [...form.skills];
                            skills.push(value);
                            dispatch({
                              ...form,
                              add: "",
                              skills,
                            });
                          }
                        }}
                      />
                    </div>
                  ),
                  label: "What is your skills ?",
                },
                {
                  component: (
                    <MySelect
                      style={" flex-wrap justify-center max-w-[30vw]"}
                      target={"domain"}
                      arr={ENUMS.domain.map((el) => (
                        <div key={v4()} className="flex gap-2 items-center">
                          <Icon icon={el.icon} />
                          {el.name}
                        </div>
                      ))}
                    />
                  ),
                  label: "What is domain of mission do you want ?",
                },
                {
                  component: (
                    <MySelect
                      style={" flex-wrap max-w-[30vw]"}
                      target={"visibility"}
                      arr={["✋ No, I'm not", "👍 Yes, I'm avalaible"]}
                    />
                  ),
                  label: "Are you available for work as soon as possible ?",
                },
              ]
        }
      />
    </MyLayoutApp>
  );
};

export default PageCreateProfile;
