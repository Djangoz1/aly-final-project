import { MyModal } from "components/myComponents/modal/MyModal";
import React, { useEffect, useState } from "react";
import { MyFormInfo } from "./MyFormInfo";
import { v4 as uuidv4 } from "uuid";
import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  doStateFormModal,
  doStateFormPointer,
  useFormDispatch,
  useFormState,
} from "context/form";
import { LayoutForm } from "sections/Form/LayoutForm";
import { styles as _styles } from "styles/style";

import { useAccount } from "wagmi";
import { Icon } from "@iconify/react";
import { icfy } from "icones";

export const MyFormModal = ({
  stateInit,
  components,
  side,
  arr,
  submit,
  btn,
  styles,
  editer,
}) => {
  return (
    <LayoutForm stateInit={stateInit}>
      <MyModal
        btn={btn}
        form={true}
        styles={{
          btn: ` w-fit h-fit ${_styles.gbtn}  ${
            styles?.btn || " w-fit gb2 cursor-pointer btn-xs"
          }`,
          modal: `overflow-y-auto ${
            styles?.modal || "w-[80vw]  min-h-[80vh] max-h-[90vh]"
          }`,
        }}
        modal={
          <Child
            stateInit={stateInit}
            editer={editer}
            components={components}
            side={side}
            submit={submit}
            arr={arr}
          />
        }
      />
    </LayoutForm>
  );
};

let Child = ({ components, side, arr, submit, editer }) => {
  let dispatch = useFormDispatch();

  let [isLoading, setIsLoading] = useState(null);
  let { form, pointer, disabled, checked, superChecked } = useFormState();
  let { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) doStateFormDisabled(dispatch, true);
    if (pointer === 0 && isConnected) doStateFormDisabled(dispatch, false);

    doStateFormChecked({ dispatch, pointer, form, checked, superChecked });
  }, [isConnected, pointer]);

  let handleSubmit = async () => {
    if (isConnected) {
      setIsLoading(true);
      await submit(form);
      setIsLoading(false);
      doStateFormModal(dispatch, false);
    }
  };

  return (
    <div className="flex min-h-fit h-fit overflow-y-scroll hide-scrollbar ">
      {side && (
        <div className=" mr-8 border-y-0 border-l-0 border-r-1  h-full min-h-[75vh] flex-flex-col p-0 w-1/5 ">
          {side}
        </div>
      )}

      <div
        className={`w-full relative flex flex-col  h-full ${
          side ? "min-h-[75vh]" : null
        }`}
      >
        {(arr?.[pointer]?.description || !isConnected) && (
          <MyFormInfo
            title={
              <h6 className="text-2xl">
                {isConnected ? (
                  arr?.[pointer]?.title
                ) : (
                  <span className="flex items-center">
                    <Icon
                      icon={icfy.ux.warning}
                      className="text-warning mr-2"
                    />{" "}
                    Oops ... You're not connected
                  </span>
                )}
              </h6>
            }
            description={
              isConnected
                ? arr?.[pointer]?.description
                : "Please connected on your account with your wallet provider ?"
            }
          />
        )}
        {isConnected && components[pointer]}
        <div className="h-full mb-5"></div>
        <div className="mt-auto ml-auto">
          {!isLoading && !editer && pointer > 0 && (
            <button
              onClick={() => doStateFormPointer(dispatch, pointer - 1)}
              className="btn btn-xs btn-outline btn-error mr-3"
            >
              Précédent
            </button>
          )}

          {!editer && isConnected && pointer != arr?.length - 1 && (
            <button
              onClick={() => doStateFormPointer(dispatch, pointer + 1)}
              className="btn btn-xs btn-outline btn-success "
              disabled={disabled}
            >
              Suivant
            </button>
          )}
          {isConnected && (editer || pointer === arr?.length - 1) && (
            <button
              onClick={handleSubmit}
              disabled={disabled}
              className="btn btn-xs btn-outline h-fit  btn-info "
            >
              {editer || "Submit"}
              {isLoading && (
                <span className="loading loading-bars loading-md"></span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
