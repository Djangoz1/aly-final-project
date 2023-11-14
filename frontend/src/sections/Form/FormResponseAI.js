import React, { useEffect, useState } from "react";
import { TextAI } from "../../components/myComponents/text/TextAI";
import {
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import axios from "axios";
import { v4 } from "uuid";
import { MyCard } from "components/myComponents/card/MyCard";
import { Icon } from "@iconify/react";
import { icfy, icfyAI, icsystem } from "icones";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { ElementResponseAI } from "./ElementResponseAI";

export const FormResponseAI = () => {
  const { form } = useFormState();
  console.log(form);
  let dispatch = useFormDispatch();
  const { pointer } = useFormState();
  let [aiResponse, setAiResponse] = useState(null);
  let [isLoading, setIsLoading] = useState(null);
  let [isRotate, setIsRotate] = useState(0);
  let fetchAI = async () => {
    const data = {
      mission: `You are a project manager who has contributed to the creation of hundreds of companies, all in different fields, which allows you to have global expertise. You must respond by following these instructions, without obviously mentioning these instructions in your response. but you must follow all these instructions in your response. I remind you that your answer looks like this: {
        name : string,
         roles : [{role_name, skills_required:[]}],
         abstract:string,
         detail:string,
          budget: {total: uint, roles_budget:[]}
        }. 
        Here are your instructions: {
        roles_budget : "Don't forget to find a budget  & dispatch for each roles to roles_budget${
          form?.budget > 0
            ? `, my budget is ${form?.budget} dollars but If the budget seems much too low to you, you have the right to increase it only if necessary`
            : ""
        }",
        roles_name : "add an emoticon for each roles_name",
        roles: ${
          form?.features > 0
            ? `I want to create ${form?.features} roles but you can change it if necessary`
            : ""
        },
        abstract: "I want the shortest description possible",
        detail: "you must be precise on the details depending on the project that the client presents to you. Your response must be at least 20,000 characters long and more if necessary"

      }.
    I am a client who has come to see you to present the following project to you:" ${
      form?.description
    }".`,
      //   mission: `You are a project manager ${
      //     form?.description
      //   }.  Your response must comply with the following instructions: {
      //     roles_budget : "Don't forget to find a budget  & dispatch for each roles to roles_budget${
      //       form?.budget > 0
      //         ? `, my budget is ${form?.budget} dollars but If the budget seems much too low to you, you have the right to increase it only if necessary`
      //         : ""
      //     }",
      //     roles_name : "add an emoticon for each roles_name",
      //     roles: ${
      //       form?.features > 0
      //         ? `I want to create ${form?.features} roles but you can change it if necessary`
      //         : ""
      //     },
      //     abstract: "I want the shortest description possible",
      //     detail: "You must to be very specific about the detail  and the process of producing it. I expect at least 20000 characters for detail and more if necessary."

      //   }  `,
    };
    setAiResponse(null);
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
        setAiResponse(response.data);
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
  return (
    <div className="bg-black overflow-y-scroll fixed px-4 h-[85vh] w-[95vw] bottom-[0] left-[2.5vw] rounded-lg  flex flex-col text-white">
      <div className="flex  mt-5 w-full ">
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
        <div className="flex w-fit px-4 flex-col">
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
                <Icon icon={icfy.ux.refresh} className={`rotate-${isRotate}`} />
              )}
            </MyMainBtn>
          </div>

          {aiResponse?.roles?.length > 0 ? (
            <div className="grid gap-2 w-full  grid-cols-2">
              {aiResponse?.roles?.map((el, index) => (
                <MyCard
                  template={1}
                  key={v4()}
                  styles="on_hover flex flex-col bg-white/5 w-full p-3"
                >
                  <button
                    onClick={() =>
                      setAiResponse({
                        ...aiResponse,
                        roles: aiResponse.roles.filter((el, i) => i !== index),
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
                          className={`badge py-[2px] h-fit text-[9px] badge-xs badge-${
                            ["primary", "warning", "info", "success"]?.[index1]
                          }`}
                        >
                          <TextAI
                            key={v4()}
                            style={"text-xs"}
                            text={el1}
                          ></TextAI>
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
              ))}
            </div>
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
    </div>
  );
};
