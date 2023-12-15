import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { useAuthState } from "context/auth";
import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import { useToolsState } from "context/tools";
import { icfy, icfyIMG } from "icones";
import React, { useState } from "react";
import { controllers } from "utils/controllers";
import { clientPocket } from "utils/ui-tools/pinata-tools";
// import { createImageCIDOnPinata } from "utils/ui-tools/pinata-tools";
import { v4 as uuidv4 } from "uuid";
export const MyInputsFile = ({ inputs, target, styles, setter }) => {
  let { form } = useFormState();
  let { state } = useToolsState();
  let dispatch = useFormDispatch();

  return (
    <div className={`flex w-fit ${setter ? "h-[118px] mb-8" : undefined}  `}>
      {inputs?.map((el, i) => (
        <MyInputFile
          target={el?.target}
          label={el?.label}
          style={el?.style}
          key={uuidv4()}
          className={`flex hover:text-white h-fit   ${
            styles || "mr-5"
          }    flex-col  ${setter ? " " : ""} relative  ${
            form?.[el?.target] && "text-white"
          }`}
        />
      ))}
    </div>
  );
};

export const MyInputFile = ({
  metadatas,
  target,
  label,
  template,
  style,
  setter,
}) => {
  let { form } = useFormState();
  let { refresh } = useToolsState();
  let dispatch = useFormDispatch();
  const [isLoading, setIsLoading] = useState(null);

  let handleChange = async (file) => {
    let _form = { ...form };

    let formData = new FormData();
    await formData.append(target, file);
    _form[target] = file;
    doInitStateForm(dispatch, _form);

    if ((metadatas || setter) && !isLoading) {
      setIsLoading(true);

      try {
        if (setter) {
          await setter(formData);
        } else {
          await clientPocket.records.update(
            metadatas?.["@collectionName"],
            metadatas.id,
            formData
          );
        }
        if (refresh) {
          refresh();
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du fichier : ", error);
      }

      // await setter(file, target);
      // Post sur pocketbase ici
      setIsLoading(false);
    }
  };
  return (
    <>
      {
        [
          <>
            <div className="backdrop-blur hover:bg-white/5 flex justify-center relative cursor-pointer  rounded-lg border border-dashed border-white/5 hover:border-white/30 px-6 py-10">
              <div className="text-center">
                <Icon
                  icon={icfyIMG}
                  className="mx-auto h-12 w-12 text-gray-300"
                />

                <div className="mt-4 c4 flex text-sm leading-6 text-gray-600">
                  <label
                    for="file-upload"
                    className="relative cursor-pointer rounded-md font-semibold c3 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>
                      {form?.[target]?.name ? (
                        <>📸 Image</>
                      ) : (
                        <>Upload a {target || label || "File"}</>
                      )}
                    </span>
                  </label>
                  <p className="pl-1">
                    {form?.[target]?.name ? (
                      <>{form?.[target]?.name}</>
                    ) : (
                      "or drag and drop"
                    )}
                  </p>
                </div>
                <p className="text-xs c4 font-light leading-5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  onChange={(e) => handleChange(e.target.files[0])}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="absolute cursor-pointer w-full h-full debug opacity-0 top-0 left-0"
                />
              </div>
            </div>

            {/* <Icon
              icon={icfy.ux.plus}
              className="border border-white rounded-full "
            />
            Add {target}
            <input type="file" className="opacity-0 absolute w-full h-full" /> */}
          </>,
          <div
            className={` ${
              metadatas || setter ? `h-[120px] ${style || "mr-5"}` : undefined
            } `}
          >
            <div
              className={`flex hover:text-white    ${
                metadatas || setter ? "" : style || "mr-5"
              }    flex-col  ${metadatas || setter ? " " : "h-fit"} relative  ${
                form?.[target] && "text-white"
              }`}
            >
              {!metadatas && !setter ? (
                <label className="text-light relative font-light text-xs mb-1 uppercase ">
                  {label || target}
                </label>
              ) : (
                <div
                  className={`absolute c1 flex   top-0 left-0 items-center overflow-hidden  justify-center  shadowh _hover bg-success  ${
                    metadatas || setter ? "" : "h-0 w-0"
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
                      metadatas={metadatas}
                      style={"w-fit"}
                      styleImg={"w-[100px] h-[100px]"}
                      CID={metadatas?.[target]}
                    />
                  )}
                </div>
              )}

              <input
                type="file"
                id={"fileInput" + target}
                onChange={(e) => handleChange(e.target.files[0])}
                className={`file-input ${
                  metadatas || setter
                    ? " cursor-pointer hover:h-[118px]  transition-all h-[110px]   opacity-0 hover:w-[224px] w-[220px] "
                    : "bg-zinc-900  py-1 h-fit font-light file-input-xs w-fit "
                }   relative `}
              ></input>
            </div>
          </div>,
        ]?.[template || 0]
      }
    </>
  );
};
