import React, { useEffect, useState } from "react";
import { MyCard } from "../card/MyCard";
import { MyTitle } from "../text/MyTitle";
import { Icon } from "@iconify/react";
import { icfy, icsystem } from "icones";
import { MySub } from "../text/MySub";
import { MyTextArea } from "./MyTextArea";
import { clientPocket } from "utils/ui-tools/pinata-tools";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MySelect } from "./MySelects";
import { useToolsState } from "context/tools";
import { v4 } from "uuid";
import { MyModal } from "../modal/MyModal";
import { MyMainBtn } from "../btn/MyMainBtn";
import { useAuthState } from "context/auth";
import { ENUMS } from "constants/enums";

export const MyToDo = ({ workflow }) => {
  if (workflow > 2) {
    throw new Error("Workflow must be <=2");
  }
  let { cv } = useAuthState();
  let [isForm, setIsForm] = useState(null);
  let [isClick, setIsClick] = useState([]);

  let { state } = useToolsState();

  let openToDos = (bool) => {
    let click = [];
    for (let index = 0; index < state?.agendas?.toDo?.length; index++) {
      let element = state?.agendas?.toDo[index];
      if (bool(element)) {
        click.push(index);
      }
    }
    setIsClick(click);
  };
  let { colors } = ENUMS;
  useEffect(() => {
    if (workflow == 2) return;
    openToDos(
      (element) =>
        state?.features?.[element?.index]?.datas?.cvWorker == cv &&
        element?.list?.length
    );
  }, [cv, state?.agendas?.toDo]);
  return (
    <MyCard
      template={3}
      styles={
        "px-3 c4 hover:text-white h-fit pt-4 min-w-[300px] max-w-[300px] pb-5"
      }
    >
      <div className="flex justify-between items-center">
        <MyTitle>{["To do ⚙️", "Progress 👨‍💻", "Done 🎉"]?.[workflow]}</MyTitle>
        <button
          onClick={() =>
            openToDos((element) =>
              isClick?.length > 0 ? false : element.list.length > 0
            )
          }
          className="btn btn-ghost btn-xs "
        >
          <Icon icon={icfy.eye[isClick?.length ? "close" : "open"]} />
        </button>
      </div>

      <div className="flex g w-2/4 gap-3">
        {state?.agendas?.toDo?.map((el) =>
          el?.list?.filter(
            (todo) =>
              todo.workflow === ["to do", "progress", "done"]?.[workflow]
          )?.length > 0 ? (
            <div
              className={`w-full ${
                colors[el?.index]
              } pt-1 mt-2 mb-4 rounded-lg`}
              key={v4()}
            ></div>
          ) : undefined
        )}
      </div>
      <div className="flex flex-col  gap-2">
        {state?.agendas?.toDo.map(
          (el, i) =>
            el?.list?.filter(
              (todo) =>
                todo.workflow === ["to do", "progress", "done"]?.[workflow]
            )?.length > 0 && (
              <div
                key={v4()}
                className={`flex hover:bg-white/5 flex-col w-full px-2 py-3 border border-white/5 rounded-t-lg ${
                  isClick?.includes(i) ||
                  cv == state?.features?.[el?.index]?.datas?.cvWorker
                    ? "bg-white/5 text-white"
                    : "c4"
                }`}
              >
                <div
                  onClick={() =>
                    setIsClick(
                      isClick?.includes(i)
                        ? isClick.filter((el) => el !== i)
                        : [...isClick, i]
                    )
                  }
                  className={`flex border border-b-white/5 border-white/0 pb-2 cursor-pointer hover:text-white items-center w-full justify-between uppercase font-light  text-xs`}
                >
                  {state?.features?.[el?.index]?.metadatas?.title}

                  <Icon
                    icon={icfy.ux.arrow}
                    className={isClick?.includes(i) ? "rotate-180" : ""}
                  />
                </div>
                {isClick.includes(i) ? (
                  el?.list?.map(
                    (todo, i1) =>
                      todo.workflow ===
                        ["to do", "progress", "done"]?.[workflow] && (
                        <div
                          key={v4()}
                          className="flex relative  border border-white/0  bg-gradient-to-bl from-white/5 to-white/0 rounded-lg on_hover px-2 py-1  text-white/70 mb-2 items-center hover:bg-white/5"
                        >
                          <div
                            className={`py-4 pl-1 mr-5 ${colors?.[el?.index]}`}
                          />
                          <p className="pr-10 text-xs ">{todo?.description}</p>
                          <MyModal
                            id={
                              todo.workflow +
                              workflow +
                              `${i}` +
                              `${i1}` +
                              `${el?.index}`
                            }
                            btnStyle={
                              " on_hover_view text-xs  absolute right-2 top-2 "
                            }
                            style={
                              "flex min-w-full left-0 pl-3 bg-white/20 hover:bg-white/60 c1 gap-5 py-5 backdrop-blur-2xl border border-white/5 rounded flex-col absolute right-0 translate-x-full -translate-y-full"
                            }
                            btn={<Icon icon={icfy.ux.edit} className=" " />}
                          >
                            <MyMainBtn
                              icon={icfy.ux.refresh}
                              template={1}
                              color={2}
                              style={"btn-xs mr-10 flex whitespace-nowrap"}
                            >
                              Update with status
                            </MyMainBtn>
                            <MyMainBtn
                              icon={icfy.ux.edit}
                              template={1}
                              style={"btn-xs my-4 mr-10"}
                            >
                              Update
                            </MyMainBtn>
                            {workflow !== 2 ? (
                              <MyMainBtn
                                color={1}
                                style={"btn-xs mr-10"}
                                template={1}
                                setter={async () => {
                                  await clientPocket.records.update(
                                    "toDo",
                                    todo.id,
                                    {
                                      workflow: ["progress", "done"]?.[
                                        workflow
                                      ],
                                    }
                                  );
                                }}
                              >
                                Déplacer
                              </MyMainBtn>
                            ) : (
                              <></>
                            )}
                            <MyMainBtn
                              color={3}
                              style={"btn-xs my-4 mr-10 "}
                              template={1}
                              setter={async () => {
                                await clientPocket.records.delete(
                                  "toDo",
                                  todo.id
                                );
                              }}
                            >
                              Delete
                            </MyMainBtn>
                          </MyModal>
                        </div>
                      )
                  )
                ) : (
                  <></>
                )}
              </div>
            )
        )}
        {isForm ? (
          <LayoutForm
            stateInit={{
              allowed: true,
              placeholders: {
                description: "Write what to do",
                feature: "For which feature ?",
              },
              form: { target: "todo", description: null, feature: null },
            }}
          >
            <MySelect
              label={false}
              target={"feature"}
              arr={state?.features?.map((el) => el?.metadatas?.title)}
            />
            <div className="flex gap-4">
              <MyTextArea label={false} target={"description"} />
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsForm(false)}
              >
                <Icon icon={icfy.ux.check.uncheck} />
              </button>
            </div>
            <MyMainBtn
              template={1}
              form={true}
              setter={async (form) => {
                let datas = {
                  featureID:
                    state?.features?.[parseInt(form?.feature)]?.metadatas?.id,
                  description: form?.description,
                  workflow: ["to do", "progress", "done"]?.[workflow],
                };
                console.log("ddazdazd------------", form);
                console.log("ddazdazd------------", datas);

                await clientPocket.records.create("toDo", datas);
              }}
            >
              Create ticket
            </MyMainBtn>
          </LayoutForm>
        ) : (
          <div className="flex items-center w-full gap-3">
            <button
              onClick={() => setIsForm(true)}
              className="text-xs uppercase font-light flex px-3 justify-start btn-sm py-1 btn btn-ghost flex-auto"
            >
              <Icon icon={icfy.ux.plus} />
              Add a ticket
            </button>
            <button>
              <Icon icon={icsystem.ai} />
            </button>
          </div>
        )}
      </div>
    </MyCard>
  );
};
