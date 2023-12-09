import { ChatBubble } from "components/ChatBubble";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { useFormState } from "context/form";
import { useToolsState } from "context/tools";
import React, { useState } from "react";
import { v4 } from "uuid";
import { clientPocket } from "../../utils/ui-tools/pinata-tools";
import { useAuthState } from "context/auth";
import Link from "next/link";

export const FormTxs = () => {
  let { metadatas } = useAuthState();
  let { state, target } = useToolsState();
  let { form } = useFormState();
  let [isView, setIsView] = useState(0);
  let [isDone, setIsDone] = useState(null);
  console.log("state fdfsdf", state);
  let txs = [
    <h6 className="font3">Confirmer la création de {target} ...</h6>,
    <>
      <h6 className="font3">Datas post to database</h6>
      {state?.txs?.pointer >= 1 && (
        <>
          <span className="text-xs opacity-70 flex flex-col">
            Transaction confirmée !{" "}
          </span>
          <time className="text-[8px]">{state?.txs?.db?.created}</time>
          <p className="text-[8px]">ID #{state?.txs?.db?.id}</p>
        </>
      )}
    </>,
    <>
      <h6 className="font3">Datas post to blockchain</h6>
      {state?.txs?.pointer >= 2 && (
        <>
          <span className="text-xs opacity-70 flex flex-col">
            Transaction confirmée !{" "}
          </span>
          <time className="text-[8px]">{state?.txs?.db?.created}</time>
        </>
      )}
      <p className="text-[8px]">createMission({state?.txs?.db?.id})</p>
    </>,
    <>
      <h6 className="font3">Transaction confirm to blockchain</h6>
      <span className="text-xs opacity-70 flex flex-col">
        Transaction confirmée !{" "}
      </span>
      <p className="text-[8px]">Hash #{state?.txs?.bc}</p>
    </>,
    <>
      <h6 className="font3"> {form?.target} are ready !</h6>
      <Link href={state?.txs?.result} className="text-xs text-info ">
        Click to view !
      </Link>
    </>,
  ];
  return (
    <div className="flex flex-col">
      <MyMenusTabs
        color={12}
        styleOrigin={"mb-4"}
        template={2}
        setter={setIsView}
        value={isView}
        target={"value"}
        arr={[
          { value: "Transactions", url: "#" },
          form?.aiAssisted ? { value: "Feedbacks", url: "#" } : undefined,
        ]}
      ></MyMenusTabs>
      {/* <h6 className="font3">
                        </h6> */}
      {
        [
          <ul className="steps steps-vertical">
            {txs?.map(
              (el, i) =>
                (i <= state?.txs?.pointer + 1 || i === 0) && (
                  <li
                    key={v4()}
                    data-content={
                      i <= state?.txs?.pointer || i === 3 ? "✓" : "✋"
                    }
                    className={`step ${
                      i <= state?.txs?.pointer || i === 3
                        ? "step-success"
                        : "step-error"
                    }`}
                  >
                    <div className="flex flex-col items-start my-10">{el}</div>
                  </li>
                )
            )}
          </ul>,
          <div className="flex flex-col">
            <ChatBubble
              ai={true}
              text={
                "Please post a feedback for help me to improve my knowledge."
              }
              style={"mb-5"}
            />
            {!isDone ? (
              <>
                <MyCheckboxes
                  label={"Rating"}
                  target={"ratingAi"}
                  template={1}
                  checkboxes={[1, 2, 3, 4, 5]}
                />

                <MyTextArea
                  styles={"min-h-[20vh] mt-4"}
                  target={"feedbacks"}
                  label={{ no: true }}
                />
                <MyMainBtn
                  style={"mt-10 btn-xs py-2 ml-auto"}
                  setter={async () => {
                    console.log(form);
                    let datas = {
                      feedback: form?.feedbacks,
                      rating: form?.ratingAi + 1,
                      aiID: form?.ai?.recommandations?.id,
                    };
                    console.log(datas);
                    let record = await clientPocket.records.create(
                      "feedbacks",
                      datas
                    );
                    console.log(record);

                    if (record?.id) {
                      setIsDone(true);
                    }
                  }}
                  template={1}
                >
                  Post feedback
                </MyMainBtn>
              </>
            ) : (
              <ChatBubble
                ai={true}
                text={
                  "Thank you " + metadatas?.username + " for your feedback ! 🙏"
                }
              />
            )}
          </div>,
        ][isView]
      }
    </div>
  );
};
