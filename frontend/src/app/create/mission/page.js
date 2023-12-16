"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import { MyFormCreate } from "components/myComponents/form/MyForm";
import { useAuthState } from "context/auth";
import { MOOCK } from "constants/moock";
import { _apiGetAt } from "utils/ui-tools/web3-tools";
import { ethers } from "ethers";

import {
  FormInputsAI,
  FormResponseAI,
  formLabelAI,
} from "sections/Form/FormResponseAI";
import { useToolsDispatch, useToolsState } from "context/tools";
import { controllers } from "utils/controllers";
import { MySelect } from "components/myComponents/form/MySelects";
import { ENUMS } from "constants/enums";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyInput } from "components/myComponents/form/MyInput";
import { MissionName } from "components/links/MissionName";
import { LaunchpadName } from "components/links/LaunchpadName";

const PageCreateMission = () => {
  let { address, isConnected } = useAccount();

  let [price, setPrice] = useState(null); // ! balancesHub.missionPrice()
  let { metadatas, cv, datas } = useAuthState();

  useEffect(() => {
    (async () => {
      if (!price) {
        setPrice(
          ethers.utils.formatEther(
            await _apiGetAt({
              func: "missionPrice",
              targetContract: "balancesHub",
            })
          )
        );
      }
    })();
  }, []);

  return (
    <MyLayoutApp
      target={"mission"}
      url={"/create/mission"}
      initState={{ allowed: cv }}
    >
      <MyFormCreate
        template={1}
        title={"Create Mission"}
        stateInit={{
          allowed: price ? true : undefined,
          form: {
            ...MOOCK?.mission.form,
            price,
          },
          checked: [[], []],
        }}
        components={[
          {
            component: <FormInputsAI />,
            label: formLabelAI,
          },
          {
            component: (
              <div className="flex  ">
                <MySelect
                  style={"w-1/3 justify-center  flex-wrap mx-auto"}
                  target={"domain"}
                  arr={ENUMS.domain.map((el) => (
                    <>
                      <Icon icon={el?.icon} />
                      {el.name}
                    </>
                  ))}
                ></MySelect>
              </div>
            ),
            label: "What is the domain of your mission ?",
          },

          {
            component: (
              <>
                <>
                  <div className="flex gap-3 ">
                    <MyInputFile target={"image"}></MyInputFile>
                    <MyInputFile target={"banniere"}></MyInputFile>
                  </div>
                </>
              </>
            ),
            label: "Please post an images for your project ?",
          },
          {
            component: (
              <div className="w-3/4 flex  flex-col gap-2">
                <div className="gap-3 flex">
                  <MyInput label={false} styles={"w-full"} target={"title"} />
                  <MyInput label={false} styles={"w-full"} target={"company"} />
                </div>
                <MyTextArea
                  label={false}
                  styles={" w-full  min-h-[10vh] "}
                  target={"abstract"}
                />
              </div>
            ),
            label: "Please provide a short description of your project",
          },
          {
            component: (
              <MyTextArea
                label={false}
                styles={" max-h-[48vh] min-h-[30vh] "}
                target={"description"}
              />
            ),
            label: "Please details what is perimeter of your mission",
          },
          {
            component: (
              <div className="flex gap-3 w-1/3 items-center justify-center flex-col">
                <MyInput
                  label={false}
                  styles={"w-full"}
                  type={"number"}
                  target={"budget"}
                />

                <MyInput
                  styles={"w-full"}
                  label={false}
                  type={"number"}
                  target={"features"}
                />
              </div>
            ),
            label: "What is your budget and how many roles you want create ?",
          },

          datas?.missions?.length && {
            component: (
              <MySelect
                style={"w-2/3  flex-col"}
                arr={datas?.missions?.map((el) => (
                  <MissionName url={false} id={el} />
                ))}
                target={"mission"}
              ></MySelect>
            ),
            label:
              "This mission have a linked with one of your past missions ?",
          },
          datas?.launchpads?.length && {
            component: (
              <MySelect
                style={"w-2/3  flex-col"}
                arr={datas?.launchpads?.map((el) => (
                  <LaunchpadName url={false} launchpadID={el} />
                ))}
                target={"launchpad"}
              ></MySelect>
            ),
            label: "Do you want use launchpad budget to create your mission ?",
          },
          {
            component: <FormResponseAI />,
          },
        ]}
      ></MyFormCreate>
    </MyLayoutApp>
  );
};

export default PageCreateMission;
