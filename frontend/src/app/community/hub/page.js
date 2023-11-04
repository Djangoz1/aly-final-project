"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStateProfileTools,
  doStatePubsTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import {
  stateCV,
  stateDetailsCV,
  stateFeature,
  stateMission,
  statePub,
} from "utils/ui-tools/state-tools";

import { calcTimestamp, parseTimestamp, selectDevDomain } from "helpers";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";
import { getWalletClient } from "@wagmi/core";

import { MyLayoutApp } from "components/myComponents/layout/MyLayoutApp";
import { _table_features } from "utils/states/tables/feature";
import { _table_invites } from "utils/works/feature";

import { Viewport } from "components/myComponents/layout/MyViewport";
import { CVProfile } from "sections/Profile/state/CVProfile";
import { _apiGet, _apiPostPayable } from "utils/ui-tools/web3-tools";
import { ABIs, ADDRESSES } from "constants/web3";
import { MyModal } from "components/myComponents/modal/MyModal";
import { ImagePin } from "components/Image/ImagePin";
import { CVOverview } from "sections/Profile/state/CVOverview";
import { ENUMS } from "constants/enums";
import { EditProfile } from "sections/Profile/form/edit/EditProfile";
import { Particle } from "components/myComponents/MyParticles";
import { AssetProfile1 } from "components/assets/AssetProfile";
import { MyFModal } from "components/myComponents/modal/MyFramerModal";
import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { v4 } from "uuid";
import { EditWorker } from "sections/works/Features/form/edit/EditWorker";
import { CVInfos } from "sections/Profile/state/CVInfos";
import {
  MyMenusDropdown,
  MyMenusDropdownProfile,
  MyMenusTabs,
} from "components/myComponents/menu/MyMenus";
import { CVMenusDropdown } from "sections/Profile/state/CVMenusDropdown";
import { BtnsSocial } from "components/btn/BtnsSocial";
import { Loader } from "@react-three/drei";
import { MyLoader } from "components/myComponents/layout/MyLoader";
import { MyCardList } from "components/myComponents/card/MyCardList";
import { doStateFormPointer } from "context/form";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { STATUS } from "constants/status";
import { MySub } from "components/myComponents/text/MySub";
import { MyCardFolder } from "components/myComponents/card/MyCardFolder";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCard, MyCardInfos } from "components/myComponents/card/MyCard";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { fetchJSONByCID, pinataGateway } from "utils/ui-tools/pinata-tools";
import { FileDisplay } from "components/FileDisplay";

