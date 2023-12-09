import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";
import { MyScrolledXDiv } from "components/myComponents/box/MyScrolledXDiv";
import { MyCard } from "components/myComponents/card/MyCard";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelect, MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MySub } from "components/myComponents/text/MySub";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { DEV_DOMAIN } from "constants/languages";
import { useAuthState } from "context/auth";
import { doInitStateForm, useFormDispatch, useFormState } from "context/form";
import { icfy } from "icones";
import React, { useEffect, useState } from "react";
import { stateLaunchpad, stateMission } from "utils/ui-tools/state-tools";
import { v4 } from "uuid";

let margin = "mb-4";
export const FormCreateMission1 = () => {
  return (
    <div>
      <div className="flex my-5 ">
        <MySub style={"w-[20%] c4"}>Informations</MySub>
        <div className="gap-3 flex">
          <MyInput target={"title"} />
          <MyInput label={"Company name"} target={"company"} />
        </div>
      </div>
      <div className="flex my-10 ">
        <MySub style={"w-[20%] c4"}>Domaine</MySub>
        <MySelect
          arr={DEV_DOMAIN.map((el) => el?.name)}
          target={"domain"}
          label={false}
        />
      </div>
      <div className="flex my-10  w-full">
        <MySub style={"w-[20%] c4"}>Description</MySub>
        <div className="flex flex-col">
          <MyInputsFile
            styles={"  mr-5"}
            inputs={[
              { label: "Image", target: "image" },
              { label: "Bannière", target: "banniere" },
            ]}
          />
          <MyTextArea styles={margin + "  min-h-[10vh] "} target={"abstract"} />
          <MyTextArea
            styles={margin + " h-full w-full min-h-[30vh] "}
            target={"description"}
          />
        </div>
      </div>
    </div>
  );
};

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
    <div className="flex flex-col">
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
        <></>
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
        <></>
      )}
      <div className="flex my-5 ">
        <MySub style={"w-[20%] c4"}>Budget</MySub>
        <MyInput label={false} type={"number"} target={"budget"} />
      </div>
      <div className="flex my-5 ">
        <MySub style={"w-[20%] c4"}>Tasks</MySub>
        <MyInput label={false} type={"number"} target={"features"} />
      </div>
    </div>
  );
};
