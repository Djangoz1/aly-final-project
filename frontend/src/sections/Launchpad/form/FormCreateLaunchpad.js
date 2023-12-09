import { Icon } from "@iconify/react";

import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelect } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MySub } from "components/myComponents/text/MySub";
import { ENUMS } from "constants/enums";

import {
  doStateFormDisabled,
  useFormDispatch,
  useFormState,
} from "context/form";

import { icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";

let margin = "my-10";
export const FormCreateLaunchpad1 = () => {
  let dispatch = useFormDispatch();

  useEffect(() => {
    doStateFormDisabled(dispatch, true);
  }, []);

  return (
    <div className="  w-full">
      <div className={"flex w-full mb-10"}>
        <MySub style={"w-1/5 c4"}>Informations</MySub>
        <div className={"flex gap-5 "}>
          <MyInput target={"title"} />
          <MyInput target={"website"} />
        </div>
      </div>
      <div className={"flex  w-full " + margin}>
        <MySub style={"w-1/5 c4"}>Gallery</MySub>
        <MyInputsFile inputs={[{ target: "image" }, { target: "banniere" }]} />
      </div>
      <div className={"flex  w-full " + margin}>
        <MySub style={"w-1/5 c4"}>Domain</MySub>
        <MySelect
          label={false}
          arr={ENUMS.domain.map((el) => el.name)}
          target="domain"
        />
      </div>
      <div className={"flex w-full " + margin}>
        <MySub style={"w-1/5 c4"}>Social</MySub>
        <div className="flex gap-5">
          <MyInput
            target={"facebook"}
            label={
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyFB} /> Facebook
              </span>
            }
          />
          <MyInput
            target={"linkedin"}
            label={
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyLINKEDIN} /> Linkedin
              </span>
            }
          />
          <MyInput
            target={"github"}
            label={
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyGITHUB2} /> Github
              </span>
            }
          />
          <MyInput
            target={"twitter"}
            label={
              <span className="flex items-center">
                <Icon className="text-2xl mr-2" icon={icfyTWITTER} /> Twitter
              </span>
            }
          />
        </div>
      </div>
      <div className="flex w-full ">
        <MySub style={" min-w-[20%] c4"}>Description</MySub>
        <div className="flex flex-col w-full">
          <MyTextArea target={"bio"} styles={"min-h-[10vh]"} />
          <MyTextArea target={"description"} styles={"min-h-[30vh]"} />
        </div>
      </div>
    </div>
  );
};

export const FormCreateLaunchpad3 = () => {
  let { form } = useFormState();

  let dispatch = useFormDispatch();

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    // Obtenez la date d'aujourd'hui
    if (minDate === "") {
      const today = new Date();

      // Ajoutez un jour à la date d'aujourd'hui pour obtenir la date de demain
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Formatez la date de demain au format "YYYY-MM-DD"
      const formattedTomorrow = tomorrow.toISOString().split("T")[0];

      // Définissez la date minimale
      setMinDate(formattedTomorrow);
    }
  }, []);

  return (
    <div className="">
      <div className={"flex w-full " + margin}>
        <MySub style={"w-1/5 c4"}>Invest</MySub>
        <div className="flex gap-5 w-full">
          <MyInput
            label={"Min invest"}
            max={form?.maxInvest || undefined}
            type={"number"}
            target={"minInvest"}
          />
          <MyInput
            label={"Max invest"}
            target={"maxInvest"}
            type={"number"}
            min={form?.minInvest}
          />
        </div>
      </div>

      <div className={"flex w-full " + margin}>
        <MySub style={"w-1/5 c4"}>Timing</MySub>
        <div className="flex gap-5 w-full">
          <MyInput
            target={"saleStart"}
            label={"Date de début"}
            min={minDate}
            type={"date"}
          />
          <MyInput
            target={"saleEnd"}
            label={"Date de fin"}
            min={form.saleStart}
            type={"date"}
          />
        </div>
      </div>
      <div className={"flex w-full " + margin}>
        <MySub style={"w-1/5 c4"}>Capitalization</MySub>
        <div className="flex gap-5 w-full">
          <MyInput target={"minCap"} label={"Min cap"} type={"number"} />

          <MyInput
            target={"maxCap"}
            min={form?.minCap}
            label={"Max cap"}
            type={"number"}
          />
        </div>
      </div>
    </div>
  );
};