function App({ params }) {
  const { cv } = useAuthState();

  const { address } = useAccount();
  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);

  let [isBlob, setIsBlob] = useState(null);
  let dispatch = useToolsDispatch();
  let fetchState = async () => {
    setIsLoading(true);

    let walletClient = await getWalletClient();
    doStatePubsTools(dispatch, {}, walletClient);

    setIsLoading(false);
  };
  useEffect(() => {
    if ((cv && isLoading === null) || status === "reload") {
      fetchState();
      console.log("Origin fetchState pubs");
    }
  }, [status, cv]);
  console.log("payable", state?.pubs?.arr?.[state?.front?.index]?.payable);
  useEffect(() => {
    (async () => {
      console.log(
        "file1",
        state?.pubs?.arr?.[state?.front?.index]?.payable?.metadatas?.file
      );
      if (state?.pubs?.arr?.[state?.front?.index]?.payable?.metadatas?.file) {
        const uri = `${
          state?.pubs?.arr?.[state?.front?.index]?.payable?.metadatas?.file
        }`; // Remplacez <CID> par l'identifiant du contenu de Pinata

        console.log("uri", uri);
        //   fetchJSONByCID
        // Construisez l'URL complète en ajoutant "https://gateway.pinata.cloud/ipfs/" devant l'URI
        const url = `${pinataGateway}${uri}`;

        // Utilisez fetchState pour récupérer le contenu
        fetch(url)
          .then((response) => {
            if (!response?.ok) {
              throw new Error(
                `Erreur lors de la récupération du fichier. Statut : ${response.status}`
              );
            }
            return response.blob();
          })
          .then((blob) => {
            // Utilisez le contenu du fichier (blob) comme vous le souhaitez
            console.log("file", blob);
            setIsBlob(blob);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    })();
  }, [state?.front?.index]);

  console.log("status", status);
  let setTrending = (index) => {
    let arr = state?.trending?.arr;
    if (!arr?.length > 0) {
      arr = [];
    }
    if (arr.includes(index)) {
      arr = arr.filter((el) => el !== index);
    } else {
      arr.push(index);
    }
    doStateTools(dispatch, {
      ...state,
      trending: { arr: arr, more: state?.trending?.more },
    });
  };
  console.log("state hub ", state);
  return (
    <MyLayoutDashboard
      isLoading={isLoading}
      noMenu={true}
      template={2}
      btn={{
        title: "Invite worker",
        info: <>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</>,
      }}
      target={"pubs"}
    >
      <>
        <div className="w-full flex h-full relative">
          <div className="w-1/6 border border-white/5 border-l-0 border-b-0 h-full">
            {state?.pubs?.arr?.map((el, i) => (
              <div
                onClick={() =>
                  doStateTools(dispatch, {
                    ...state,
                    front: { ...state?.front, index: i },
                  })
                }
                className={`w-full flex flex-col  pb-3  ${
                  state?.front?.index === i
                    ? "opacity-100 bg-white/5"
                    : "opacity-60 hover:opacity-80"
                }`}
                key={v4()}
              >
                <ImagePin
                  style={`mb-2`}
                  CID={el?.metadata?.attributes?.[0]?.preview}
                />
                <div className="flex w-full text-xs items-center">
                  <Avatar
                    noCircle={true}
                    CID={el?.metadata?.attributes?.[0]?.owner?.image}
                    metadatas={el?.metadata?.attributes?.[0]?.owner}
                    style={"w-8 mr-3"}
                  />
                  <p className="font-light text-white">
                    {el?.metadata?.attributes?.[0]?.owner?.username}{" "}
                  </p>
                  <div className="flex flex-col ml-auto items-end">
                    <div className="flex items-center text-xs">
                      <MyNum num={parseInt(el?.payable?.datas?.viewers)}>
                        <Icon className=" c2 ml-3" icon={icfy.person.friend} />
                      </MyNum>
                    </div>
                    <div className="flex w-full items-center text-xs">
                      <MyNum
                        toFix={4}
                        num={ethers.utils.formatEther(
                          el?.payable?.datas?.amount || 0
                        )}
                      >
                        <MySub style="ml-1">ETH</MySub>
                        <Icon className="ml-3 c2 " icon={icfyETHER} />
                      </MyNum>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full overflow-y-scroll mx-8 flex flex-col border bgprim border-white/0 border-t-white/5 h-full pt-5">
            <MyMenusTabs
              template={2}
              color={12}
              style={"ml-auto mr-5"}
              arr={["All", "Payable", "Free"]}
              value={state?.front?.list}
              setter={(i) =>
                doStateTools(dispatch, {
                  ...state,
                  front: { ...state?.front, list: i },
                })
              }
            >
              {"Post"}
            </MyMenusTabs>

            {state?.front?.list ? (
              <div className="mt-5 px-2 flex flex-col w-full">
                <div className="flex w-full">
                  <MyCardInfos
                    style={" w-[400px]  mr-auto "}
                    title={
                      <span className="flex items-center w-full">
                        {
                          state?.pubs?.arr?.[state?.front?.index]?.metadata
                            ?.title
                        }{" "}
                        <MySub
                          style={"text-neutral-700 ml-auto hover:text-white"}
                        >
                          # {state?.pubs?.arr?.[state?.front?.index]?.pubID}
                        </MySub>
                      </span>
                    }
                    arr={[
                      {
                        title: "Owner",
                        value:
                          state?.pubs?.arr?.[state?.front?.index]?.metadata
                            ?.attributes?.[0]?.owner?.username,
                      },
                      {
                        title: "Buyers",
                        value: (
                          <>
                            <MyNum
                              num={parseInt(
                                state?.pubs?.arr?.[state?.front?.index]?.payable
                                  ?.datas?.viewers
                              )}
                            />{" "}
                            <MySub size={" text-[7px]"} style={"ml-3"}>
                              {" "}
                              users
                            </MySub>
                          </>
                        ),
                      },
                      {
                        title: "Posted at",
                        value: parseTimestamp(
                          Math.floor(
                            state?.pubs?.arr?.[state?.front?.index]?.metadata
                              ?.attributes?.[0]?.createdAt / 1000
                          )
                        ),
                      },
                    ]}
                  >
                    <div className="flex  mt-auto items-end">
                      <MyMainBtn
                        setter={async () => {
                          await _apiPostPayable(
                            "buyPub",
                            [state?.pubs?.arr?.[state?.front?.index]?.pubID],
                            state?.pubs?.arr?.[state?.front?.index]?.payable
                              ?.datas?.amount
                          );
                          doStatePubsTools(dispatch, state);
                        }}
                        color={1}
                        template={1}
                      >
                        Buy
                      </MyMainBtn>

                      <MyNum
                        style={"ml-auto"}
                        toFix={6}
                        num={ethers.utils.formatEther(
                          state?.pubs?.arr?.[state?.front?.index]?.payable
                            ?.datas?.amount || 0
                        )}
                      >
                        <Icon icon={icfy.bank.dollars} />
                      </MyNum>
                    </div>
                  </MyCardInfos>
                  <ImagePin
                    style={"w-3/5  max-h-[50vh] "}
                    CID={
                      state?.pubs?.arr?.[state?.front?.index]?.metadata
                        ?.attributes?.[0]?.preview
                    }
                  />
                </div>
                <MyMenusTabs
                  setter={() =>
                    doStateTools({ ...state, front: { ...front, index } })
                  }
                ></MyMenusTabs>
                {isBlob && (
                  <FileDisplay style={"w-[600px] mt-3"} blob={isBlob} />
                )}
                {console.log(isBlob)}
                <MyCardInfos title={"Description"} style={"w-full  my-5"}>
                  <p className="text-xs font-light whitespace-break-spaces">
                    {
                      state?.pubs?.arr?.[state?.front?.index]?.metadata
                        ?.description
                    }
                  </p>
                </MyCardInfos>
              </div>
            ) : (
              <CreatePub refresh={() => doStatePubsTools(dispatch, state)} />
            )}
          </div>
          <div className="w-[13%]   border-white/10  border-b-white/0 border-r-white/0 border  flex h-full flex-col pl-5">
            <div className="flex flex-col py-10  ">
              <MyTitle style="flex items-center">
                Trending <MySub style={"ml-1"}>Tags</MySub>
              </MyTitle>
              <div className="flex flex-wrap mt-2 gap-2">
                {ENUMS.courts.map(
                  (el, i) =>
                    (i < 10 || state?.trending?.more) && (
                      <button
                        onClick={() => setTrending(i)}
                        key={v4()}
                        className={`btn font-light btn-xs ${
                          !state?.trending?.arr?.includes(i)
                            ? "btn-outline"
                            : undefined
                        }  btn-neutral normal-case text-xs`}
                      >
                        <span className="  mr-2">#</span>
                        {el?.court}
                      </button>
                    )
                )}
                <MyMainBtn
                  style={"normal-case"}
                  icon={icfy.ux.plus}
                  rotate={state?.trending?.more}
                  setter={() =>
                    doStateTools(dispatch, {
                      ...state,
                      trending: {
                        ...state?.trending,
                        more: !state?.trending?.more,
                      },
                    })
                  }
                  template={1}
                  color={state?.trending?.more ? 0 : 1}
                  padding={"btn-xs px-2 py-1"}
                >
                  More
                </MyMainBtn>
              </div>
            </div>
          </div>
        </div>
      </>
    </MyLayoutDashboard>
  );
}

export default App;
