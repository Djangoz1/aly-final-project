import React, { useEffect, useState } from "react";
import { MyModal } from "../MyModal";
import { Icon } from "@iconify/react";
import { icfyCV } from "icones";
import { MyCheckboxes } from "components/myComponents/myForm/MyCheckboxes";
import { ListDevDomains } from "components/inputs/inputsMission/Description/list";
import { DEV_DOMAIN } from "constants/languages";
import { ENUMS_COURTS } from "constants/enums";
import { MyInputs } from "components/myComponents/myForm/MyInputs";
import { MySelects } from "components/myComponents/myForm/MySelects";
import { MyFormInfo } from "components/myComponents/myForm/MyFormInfo";
import { useAuthState } from "context/auth";
import { CVName } from "components/inputs/inputsCV/CVName";
import { v4 as uuidv4 } from "uuid";
import { _form_create_feature } from "utils/ux-tools/form/feature";
import { MENUS_CREATE_FEATURE } from "constants/menus";

export const CreateFeature = () => {
  let { metadatas } = useAuthState();
  let form = _form_create_feature({ metadatas });

  let [isTarget, setIsTarget] = useState(0);
  console.log("bggeggeeg", isTarget);
  let [isElement, setIsElement] = useState(form?.[0]);

  let handleClick = (target) => {
    if (isTarget >= 0 && isTarget < form?.length) {
      setIsTarget(target);
      setIsElement(form?.[target]);
    }
  };

  return (
    <MyModal
      btn={"Create feature"}
      styles={{
        btn: "ml-5 btn btn-xs btn-primary btn-outline",
        modal: "w-[80vw] h-[80vh]",
      }}
      modal={
        <div className="flex h-full ">
          <ul className="steps steps-vertical border border-r-2 border-l-0 border-y-0  border-white/10  min-w-fit mr-8 max-h-[75vh]">
            {MENUS_CREATE_FEATURE.map((el, index) => (
              <li
                key={uuidv4()}
                data-content={el?.i}
                className={`step px-5 border border-y-1  border-x-0 ${
                  index === isTarget ? "border-white/70" : "border-white/10"
                } ${
                  index <= isTarget
                    ? " text-white step-primary bg-black/70"
                    : "text-white/40 bg-black/50"
                }`}
              >
                {el?.title}
              </li>
            ))}
          </ul>
          <div className="w-full relative h-auto ">
            <MyFormInfo
              title={<h6 className="text-2xl">{isElement?.title}</h6>}
              description={isElement?.description}
            />

            <div className="flex  h-auto flex-col justify-between mt-5">
              <div className="flex flex-col  h-full ">
                {isElement?.components?.map((el) => (
                  <div key={uuidv4()} className="">
                    {el}
                  </div>
                ))}
              </div>

              <div className="absolute bottom-0 right-0 ">
                {isTarget > 0 && (
                  <div
                    onClick={() => handleClick(isTarget - 1)}
                    className="  mr-5 btn btn-error btn-xs"
                  >
                    Précédent
                  </div>
                )}
                {isTarget < form.length - 1 && (
                  <div
                    onClick={() => handleClick(isTarget + 1)}
                    className="  btn btn-success btn-xs"
                  >
                    Suivant
                  </div>
                )}
                {isTarget === form.length - 1 && (
                  <div className="  btn btn-info btn-xs">Créer</div>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};
