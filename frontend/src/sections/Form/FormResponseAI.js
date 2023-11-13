import React, { useEffect, useState } from "react";
import { TextAI } from "../../components/myComponents/text/TextAI";
import { useFormState } from "context/form";
import axios from "axios";
import { v4 } from "uuid";
import { MyCard } from "components/myComponents/card/MyCard";
import { Icon } from "@iconify/react";
import { icfy } from "icones";

export const FormResponseAI = () => {
  const { form } = useFormState();
  console.log(form);

  let [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    if (!aiResponse) {
      const data = {
        mission:
          "I want to create a freelance dApp that uses solidity smart contracts to link a freelancer to a company. The dApp also includes a launchpad part as well as an escrow protocol. The launchpad protocol will allow users to finance the project and in return receive ERC20 tokens from the dApp. The escrow protocol will allow freelancers who have already worked on our dApp to examine a dispute and will receive ERC20 tokens in return for their expertise",
      };

      axios
        .post(
          "https://syncflow-api.onrender.com/extract_all_details?include_raw=false",
          data,
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          setAiResponse(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
      console.log("fetch ai response");
    }
  }, [form.description]);
  console.log("airesponse :", aiResponse);
  return (
    <div className="bg-black fixed h-[95vh] w-[95vw] top-[2.5vh] left-[2.5vw] rounded-lg  flex flex-col text-white">
      <div className="flex items-center">
        <TextAI style={"font-bold text-lg"} text={`🗂️ Project name :`}>
          <TextAI text={`- ${aiResponse?.name}`} style={"mb-4"}></TextAI>
        </TextAI>
      </div>
      <div className="flex mt-4 items-center">
        <TextAI style={"text-xs text-lg"} text={`${aiResponse?.abstract}`}>
          <span className="flex items-center text-[9px] text-warning">
            <Icon icon={icfy.ux.warning} className="text-lg" /> This description
            will appear on short description item
          </span>
        </TextAI>
      </div>
      <div className="flex mt-4 items-center">
        <TextAI style={"font-bold text-lg"} text={`ℹ️ Details :`}>
          <TextAI text={`- ${aiResponse?.detail}`} style={"mb-4"}></TextAI>
        </TextAI>
      </div>

      <div className="flex mt-4 items-center">
        <TextAI
          style={"font-bold text-lg"}
          text={`ℹ️ Nombre de tâches : ${aiResponse?.roles?.length}`}
        ></TextAI>
      </div>

      <div className="flex ">
        {aiResponse?.roles?.map((el, index) => (
          <MyCard template={1} key={v4()} className="h-full">
            <TextAI
              text={index + 1 + "- " + el?.role_name}
              style={" font-semibold text-lg"}
            >
              <div className="flex items-center mt-3 flex-wrap gap-2">
                {el?.skills_required?.map((el1, index1) => (
                  <div
                    className={`badge badge-${
                      ["primary", "warning", "info", "success"]?.[index1]
                    }`}
                  >
                    <TextAI key={v4()} style={"text-xs"} text={el1}></TextAI>
                  </div>
                ))}
              </div>
            </TextAI>
          </MyCard>
        ))}
      </div>
    </div>
  );
};
