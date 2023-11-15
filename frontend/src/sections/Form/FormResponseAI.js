import React, { useEffect, useState } from "react";
import { TextAI } from "../../components/myComponents/text/TextAI";
import {
  doInitStateForm,
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import axios from "axios";
import { v4 } from "uuid";
import { MyCard } from "components/myComponents/card/MyCard";
import { Icon } from "@iconify/react";
import { icfy, icfyAI, icsystem } from "icones";
import { motion, AnimatePresence } from "framer-motion";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { ElementResponseAI } from "./ElementResponseAI";

export const FormResponseAI = () => {
  const { form } = useFormState();
  console.log(form);
  let dispatch = useFormDispatch();
  const { pointer } = useFormState();
  let aiResponse = form?.ai?.recommandations;

  let [isLoading, setIsLoading] = useState(null);
  let fetchAI = async () => {
    const data = {
      mission: `This is my description of mission(be specific for your detail response and return it with 10 000 characters minimum) : "${
        form?.description
      }".${
        form?.budget > 0
          ? `My budget is ${form?.budget} dollars (this budget could be change if seems necessary).`
          : form?.features > 0
          ? `I want to create ${form?.features} roles but you can change it if necessary`
          : form?.company
          ? `"You must also mention the name of the customer's company which is ${form?.company}"`
          : ""
      }
         
          
          

        `,
      //   mission: `This is my description of mission :  {detail : "${
      //     form?.description
      //   }."}
      //   The following instructions are for the prompt and not the mission and are a list of all the instructions you must follow without mentioning them in your response: promptInstructions {
      //       roles_budget : "Don't forget to find a budget  & dispatch for each roles to roles_budget${
      //         form?.budget > 0
      //           ? `, my budget is ${form?.budget} dollars but If the budget seems much too low to you, you have the right to increase it only if necessary`
      //           : ""
      //       }",
      //       role_name : "Don't forget to complete role_name for each role and add an emoticon of the beginning of the string",
      //       roles: ${
      //         form?.features > 0
      //           ? `I want to create ${form?.features} roles but you can change it if necessary`
      //           : ""
      //       },
      //       abstract: "I want the shortest description possible for abstract",
      //       detail: ["I want the most precise description possible for detail and you mention the entire process of producing the mission, string detail must return at least 20 000 characters long and more if necessary.", ${
      //         form?.company
      //           ? `"You must also mention the name of the customer's company which is ${form?.company}"`
      //           : ""
      //       }]

      //     }.
      //   ".`,
    };
    doInitStateForm(dispatch, {
      ...form,
      ai: { ...form?.ai, recommandations: null },
    });

    setIsLoading(true);
    console.log("isLoading", isLoading);
    await axios
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
        console.log("respponse", response?.data);
        doInitStateForm(dispatch, {
          ...form,
          ai: { ...form?.ai, recommandations: response?.data },
        });
      })
      .catch(function (error) {
        console.error(error);
      });

    console.log("isLoading", isLoading);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!aiResponse) {
      fetchAI();
      console.log("fetch ai response");
    }
  }, [form.description]);

  console.log("airesponse :", aiResponse);

  const [selectedId, setSelectedId] = useState(null);
  console.log(selectedId);
  return (
    <div className="bg-black overflow-y-scroll fixed px-4 h-[85vh] w-[95vw] bottom-[0] left-[2.5vw] rounded-lg  flex flex-col text-white">
      <div className="flex relative flex-col mt-5 w-full ">
        <div className="flex  w-full  flex-col">
          <div className="flex justify-between items-center">
            <h6 className="flex items-center justify-end">
              Nombre de tâches :{" "}
              <MyNum style={"ml-2"} num={aiResponse?.roles?.length || 0} />
            </h6>
            <MyMainBtn
              style={"ml-auto"}
              template={2}
              setter={() => fetchAI()}
              icon={{ no: true }}
            >
              {isLoading ? (
                <span className="loading loading-ring "></span>
              ) : (
                <Icon icon={icfy.ux.refresh} />
              )}
            </MyMainBtn>
          </div>

          {aiResponse?.roles?.length > 0 ? (
            <>
              <div className="overflow-x-scroll w-full  flex ">
                {aiResponse?.roles?.map((el, index) => (
                  <motion.div
                    layoutId={"txs" + index}
                    onClick={() => setSelectedId(index)}
                  >
                    <MyCard
                      template={1}
                      key={v4()}
                      styles="on_hover max-w-[730px] min-w-[530px] flex flex-col mr-2 bg-white/5  p-3"
                    >
                      <button
                        onClick={() =>
                          setAiResponse({
                            ...aiResponse,
                            roles: aiResponse.roles.filter(
                              (el, i) => i !== index
                            ),
                          })
                        }
                        className="btn on_hover_view btn-ghost btn-xs absolute top-1 right-1"
                      >
                        <Icon icon={icfy.ux.garbage} className="text-error " />
                      </button>
                      <TextAI text={el?.role_name} style={" font-semibold "}>
                        <div className="flex items-center my-3 flex-wrap gap-2">
                          {el?.skills_required?.map((el1, index1) => (
                            <div
                              className={`cursor-pointer badge py-[2px] relative on_hover h-fit text-[9px] badge-xs badge-${
                                ["primary", "warning", "info", "success"]?.[
                                  index1
                                ]
                              }`}
                              key={v4()}
                              onClick={() => {
                                let skills = aiResponse?.roles?.[
                                  index
                                ]?.skills_required?.filter(
                                  (el, i) => i !== index1
                                );
                                let roles = [...aiResponse?.roles];
                                roles[index].skills_required = skills;
                                setAiResponse({ ...aiResponse, roles });
                              }}
                            >
                              <Icon
                                className="absolute translate-x-1/2 -translate-y-1/2 text-lg on_hover_view top-0 right-0 text-error     "
                                icon={icfy.ux.remove}
                              />
                              <TextAI style={"text-xs"} text={el1}></TextAI>
                            </div>
                          ))}
                        </div>
                      </TextAI>
                      {aiResponse?.budget?.roles_budget?.[index]
                        ?.allocated_budget ? (
                        <div className="flex mt-auto items-center">
                          <Icon
                            icon={icfy.bank.dollars}
                            className="mr-2 text-2xl"
                          />
                          <TextAI
                            text={aiResponse?.budget?.roles_budget?.[
                              index
                            ]?.allocated_budget
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                          ></TextAI>
                        </div>
                      ) : undefined}
                    </MyCard>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full m-auto  h-full  flex-col justify-center flex items-end">
              <p className="italic">
                I didn't find any specific task for your project ...
              </p>
              <p className="text-warning">
                Maybe you can reload or build by own
              </p>
            </div>
          )}
        </div>
        <MyCard
          template={1}
          styles={"py-4"}
          className="flex px-2 py-3 border rounded-lg border-white/5 flex-col w-1/3"
        >
          <div className="chat ml-4 mb-5 chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src="/ai.png" />
              </div>
            </div>
            <div className="chat-header">
              Aly
              {/* <span className="text-xs  opacity-50">Mission name</span> */}
            </div>
            <div className="chat-bubble">
              <TextAI
                style={"font-bold text-xs"}
                text={"Let's see what I've cooked..."}
              ></TextAI>
            </div>
          </div>
          {aiResponse?.budget?.total &&
          form?.budget != aiResponse?.budget?.total ? (
            <div className="chat ml-4 mb-5 chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src="/ai.png" />
                </div>
              </div>
              <div className="chat-header">
                Aly
                {/* <span className="text-xs  opacity-50">Mission name</span> */}
              </div>
              <div className="chat-bubble text-xs flex items-center">
                I advise you to opt for a budget of {aiResponse?.budget?.total}
                <span className="line-through text-error mx-2">
                  {form?.budget}
                </span>{" "}
                $
              </div>
            </div>
          ) : undefined}
          {aiResponse?.budget?.roles_budget?.length !==
            aiResponse?.roles?.length && (
            <div className="chat ml-4 mb-5 chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" src="/ai.png" />
                </div>
              </div>
              <div className="chat-header">
                Aly
                {/* <span className="text-xs  opacity-50">Mission name</span> */}
              </div>
              <div className="chat-bubble">
                <TextAI
                  style={"font-bold text-xs"}
                  text={
                    "I had difficulty providing you with a budget, perhaps you should modify/give me a budget"
                  }
                ></TextAI>
              </div>
            </div>
          )}
          <ElementResponseAI
            target={"title"}
            title={`Project name :`}
            text={aiResponse?.name}
          />
          <ElementResponseAI
            target={"budget"}
            title={`Budget total for this mission:`}
            text={aiResponse?.budget?.total}
          >
            $
          </ElementResponseAI>

          <ElementResponseAI
            style={"whitespace-break-spaces"}
            target={"description"}
            title={"Abstract description :"}
            text={aiResponse?.abstract}
          />

          <ElementResponseAI
            target={"description"}
            title={"Detail :"}
            text={aiResponse?.detail}
          />
        </MyCard>
      </div>

      <div className="flex mt-auto mb-20 justify-between">
        <MyMainBtn
          template={1}
          color={1}
          setter={() => doStateFormPointer(dispatch, pointer - 1)}
          icon={{ no: true }}
          style={"flex items-center w-fit"}
        >
          <span className="flex items-center">
            Previous
            <Icon icon={icfy.ux.arrow} className={`-rotate-90 `} />
          </span>
        </MyMainBtn>
        <MyMainBtn
          template={1}
          color={0}
          setter={() => doStateFormPointer(dispatch, pointer + 1)}
          icon={{ no: true }}
          style={"flex items-center w-fit"}
        >
          <span className="flex items-center">
            Next
            <Icon icon={icfy.ux.arrow} className={`rotate-90 `} />
          </span>
        </MyMainBtn>
      </div>
      <AnimatePresence>
        {selectedId >= 0 && selectedId != null && (
          <motion.div
            className="z-100 absolute box-border  w-full h-full translate-y-1/2 z-100 translate-x-1/2"
            layoutId={"txs" + selectedId}
          >
            <MyCard
              template={3}
              key={v4()}
              styles=" flex flex-col h-full relative w-full bg-white c1  p-3"
            >
              <motion.button
                className="btn btn-ghost btn-xs absolute opacity-70 hover:opacity-100  transition top-2 right-2"
                onClick={() => setSelectedId(null)}
              >
                <Icon
                  className="hover:scale-125 text-lg transition hover:text-xl"
                  icon={icfy.ux.check.uncheck}
                />
              </motion.button>
              <TextAI
                text={aiResponse?.roles?.[selectedId]?.role_name}
                style={" font-semibold "}
              >
                <div className="flex items-center my-3 flex-wrap gap-2">
                  {aiResponse?.roles?.[selectedId]?.skills_required?.map(
                    (el1, index1) => (
                      <div
                        className={`cursor-pointer badge py-[2px] relative on_hover h-fit text-[9px] badge-xs badge-${
                          ["primary", "warning", "info", "success"]?.[index1]
                        }`}
                        key={v4()}
                        onClick={() => {
                          let skills = aiResponse?.roles?.[
                            selectedId
                          ]?.skills_required?.filter((el, i) => i !== index1);
                          let roles = [...aiResponse?.roles];
                          roles[selectedId].skills_required = skills;
                          setAiResponse({ ...aiResponse, roles });
                        }}
                      >
                        <Icon
                          className="absolute translate-x-1/2 -translate-y-1/2 text-lg on_hover_view top-0 right-0 text-error     "
                          icon={icfy.ux.remove}
                        />
                        <TextAI style={"text-xs"} text={el1}></TextAI>
                      </div>
                    )
                  )}
                </div>
              </TextAI>
              <span className="text-xs">
                {aiResponse?.roles?.[selectedId]?.reason}
              </span>
              {aiResponse?.budget?.roles_budget?.[selectedId]
                ?.allocated_budget ? (
                <div className="flex mt-auto items-center">
                  <Icon icon={icfy.bank.dollars} className="mr-2 text-2xl" />
                  <TextAI
                    text={aiResponse?.budget?.roles_budget?.[
                      selectedId
                    ]?.allocated_budget
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                  ></TextAI>
                </div>
              ) : undefined}
            </MyCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
