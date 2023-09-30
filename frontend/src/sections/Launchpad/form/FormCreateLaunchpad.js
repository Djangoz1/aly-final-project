import { Icon } from "@iconify/react";
import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyFormInfo } from "components/myComponents/form/MyFormInfo";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { MySelects } from "components/myComponents/form/MySelects";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { ENUMS } from "constants/enums";
import { DEV_DOMAIN } from "constants/languages";
import {
  doInitStateForm,
  doStateFormChecked,
  doStateFormDisabled,
  useFormDispatch,
  useFormState,
} from "context/form";
import { ethers } from "ethers";
import { icfyFB, icfyGITHUB2, icfyLINKEDIN, icfyTWITTER } from "icones";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";

let margin = "mb-4";
export const FormCreateLaunchpad1 = () => {
  let dispatch = useFormDispatch();

  useEffect(() => {
    doStateFormDisabled(dispatch, true);
  }, []);

  return (
    <div className="w-full">
      <div className={"flex " + margin}>
        <MyInput target={"title"} />
        <MyInput target={"website"} />
      </div>

      <MyInputsFile
        styles={margin}
        inputs={[{ target: "image" }, { target: "banniere" }]}
      />

      <MySelects
        styles={margin}
        selects={[
          {
            label: "Project domain",
            target: "domain",
            target1: "name",
            arr: DEV_DOMAIN,
          },
        ]}
      />

      <div className={"flex " + margin}>
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

      <MyTextArea target={"description"} styles={"min-h-[30vh]"} />
    </div>
  );
};

export const FormCreateLaunchpad2 = () => {
  let { form, pointer, checked, disabled, superChecked } = useFormState();
  let dispatch = useFormDispatch();

  useEffect(() => {
    if (pointer === 2) {
      let _form = form;
      _form.isAddress = ethers.utils.isAddress(form?.tokenAddress);
      doInitStateForm(dispatch, _form);
      doStateFormChecked({
        dispatch,
        pointer,
        form,
        checked,
        superChecked,
      });
    }
  }, [pointer, form?.tokenAddress]);

  return (
    <>
      <div className={"flex " + margin}>
        <MyInput label={"Token address"} target={"tokenAddress"} />
        <MyInput
          label={"Token allowance"}
          type={"number"}
          target={"tokenAllowance"}
        />
      </div>
      <div className="flex">
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
    </>
  );
};

export const FormCreateLaunchpad3 = () => {
  let { form } = useFormState();

  let [isRounds, setIsRounds] = useState(0);
  let dispatch = useFormDispatch();

  useEffect(() => {
    let _form = form;
    if (_form?.minTiersCap?.length + 1 === _form?.rounds) {
      _form.maxTiersCap.push("0");
      _form.minTiersCap.push("0");
      _form.tokenPrice.push("0");
    } else if (_form?.minTiersCap?.length === _form?.rounds) {
    } else {
      _form.minTiersCap = [];
      _form.maxTiersCap = [];
      _form.tokenPrice = [];

      for (let index = 0; index < form?.rounds; index++) {
        _form.maxTiersCap.push("0");
        _form.minTiersCap.push("0");
        _form.tokenPrice.push("0");
      }
    }

    setIsRounds(form?.rounds);
    doInitStateForm(dispatch, _form);
  }, [form?.rounds]);

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
      <div className={"flex " + margin}>
        <MyInput
          label={"Nombre de round(s)"}
          target={"rounds"}
          type={"number"}
          min={"1"}
          max={"5"}
        />
        <MyInput
          label={"Locked time"}
          min={"1"}
          target={"lockedTime"}
          type={"number"}
        />
      </div>

      <div className={"flex " + margin}>
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

      {form?.maxTiersCap.map((el, i) => (
        <div className={"flex " + margin} key={v4()}>
          <MyInput
            target={"minTiersCap"}
            index={i}
            label={"Min cap round " + (i + 1)}
            type={"number"}
          />

          <MyInput
            target={"maxTiersCap"}
            index={i}
            min={form?.minTiersCap?.[i]}
            label={"Max cap round " + (i + 1)}
            type={"number"}
          />
          <MyInput
            target={"tokenPrice"}
            index={i}
            step={"0.01"}
            label={"Token price round " + (i + 1)}
            type={"number"}
          />
        </div>
      ))}
    </div>
  );
};
