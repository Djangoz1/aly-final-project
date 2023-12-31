import React, { useEffect, useRef, useState } from "react";
import { TextAI } from "../../components/myComponents/text/TextAI";
import {
  doInitStateForm,
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import axios from "axios";
import { v4 } from "uuid";

import { icfy, icsystem } from "icones";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";

import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";

import { ElementResponseAI } from "./ElementResponseAI";
import { stateMission } from "utils/ui-tools/state-tools";
import { useAuthState } from "context/auth";
import { ENUMS } from "constants/enums";
import { MyFlowScheme } from "components/myComponents/layout/MyFlowScheme";

import { MyBadge } from "components/myComponents/box/MyList";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MySub } from "components/myComponents/text/MySub";
import { MySelect } from "components/myComponents/form/MySelects";

export const FormResponseAI = () => {
  const { form, target } = useFormState();
  if (form?.aiAssisted !== 1) {
    return (
      <TextAI
        text={"You don't want' help from Aly 😡"}
        style={"  gap-2   items-center h-full justify-center "}
      ></TextAI>
    );
  } else if (!form?.description) {
    return (
      <TextAI
        text={"For an AI assistance you must provide detail"}
        style={"  gap-2   items-center h-full justify-center "}
      ></TextAI>
    );
  }
  const { datas } = useAuthState();
  console.log(form);
  let dispatch = useFormDispatch();
  const { pointer } = useFormState();
  let aiResponse = form?.ai?.recommandations;
  let [isLoading, setIsLoading] = useState(null);
  let iaInstructions = async () => {
    const parts = [];
    if (form.target === "feature") {
      // Handle budget
      let mission = await stateMission(datas.missions[form.missionID || 0]);
      parts.push(
        `PROMPT ENGENEERING 1 : "You must to list the practices for this role on your response."`
      );
      parts.push(
        `PROMPT ENGENEERING 2 : "your client looking for a developper for his company. This is a context and information for your response but it's not for your client mission. Here is short detail of company: "${
          mission?.metadatas?.abstract || mission?.metadatas?.title
        }""`
      );
      parts.push(
        `LANGAGE TECHNOLOGY : "Your client looking for a developper with ${
          form.domain > 0
            ? ENUMS.courts[parseInt(form.domain)].court
            : `entreprise on domain ${
                ENUMS.domain[parseInt(mission?.metadatas.domain)].name
              }`
        } abilities and with an experience of ${
          ENUMS.domain[parseInt(form.specification)].name
        }"`
      );
      if (form?.description) {
        parts.push(`Detail: {
          mission : "${form.description}"
        }`);
      }
    } else {
      // Add project description
      if (form?.description) {
        parts.push(`Detail: "${form.description}"`);
      }
    }
    // Handle features
    if (form?.features > 0 || form?.target === "feature") {
      const featureText = form?.target === "feature" ? 1 : form?.features;
      const featureNote =
        form?.target !== "feature" ? "but you can change it if necessary" : "";
      (async () => {
        parts.push();
      })();

      parts.push(
        `Roles: "I want to create ${featureText} role(s) ${featureNote}"`
      );
    }

    // Mention the company
    if (form?.company) {
      parts.push(
        `Detail: "You must also mention the name of the client's company, which is ${form.company}"`
      );
    }
    return parts;
  };

  let fetchAI = async (prompt) => {
    let parts = await iaInstructions();
    const data = {
      mission:
        prompt || `Here is my description of mission:\n\n${parts.join("\n")}`,
    };
    console.log(data);
    // Constructing the final prompt

    doInitStateForm(dispatch, {
      ...form,
      ai: { ...form?.ai, recommandations: null },
    });

    setIsLoading(true);
    await axios
      .post(
        "https://syncflow-api.onrender.com/mission/extract_details?include_raw=false",
        data,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        doInitStateForm(dispatch, {
          ...form,
          ai: { ...form?.ai, recommandations: response?.data },
        });
      })
      .catch(function (error) {
        console.error(error);
      });

    setIsLoading(false);
  };

  useEffect(() => {
    if (!aiResponse && form?.aiAssisted === 1) {
      fetchAI();
      console.log("fetch ai response");
    }
  }, [form?.description]);

  console.log("airesponse :", aiResponse);

  return (
    <div className=" w-full relative h-full px-4">
      {isLoading === true ? (
        <TextAI
          text={"Please wait while creation of your project"}
          style={"  gap-2   items-center h-full justify-center "}
        >
          <MyBadge style={"mb-10 gap-2 text-[9px] font-light"} color={1}>
            <span className="opacity-40 loading loading-spinner loading-xs" />{" "}
            Let's see what I'm cooking
          </MyBadge>
        </TextAI>
      ) : (
        <MyMainBtn
          style={
            "btn-sm font-light absolute top-0 left-0 text-xs left-1/2 -translate-x-1/2"
          }
          color={2}
          icon={icfy.ux.refresh}
          setter={() => fetchAI()}
          _refresh={false}
        >
          Reload AI
        </MyMainBtn>
      )}

      {form?.target !== "feature" && aiResponse?.name ? (
        <div className="relative  w-full  h-full ">
          <MyFlowScheme
            main={{
              title: aiResponse?.name,
              modal: (
                <>
                  <ElementResponseAI
                    target={"abstract"}
                    text={aiResponse?.abstract}
                  />
                  <ElementResponseAI
                    target={"description"}
                    text={aiResponse?.detail}
                  />

                  {aiResponse?.budget?.total ? (
                    <>
                      <MySub>Budget</MySub>
                      <p className="c3 font-light font3">
                        {aiResponse?.budget?.total} $
                      </p>
                    </>
                  ) : (
                    <p className="font-light text-xs">Budget not matches</p>
                  )}
                </>
              ),
              icon: ENUMS.domain[parseInt(form?.domain || 0n)]?.icon,
            }}
            arr={
              aiResponse?.roles?.map((el, i) => ({
                title: el?.role_name,
                modal: (
                  <>
                    <MySub size={11}>{el?.role_name}</MySub>

                    <div className="w-full flex my-4 flex-wrap gap-2">
                      {el?.skills_required?.map((e, i) => (
                        <MyBadge
                          style={" text-[9px] c3 truncate "}
                          key={v4()}
                          color={1}
                        >
                          <span className="max-w-[100px] hover:max-w-fit truncate">
                            {e}
                          </span>
                        </MyBadge>
                      ))}
                    </div>
                    <TextAI
                      size={10}
                      text={el?.reason}
                      className="text-xs mb-4 font-light hover:text-white/70"
                    />
                    {aiResponse?.budget?.roles_budget?.[i] ? (
                      <>
                        <MyTitle>Budget</MyTitle>
                        <p className="text-xs c3 font-light">
                          {
                            aiResponse?.budget?.roles_budget?.[i]
                              ?.allocated_budget
                          }
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ),
              })) || []
            }
          />
        </div>
      ) : (
        aiResponse?.name && <FeaturesAI />
      )}
    </div>
  );
};
export const formLabelAI = "Would you like to use AI ?";
export const FormInputsAI = () => {
  return (
    <div className="flex  ">
      <MySelect
        target={"aiAssisted"}
        arr={["✋ I want to create by my hand", "🤖 I want to use Aly "]}
      ></MySelect>
    </div>
  );
};

const FeaturesAI = () => {
  let { form } = useFormState();
  let ai = form?.ai?.recommandations;
  return (
    <div className="flex w-1/2 justify-center py-10 items-center flex-col h-fit mx-auto my-auto ">
      <div className="flex flex-wrap w-4/5 justify-center gap-2">
        {ai?.roles?.[0]?.skills_required?.map((el, i) => (
          <MyBadge color={1} key={v4}>
            {el}
          </MyBadge>
        ))}
      </div>
      <ElementResponseAI
        text={ai?.roles?.[0]?.reason}
        target={"abstract"}
        title={"Abstract"}
      />
      <ElementResponseAI text={ai?.name} target={"description"} />
      <ElementResponseAI text={ai?.abstract} />
      <ElementResponseAI text={ai?.detail} />
    </div>
  );
};
