"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { useAuthState } from "context/auth";
import { MyFormCreate } from "components/myComponents/form/MyForm";
import { MySelect } from "components/myComponents/form/MySelects";
import { ENUMS } from "constants/enums";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { FormSocial, labelFormSocial } from "components/myComponents/form";
import { MyTextArea } from "components/myComponents/form/MyTextArea";

const PageCreateLaunchpad = () => {
  let { cv, metadatas } = useAuthState();

  return (
    <MyLayoutApp
      url={"/create/launchpad"}
      target={"launchpad"}
      initState={{ allowed: true }}
    >
      <MyFormCreate
        template={1}
        stateInit={{
          allowed: cv > 0,
        }}
        components={[
          {
            component: (
              <>
                <MySelect
                  style={"w-[30vw] flex-wrap justify-center "}
                  label={false}
                  arr={ENUMS.domain.map((el) => el.name)}
                  target="domain"
                />
                <MyInput
                  label={false}
                  _placeholder={"Add domain"}
                  target={"add"}
                  setter={(el, form, dispatch) => {
                    dispatch({ ...form, domain: [...form?.domain, el] });
                  }}
                  color={1}
                  styles={"bottom-0 absolute w-1/2 left-1/2 -translate-x-1/2"}
                />
              </>
            ),
            label: "Your launchpad concern wich domain ?",
          },
          {
            component: (
              <MyInputsFile
                inputs={[{ target: "image" }, { target: "banniere" }]}
              />
            ),
            label: "Please add images to feed your wall",
          },
          {
            component: (
              <div className={"flex gap-5 w-full flex-col"}>
                <MyInput styles={"w-full"} target={"title"} />
                <MyInput styles={"w-full"} target={"company"} />
                <MyInput styles={"w-full"} target={"website"} />
              </div>
            ),
            label: "Please provide informations about your launchpad",
          },
          {
            component: <FormSocial />,
            label: labelFormSocial,
          },
          {
            component: (
              <MyTextArea
                label={false}
                target={"bio"}
                styles={"min-h-[10vh] w-2/3 mx-auto"}
              />
            ),
            label: "Please provide a short description about your launchpad",
          },

          {
            component: (
              <MyTextArea
                label={false}
                target={"description"}
                styles={"min-h-[30vh] w-full mx-auto"}
              />
            ),
            label: "Please provide description of your project",
          },
          {
            component: (
              <div className="flex gap-5 w-full">
                <MyInput
                  label={"Min invest"}
                  type={"number"}
                  styles={"w-full"}
                  target={"minInvest"}
                />
                <MyInput
                  styles={"w-full"}
                  label={"Max invest"}
                  target={"maxInvest"}
                  type={"number"}
                />
              </div>
            ),
            label: "Please provides a fork's invest for one user (address)",
          },
          {
            component: (
              <div className="flex gap-5 w-full">
                <MyInput
                  styles={"w-full"}
                  target={"saleStart"}
                  label={"Date de début"}
                  type={"date"}
                />
                <MyInput
                  styles={"w-full"}
                  target={"saleEnd"}
                  label={"Date de fin"}
                  type={"date"}
                />
              </div>
            ),
            label: "Please provide a window invest for your launchpad",
          },
          {
            component: (
              <div className="flex gap-5 w-full">
                <MyInput
                  styles={"w-full"}
                  target={"minCap"}
                  label={"Min cap"}
                  type={"number"}
                />

                <MyInput
                  styles={"w-full"}
                  target={"maxCap"}
                  label={"Max cap"}
                  type={"number"}
                />
              </div>
            ),
            label: "Please provide a capitalization's fork for your launchpad",
          },
        ]}
      />
    </MyLayoutApp>
  );
};

export default PageCreateLaunchpad;
