import { useFormState } from "context/form";
import { useToolsState } from "context/tools";
import React from "react";
import { v4 } from "uuid";

export const FormTxs = () => {
  let { state, target } = useToolsState();
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
  ];
  return (
    <div className="flex flex-col">
      {/* <h6 className="font3">
                        </h6> */}
      <ul className="steps steps-vertical">
        {txs?.map(
          (el, i) =>
            (i <= state?.txs?.pointer + 1 || i === 0) && (
              <li
                key={v4()}
                data-content={i <= state?.txs?.pointer || i === 3 ? "✓" : "✋"}
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
      </ul>
    </div>
  );
};
