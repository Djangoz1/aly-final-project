import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyCard } from "components/myComponents/card/MyCard";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { NoItems } from "components/myComponents/layout/NoItems";
import { MySub } from "components/myComponents/text/MySub";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { DEV_DOMAIN } from "constants/languages";
import { useAuthState } from "context/auth";
import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import { icfy, icsystem } from "icones";
import React, { useEffect, useState } from "react";
import { stateLaunchpad, stateMission } from "utils/ui-tools/state-tools";
import { v4 } from "uuid";

let margin = "mb-4";

export const FormCreateMission2 = () => {
  let { datas } = useAuthState();
  let { form } = useFormState();
  let dispatch = useFormDispatch();
  let [isDatas, setIsDatas] = useState(null);
  useEffect(() => {
    (async () => {
      let launchpads = [];
      if (datas?.launchpads) {
        for (let index = 0; index < datas.launchpads; index++) {
          launchpads.push(await stateLaunchpad(datas?.launchpads[index]));
        }
      }
      let missions = [];
      if (datas?.missions) {
        for (let index = 0; index < datas.missions?.length; index++) {
          missions.push(await stateMission(datas?.missions[index]));
        }
      }
      setIsDatas({ launchpads, missions });
    })();
  }, [datas]);

  return (
    <div className="flex w-full items-center gap-4">
      {isDatas?.missions?.length ? (
        <div className="flex  my-5 ">
          <MySub style={"w-[20%] c4"}>Missions</MySub>

          <MyScrolledXDiv>
            <div className="flex gap-5">
              {isDatas?.missions?.map((el, i) => (
                <div
                  key={v4()}
                  onClick={() =>
                    doInitStateForm(dispatch, {
                      ...form,
                      reference: form?.reference === i ? null : i,
                    })
                  }
                  className={` rounded-lg w-fit shadow-xl _hover overflow-hidden relative ${
                    form?.reference === i
                      ? "opacity-100 border border-info"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <MyTitle style={"absolute left-4 pr-30  bottom-5 "}>
                    {el?.metadatas?.title}
                  </MyTitle>
                  <ImagePin
                    metadatas={el?.metadatas}
                    CID={el?.metadatas?.image}
                    styleImg={" min-w-[200px]  h-[100px]  "}
                  />
                </div>
              ))}
            </div>
          </MyScrolledXDiv>
        </div>
      ) : (
        <NoItems icon={icsystem.mission} template={1} target={"missions"} />
      )}

      {isDatas?.launchpads?.length ? (
        <div className="flex my-5 gap-3">
          <MySub style={"w-[20%] c4"}>Launchpad</MySub>
          <MyScrolledXDiv>
            {isDatas?.launchpads?.map((el, i) => (
              <div
                key={v4()}
                onClick={() =>
                  doInitStateForm(dispatch, {
                    ...form,
                    launchpad: form?.launchpad === i ? null : i,
                  })
                }
                className={` rounded-lg shadow-xl _hover overflow-hidden relative ${
                  form?.launchpad === i
                    ? "opacity-100 border border-info"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <MyTitle style={"absolute left-4 pr-30  bottom-5 "}>
                  {el?.metadatas?.title}
                </MyTitle>
                <ImagePin
                  metadatas={el?.metadatas}
                  CID={el?.metadatas?.image}
                  styleImg={" min-w-[200px]  h-[100px]  "}
                />
              </div>
            ))}
          </MyScrolledXDiv>
        </div>
      ) : (
        <NoItems icon={icsystem.launchpad} template={1} target={"launchpads"} />
      )}
    </div>
  );
};
