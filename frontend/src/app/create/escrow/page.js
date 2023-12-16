"use client";
import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { MyFormCreate } from "components/myComponents/form/MyForm";
import { useAuthState } from "context/auth";

import { useToolsState } from "context/tools";
import { MySelect } from "components/myComponents/form/MySelects";
import { FeatureName } from "components/links/FeatureName";
import { MyInput } from "components/myComponents/form/MyInput";
import { MyInputFile } from "components/myComponents/form/MyInputsFile";
import { MyTextArea } from "components/myComponents/form/MyTextArea";

const PageCreateEscrow = () => {
  let { metadatas, datas, cv } = useAuthState();
  let { state } = useToolsState();

  return (
    <MyLayoutApp
      initState={{ form: state?.form, allowed: true }}
      target={"escrow"}
      url={"/create/escrow"}
    >
      <MyFormCreate
        title={"Create Escrow"}
        stateInit={{
          allowed: datas?.features?.length > 0 || datas?.proposals?.length > 0,
        }}
        components={[
          {
            component: (
              <MySelect
                style={"max-w-[50vw] flex-wrap justify-center"}
                target="feature"
                arr={
                  !datas
                    ? []
                    : [
                        ...datas?.features.map((el) => (
                          <>
                            Owner -
                            <FeatureName featureID={el} />
                          </>
                        )),
                        ...datas?.proposals.map((el) => (
                          <>
                            Worker -
                            <FeatureName featureID={el} />
                          </>
                        )),
                      ]
                }
              />
            ),
            label: "For wich feature would you declare a dispute ?",
          },
          {
            component: (
              <MySelect
                target="court"
                arr={["Centralized", "Kleros", "Decentralized"]}
              />
            ),
            label: "Do you want to switch court for your dispute ?",
          },
          {
            component: (
              <MyInput
                min={3}
                styles={"w-1/3"}
                type={"number"}
                target={"arbitrators"}
                label={false}
              />
            ),
            label: "How many arbitrators do you want ?",
          },
          {
            component: (
              <MyInput
                min={1}
                styles={"w-1/3"}
                type={"number"}
                label={false}
                target={"appeal"}
              />
            ),
            label: "How many days do you allowed for declare an appeal ?",
          },
          {
            component: (
              <div className="flex w-full flex-col items-center gap-4">
                <MyInputFile target={"image"} />
                <MyTextArea
                  styles={"w-full min-h-[30vh]"}
                  label={false}
                  target={"description"}
                />
              </div>
            ),
            label: "Please provide evidences for arbitrators",
          },
        ]}
      />
    </MyLayoutApp>
  );
};

export default PageCreateEscrow;
