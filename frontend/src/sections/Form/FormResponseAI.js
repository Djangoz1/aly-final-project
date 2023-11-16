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
import { MyCard } from "components/myComponents/card/MyCard";
import { Icon } from "@iconify/react";
import { icfy, icfyAI, icsystem } from "icones";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { ElementResponseAI } from "./ElementResponseAI";
import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyFramerModal } from "components/myComponents/box/MyFramerModals";
import { ChatBubble } from "components/ChatBubble";
import { doStateTools } from "context/tools";
import { MyInput } from "components/myComponents/form/MyInput";

export const FormResponseAI = () => {
  const { form, target } = useFormState();
  console.log(form);
  let ref = useRef(null);
  let isInView = useInView(ref);
  let dispatch = useFormDispatch();
  const { pointer } = useFormState();
  let aiResponse = form?.ai?.recommandations;
  const [prompt, setPrompt] = useState(null);
  let [isLoading, setIsLoading] = useState(null);
  let iaInstructions = () => {
    const parts = [];

    // Add project description
    if (form?.description) {
      parts.push(`Detail: "${form.description}"`);
    }

    // Handle budget
    if (form?.budget > 0) {
      parts.push(
        `Budget: "My budget is ${form.budget} dollars (this budget can be changed if necessary)."`
      );
    }

    // Handle features
    if (form?.features > 0 || form?.target === "feature") {
      const featureText = form?.target === "feature" ? 1 : form?.features;
      const featureNote =
        form?.target !== "feature" ? "but you can change it if necessary" : "";
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
  useEffect(() => {
    let parts = iaInstructions();
    // Constructing the final prompt
    setPrompt(`Here is my description of mission:\n\n${parts.join("\n")}`);
  }, [isInView]);
  let fetchAI = async () => {
    const data = {
      mission: prompt,
    };

    doInitStateForm(dispatch, {
      ...form,
      ai: { ...form?.ai, recommandations: null },
    });

    setIsLoading(true);
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
    if (!aiResponse && prompt && isInView) {
      fetchAI();
      console.log("fetch ai response");
    }
  }, [form?.description, isInView]);

  console.log("airesponse :", aiResponse);

  const [selectedId, setSelectedId] = useState(null);
  return (
    <>
      <div ref={ref} className="flex relative flex-col  w-full ">
        <div className="flex  w-full  flex-col-reverse ">
          {!isLoading ? (
            <MyCard
              template={1}
              styles={"py-4 w-full"}
              className="flex px-2 py-3 border rounded-lg border-white/5 flex-col w-1/3"
            >
              <MyNum
                num={aiResponse?.budget?.total}
                style={"absolute top-2 right-2"}
              >
                ${" "}
              </MyNum>
              <ChatBubble
                ai={true}
                style={"ml-4"}
                text={"Let's see what I've cooked..."}
              />
              {aiResponse?.roles?.length === 0 && (
                <ChatBubble
                  ai={true}
                  style={"ml-4"}
                  text={"I didn't find any specific task for your project ..."}
                >
                  <p className="text-warning text-[9px]">
                    Maybe you can reload or build by own
                  </p>
                </ChatBubble>
              )}

              {aiResponse?.budget?.total &&
              form?.budget != aiResponse?.budget?.total ? (
                <ChatBubble
                  ai={true}
                  style={"ml-4"}
                  text={`I advise you to opt for a budget of ${aiResponse?.budget?.total} $`}
                >
                  <span className="line-through text-error  text-xs">
                    {form?.budget}
                  </span>
                </ChatBubble>
              ) : undefined}
              {aiResponse?.budget?.roles_budget?.length !==
                aiResponse?.roles?.length && (
                <ChatBubble
                  ai={true}
                  style={"ml-4"}
                  text={
                    "I had difficulty providing you with a budget, perhaps you should modify/give me a budget"
                  }
                />
              )}
              <ElementResponseAI
                target={"title"}
                title={`Project name :`}
                text={aiResponse?.name}
                setter={(value) =>
                  doInitStateForm(dispatch, {
                    ...form,
                    ai: {
                      ...form?.ai,
                      recommandations: {
                        ...form?.ai?.recommandations,
                        name: value,
                      },
                    },
                  })
                }
              />
              <ElementResponseAI
                target={"budget"}
                title={`Budget total for this mission:`}
                text={aiResponse?.budget?.total}
                setter={(value) =>
                  doInitStateForm(dispatch, {
                    ...form,
                    ai: {
                      ...form?.ai,
                      recommandations: {
                        ...form?.ai?.recommandations,
                        budget: {
                          ...form?.ai?.recommandations?.budget,
                          total: value,
                        },
                      },
                    },
                  })
                }
              >
                $
              </ElementResponseAI>

              <ElementResponseAI
                style={"whitespace-break-spaces"}
                target={"description"}
                title={"Abstract description :"}
                text={aiResponse?.abstract}
                setter={(value) =>
                  doInitStateForm(dispatch, {
                    ...form,
                    ai: {
                      ...form?.ai,
                      recommandations: {
                        ...form?.ai?.recommandations,
                        abstract: value,
                      },
                    },
                  })
                }
              />

              <ElementResponseAI
                target={"description"}
                title={"Detail :"}
                text={aiResponse?.detail}
                setter={(value) =>
                  doInitStateForm(dispatch, {
                    ...form,
                    ai: {
                      ...form?.ai,
                      recommandations: {
                        ...form?.ai?.recommandations,
                        detail: value,
                      },
                    },
                  })
                }
              />
              <MyInput
                label={false}
                styles={"w-4/5 mx-auto mt-5"}
                target={"chatAI"}
                setter={(value) => {
                  const parts = [];

                  parts.push(`Previous:${JSON.stringify(aiResponse, 2, null)}`);
                  // Add project description
                  parts.push(`Update: "${value}"`);
                  parts.push(`Instructions:\n\n${iaInstructions().join("\n")}`);

                  // Handle budget

                  // Constructing the final prompt
                  let _prompt = `Here is your previous response and I want to update only few modifications (Keep the rest):\n\n${parts.join(
                    "\n"
                  )}`;
                  setPrompt(_prompt);
                  console.log(_prompt);
                  setIsLoading(true);
                  fetchAI();
                  setIsLoading(false);
                }}
              />
            </MyCard>
          ) : (
            <div className=" flex  w-full h-[40vh]">
              <MyLoader template={1} style={"mx-auto my-auto"} />
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex -z-1 justify-between items-center">
              {form?.target === "mission" ? (
                <h6 className="flex items-center justify-end">
                  Nombre de tâches :{" "}
                  <MyNum style={"ml-2"} num={aiResponse?.roles?.length || 0} />
                </h6>
              ) : (
                <></>
              )}
              {selectedId === null ? (
                <MyMainBtn
                  style={"-z-2 relative  ml-auto"}
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
              ) : (
                <></>
              )}
            </div>
            {aiResponse?.roles?.length > 0 ? (
              <MyScrolledXDiv>
                <MyFramerModal
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                  style={
                    "on_hover my-3 min-w-[430px] flex flex-col h-[150px] p-2 mr-2 bg-white/5  "
                  }
                  arr={aiResponse?.roles?.map((el, index) => (
                    <>
                      {form?.target === "mission" ? (
                        <button
                          onClick={() =>
                            doInitStateForm(dispatch, {
                              ...form,
                              ai: {
                                ...form?.ai,
                                recommandations: {
                                  ...form?.ai?.recommandations,
                                  roles:
                                    form?.ai?.recommandations?.roles?.filter(
                                      (el, i) => i !== index
                                    ),
                                },
                              },
                            })
                          }
                          className="btn on_hover_view btn-ghost btn-xs absolute top-1 right-1"
                        >
                          <Icon
                            icon={icfy.ux.garbage}
                            className="text-error "
                          />
                        </button>
                      ) : (
                        <></>
                      )}
                      <TextAI text={el?.role_name} style={" font-semibold "}>
                        <div className="flex items-center my-3 flex-wrap grid-row-2 gap-2">
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
                                doInitStateForm(dispatch, {
                                  ...form,
                                  ai: {
                                    ...form?.ai,
                                    recommandations: {
                                      ...form?.ai?.recommandations,
                                      roles,
                                    },
                                  },
                                });
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
                    </>
                  ))}
                >
                  <TextAI
                    text={aiResponse?.roles?.[selectedId]?.role_name}
                    style={" font-semibold "}
                  >
                    <div className="flex items-center my-3 flex-wrap gap-2">
                      {aiResponse?.roles?.[selectedId]?.skills_required?.map(
                        (el1, index1) => (
                          <div
                            className={`cursor-pointer badge py-[2px] relative on_hover h-fit text-[9px] badge-xs badge-${
                              ["primary", "warning", "info", "success"]?.[
                                index1
                              ]
                            }`}
                            key={v4()}
                            onClick={() => {
                              let skills = aiResponse?.roles?.[
                                selectedId
                              ]?.skills_required?.filter(
                                (el, i) => i !== index1
                              );
                              let roles = [...aiResponse?.roles];
                              roles[selectedId].skills_required = skills;
                              doInitStateForm(dispatch, {
                                ...form,
                                ai: {
                                  ...form?.ai,
                                  recommandations: {
                                    ...form?.ai?.recommandations,
                                    roles,
                                  },
                                },
                              });
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
                      <Icon
                        icon={icfy.bank.dollars}
                        className="mr-2 text-2xl"
                      />
                      <TextAI
                        text={aiResponse?.budget?.roles_budget?.[
                          selectedId
                        ]?.allocated_budget
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                      ></TextAI>
                    </div>
                  ) : undefined}
                </MyFramerModal>
              </MyScrolledXDiv>
            ) : undefined}
          </div>
        </div>
      </div>

      <div className="flex mt-10  justify-between">
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
    </>
  );
};

let MyLoading = ({ style }) => {
  return (
    <div className="gearbox ">
      <div className="overlay"></div>
      <div className="gear one">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className="gear two">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className="gear three">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
      <div className="gear four large">
        <div className="gear-inner">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>
  );
};
