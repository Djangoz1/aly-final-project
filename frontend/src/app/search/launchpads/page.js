"use client";

import { icfy, icfyLOCK, icfySEARCH, icfyUNLOCK, icsystem } from "icones";
import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAccount } from "wagmi";
import { MyInput } from "components/myComponents/form/MyInput";
import { LayoutForm } from "sections/Form/LayoutForm";

import { ENUMS } from "constants/enums";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";

import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import {
  doPointerTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";
import { MySub } from "components/myComponents/text/MySub";
import { v4 } from "uuid";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { MyBtns } from "components/myComponents/btn/MyBtns";
import { useAuthState } from "context/auth";
import { controllers } from "utils/controllers";
import { AssetFreelancer } from "components/assets/AssetProfile";
import { AssetLaunchpad } from "components/assets/AssetLaunchpad";
export default function PageSearch({ params }) {
  let { address } = useAccount();
  let [isLoading, setIsLoading] = useState(null);
  let { metadatas } = useAuthState();
  let { state, pointer } = useToolsState();
  let dispatch = useToolsDispatch();
  let [isPointer, setIsPointer] = useState();
  let loadState = async () =>
    doStateTools(dispatch, {
      lists: await controllers.get.launchpad.list({ filter: "" }),
    });
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadState();
      setIsLoading(false);
    })();
  }, []);
  console.log(state);
  return (
    <MyLayoutDashboard
      isLoading={isLoading}
      color={2}
      refresh={loadState}
      target={"search"}
      owner={metadatas}
      url={"/search/launchpads"}
      template={0}
    >
      <Page />
    </MyLayoutDashboard>
  );
}

let Page = () => {
  let { pointer, state } = useToolsState();
  let [isExtend, setIsExtend] = useState(null);
  let dispatch = useToolsDispatch();

  let [isCourt, setIsCourt] = useState(0);
  let [isDomain, setIsDomain] = useState(null);
  let [isInvite, setIsInvite] = useState(0);
  let [isStarted, setIsStarted] = useState(0);

  let setterMenu = (index) => {
    // setIsPointer(index);
    doPointerTools(dispatch, index);
    setIsCourt(0);
    setIsInvite(0);
    setIsStarted(0);
    setIsDomain(0);
  };
  return (
    <>
      <div
        id={1}
        className="flex relative   hide-scrollbar
      h-full   w-full"
      >
        <div className="flex  c1 absolute -translate-y-full -top-5 right-5 items-center">
          <LayoutForm
            stateInit={{
              placeholders: { search: "Search ..." },
              allowed: true,
              form: { target: "search", search: null },
            }}
          >
            <MyInput label={false} target={"search"} icon={icfySEARCH} />
            <button
              onClick={() => setIsExtend(!isExtend)}
              className=" btn btn-outline relative  "
            >
              <Icon icon={icfy.ux.filter} className="text-3xl c3  " />
            </button>
          </LayoutForm>
        </div>
        {isExtend ? (
          <div className="w-full flex flex-col   items-center justify-between  h-fit bg3 p-3 mb-3">
            {/* <MyMenusTabs
          target={"value"}
          value={isPointer}
          color={0}
          setter={setIsPointer}
          arr={[
            { value: "Jobs", icon: icsystem.feature },
            { value: "Freelancers", icon: icsystem.profile },
            { value: "Launchpad", ic: icsystem.escrow },
            { value: "Disputes", icon: icsystem.escrow },
          ]}
        /> */}

            <>
              <div className="flex  c1 flex-col w-full overflow-scroll hide-scrollbar">
                <MySub style={"mt-2 mb-5 font-bold"}>Language techno</MySub>

                <MyMenusTabs
                  template={2}
                  color={0}
                  setter={setIsCourt}
                  value={isCourt}
                  target={"title"}
                  arr={ENUMS.courts.map((el) => ({
                    title: el?.court,
                    icon: el?.badge,
                  }))}
                >
                  All
                </MyMenusTabs>
              </div>

              <div className="flex c1 flex-col w-full">
                <MySub style={"mt-2  mb-5 font-bold"}>Domaine</MySub>

                <MyMenusTabs
                  template={2}
                  color={2}
                  setter={setIsDomain}
                  value={isDomain}
                  target={"name"}
                  arr={ENUMS.domain}
                >
                  All
                </MyMenusTabs>

                <div className="flex mr-5 flex-col">
                  <MySub style={"mt-2  mb-5 font-bold"}>Invite only</MySub>

                  <MyMenusTabs
                    template={2}
                    color={0}
                    setter={setIsInvite}
                    value={isInvite}
                    arr={[
                      <div className="flex items-center">
                        <Icon icon={icfyLOCK} className="mr-3 text-error" />
                        Yes
                      </div>,
                      <div className="flex items-center">
                        <Icon icon={icfyUNLOCK} className="mr-3 text-success" />
                        No
                      </div>,
                    ]}
                  >
                    All
                  </MyMenusTabs>
                </div>
                <div className="flex flex-col">
                  <MySub style={"mt-2  mb-5 font-bold"}>Visibility</MySub>

                  <MyMenusTabs
                    setter={setIsInvite}
                    value={isInvite}
                    template={2}
                    color={2}
                    arr={[
                      <div className="flex items-center">
                        {" "}
                        <Icon
                          icon={icfy.eye.open}
                          className="mr-3 text-success"
                        />
                        Disponible
                      </div>,
                      <div className="flex items-center">
                        {" "}
                        <Icon
                          icon={icfy.eye.close}
                          className="mr-3 text-error"
                        />
                        Indisponible
                      </div>,
                    ]}
                  >
                    All
                  </MyMenusTabs>
                </div>
                <div className="flex flex-row">
                  <div className="flex flex-col ml-5">
                    <MySub style={"mt-2  mb-5 font-bold"}>experience</MySub>

                    <MyMenusTabs
                      setter={setIsStarted}
                      value={isStarted}
                      template={2}
                      color={0}
                      arr={[
                        <div className="flex items-center">Junior</div>,
                        <div className="flex items-center">
                          <Icon
                            icon={icfy.eye.close}
                            className="mr-3 text-error"
                          />
                          Senior
                        </div>,
                      ]}
                    >
                      All
                    </MyMenusTabs>
                  </div>
                </div>
              </div>
            </>
          </div>
        ) : (
          []
        )}
        <div className="flex flex-wrap">
          {state?.lists?.map((el, index) => (
            <AssetLaunchpad
              id={el?.launchpadID}
              state={el}
              style={"w-full  mb-3 h-fit "}
              key={v4()}
              color={2}
            />
          ))}
        </div>

        {/* <ListProfiles /> */}
      </div>
    </>
  );
};
