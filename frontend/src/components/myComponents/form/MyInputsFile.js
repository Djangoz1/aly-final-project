import { ImagePin } from "components/Image/ImagePin";
import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import { useToolsState } from "context/tools";
import React, { useState } from "react";
import { createImageCIDOnPinata } from "utils/ui-tools/pinata-tools";
import { v4 as uuidv4 } from "uuid";
export const MyInputsFile = ({ inputs, target, styles, setter }) => {
  let { form } = useFormState();
  let { state } = useToolsState();
  let dispatch = useFormDispatch();
  const [isLoading, setIsLoading] = useState(null);

  let handleChange = async (target, file, index) => {
    let _form = form;

    _form[target] = file;
    doInitStateForm(dispatch, _form);
    if (setter) {
      setIsLoading(index);
      console.log("loading", index);
      const _pinMetadatas = {
        name: "Work3 - " + target + "IMG",
      };
      let uri = await createImageCIDOnPinata(file, _pinMetadatas);
      await setter(uri, target);
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex w-fit ${setter ? "h-[118px] mb-8" : undefined}  `}>
      {inputs?.map((el, i) => (
        <div
          key={uuidv4()}
          className={`flex hover:text-white h-fit   ${
            styles || "mr-5"
          }    flex-col  ${setter ? " " : ""} relative  ${
            form?.[el?.target] && "text-white"
          }`}
        >
          {!setter ? (
            <label className="text-light relative font-light text-xs mb-1 uppercase ">
              {el?.label || el?.target}
            </label>
          ) : undefined}
          {setter && target && (
            <div
              className={`absolute c1 flex  top-0 left-0 items-center overflow-hidden  justify-center  shadowh _hover bg-success  ${
                setter ? "" : "h-0 w-0"
              }   h-full bg3  w-full justify-center `}
            >
              <label className="text-light w-20 mr-5 ml-1 relative font-semibold text-xs mb-1 uppercase ">
                {el?.label || el?.target}
              </label>
              {form?.[el?.target] &&
              (state?.[target]?.metadatas?.[el?.target] !==
                form?.[el?.target] ||
                state?.[target]?.metadatas?.attributes?.[0]?.[el?.target] !=
                  form?.[el?.target]) ? (
                <span
                  className=" loading loading-bars loading-xl c1
            "
                ></span>
              ) : (
                <ImagePin
                  style={"w-fit"}
                  styleImg={"w-[100px] h-[100px]"}
                  CID={form?.[el?.target]}
                />
              )}
            </div>
          )}

          <input
            type="file"
            onChange={(e) => handleChange(el?.target, e.target.files[0], i)}
            className={`file-input ${
              setter
                ? " cursor-pointer hover:h-[118px]  transition-all h-[110px]   opacity-0 hover:w-[224px] w-[220px] "
                : "bg-zinc-900  py-1 h-fit font-light file-input-xs w-fit "
            }   relative `}
          ></input>
        </div>
      ))}
    </div>
  );
};

export const MyInputFile = ({ setter, target, label, style }) => {
  let { form } = useFormState();

  let dispatch = useFormDispatch();
  const [isLoading, setIsLoading] = useState(null);
  let handleChange = async (file) => {
    let _form = form;

    _form[target] = file;
    doInitStateForm(dispatch, _form);
    if (setter && !isLoading) {
      setIsLoading(true);
      const _pinMetadatas = {
        name: "Work3 - " + target + "IMG",
      };
      let uri = await createImageCIDOnPinata(file, _pinMetadatas);
      await setter(uri, target);
      setIsLoading(false);
    }
  };
  return (
    <div className={` ${setter ? `h-[120px] ${style || "mr-5"}` : undefined} `}>
      <div
        className={`flex hover:text-white    ${
          setter ? undefined : style || "mr-5"
        }    flex-col  ${setter ? " " : "h-fit"} relative  ${
          form?.[target] && "text-white"
        }`}
      >
        {!setter ? (
          <label className="text-light relative font-light text-xs mb-1 uppercase ">
            {label || target}
          </label>
        ) : undefined}
        {setter && (
          <div
            className={`absolute c1 flex   top-0 left-0 items-center overflow-hidden  justify-center  shadowh _hover bg-success  ${
              setter ? "" : "h-0 w-0"
            }   h-full bg3  w-full justify-center `}
          >
            <label className="text-light w-20 mr-5 ml-1 relative font-semibold text-xs mb-1 uppercase ">
              {label || target}
            </label>
            {form?.[target] && isLoading ? (
              <span
                className=" loading loading-bars loading-xl c1
            "
              ></span>
            ) : (
              <ImagePin
                style={"w-fit"}
                styleImg={"w-[100px] h-[100px]"}
                CID={form?.[target]}
              />
            )}
          </div>
        )}

        <input
          type="file"
          onChange={(e) => handleChange(e.target.files[0])}
          className={`file-input ${
            setter
              ? " cursor-pointer hover:h-[118px]  transition-all h-[110px]   opacity-0 hover:w-[224px] w-[220px] "
              : "bg-zinc-900  py-1 h-fit font-light file-input-xs w-fit "
          }   relative `}
        ></input>
      </div>
    </div>
  );
};
