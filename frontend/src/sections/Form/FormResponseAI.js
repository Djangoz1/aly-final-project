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
      mission: form?.description,
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
      <div className="w-full  flex justify-between">
        <span className="flex items-center">
          <Icon icon={icsystem.ai} className="text-primary text-6xl" />
          <TextAI
            style={"font-bold text-lg"}
            text={"Let's see what I've cooked..."}
          ></TextAI>
        </span>
        <MyMainBtn template={2} setter={() => fetchAI()} icon={{ no: true }}>
          {isLoading ? (
            <span className="loading loading-ring w-fit"></span>
          ) : (
            <Icon icon={icfy.ux.refresh} className={`rotate-${isRotate}`} />
          )}
        </MyMainBtn>
      </div>

      <div className="flex mt-5 w-full ">
        <div className="flex flex-col w-1/3">
          <div className="flex items-center relative on_hover w-full">
            <button
              className="right-0 absolute on_hover_view btn btn-xs btn-ghost top-0"
              onClick={() =>
                setAiResponse({ ...aiResponse, name: form?.title })
              }
            >
              <Icon icon={icfy.ux.refresh} />
            </button>
            <TextAI style={"font-bold "} text={`🗂️ Project name :`}>
              <TextAI
                text={`- ${aiResponse?.name}`}
                style={"mb-4 text-xs"}
              ></TextAI>
            </TextAI>
          </div>
          <div className="flex my-4 items-center">
            <TextAI style={"font-bold"} text={"Abstract description :"}>
              <TextAI
                style={"text-xs text-lg"}
                text={`${aiResponse?.abstract}`}
              >
                <span className="flex items-center text-[9px] text-warning">
                  <Icon icon={icfy.ux.warning} className="text-lg" /> This
                  description will appear on short description item
                </span>
              </TextAI>
            </TextAI>
          </div>
          <div className="w-full flex flex-col on_hover relative">
            <div className="absolute right-0 top-0 on_hover_view flex items-center">
              <button
                className="btn btn-xs btn-ghost "
                onClick={() =>
                  setAiResponse({ ...aiResponse, detail: form?.description })
                }
              >
                <Icon icon={icfy.ux.edit} />
              </button>
              <button
                className=" btn btn-xs btn-ghost "
                onClick={() =>
                  setAiResponse({ ...aiResponse, detail: form?.description })
                }
              >
                <Icon icon={icfy.ux.refresh} />
              </button>
            </div>

            <TextAI style={"font-bold "} text={`ℹ️ Details :`}>
              <TextAI
                text={`- ${aiResponse?.detail}`}
                style={"mb-4 text-xs"}
              ></TextAI>
            </TextAI>
          </div>
        </div>
        <div className="flex w-2/3 px-4 flex-col">
          <h6 className="flex items-center justify-end">
            Nombre de tâches :{" "}
            <MyNum style={"ml-2"} num={aiResponse?.roles?.length || 0} />
          </h6>
          {aiResponse?.roles?.length > 0 ? (
            <div className="grid gap-2 w-full  grid-cols-2">
              {aiResponse?.roles?.map((el, index) => (
                <MyCard
                  template={1}
                  key={v4()}
                  styles="on_hover bg-white/5 w-full p-3"
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
                  <TextAI
                    text={index + 1 + "- " + el?.role_name}
                    style={" font-semibold "}
                  >
                    <div className="flex items-center mt-3 flex-wrap gap-2">
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
