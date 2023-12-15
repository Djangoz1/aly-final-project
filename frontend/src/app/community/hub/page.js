"use client";

import React, { useEffect, useRef, useState } from "react";

import { useAuthState } from "context/auth";
import {
  doStatePubsTools,
  doStateTools,
  useToolsDispatch,
  useToolsState,
} from "context/tools";

import { parseTimestamp } from "helpers";

import { Icon } from "@iconify/react";
import { icfy, icfyETHER, icfyMAIL, icfySEND, icsystem } from "icones";
import { getWalletClient } from "@wagmi/core";

import { _apiGet, _apiPostPayable } from "utils/ui-tools/web3-tools";

import { ImagePin } from "components/Image/ImagePin";

import { ENUMS } from "constants/enums";

import { CreatePub } from "sections/Pub/form/create/CreatePub";
import { v4 } from "uuid";

import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { MyLayoutDashboard } from "components/myComponents/layout/MyLayoutDashboard";
import { MySub } from "components/myComponents/text/MySub";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyTitle } from "components/myComponents/text/MyTitle";
import { Avatar } from "components/profile/ProfileAvatar";
import { MyNum } from "components/myComponents/text/MyNum";
import { MyCardInfos } from "components/myComponents/card/MyCard";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { pinataGateway, urlPocket } from "utils/ui-tools/pinata-tools";
import { FileDisplay } from "components/FileDisplay";
import { CVName } from "components/links/CVName";

function App({ params }) {
  const { cv } = useAuthState();

  const { address } = useAccount();
  const { state, status, pointer } = useToolsState();
  let [isLoading, setIsLoading] = useState(null);
  let [isClicked, setIsClicked] = useState(null);
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

        //   fetchJSONByCID
        // Construisez l'URL complète en ajoutant "https://gateway.pinata.cloud/ipfs/" devant l'URI
        const url = `${urlPocket}${uri}`;

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
  return (
    <MyLayoutDashboard
      isLoading={isLoading}
      noMenu={true}
      template={0}
      target={"pub"}
      side={
        <div className="w-full px-2  h-full">
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
                CID={el?.metadata?.preview}
                metadatas={el?.metadata}
              />
              <MySub>{el?.metadata?.title}</MySub>
              <div className="flex w-full text-xs items-center">
                <Avatar
                  _cvID={el?.owner}
                  designation={true}
                  style={"w-8 mr-3"}
                />

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
      }
      url={"/community/hub"}
    >
      <>
        <div className=" w-full flex h-full relative">
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

            {state?.front?.index >= 0 ? (
              <div className="mt-5 px-2 flex flex-col w-full">
                <div className="flex w-full">
                  <MyCardInfos
                    style={" w-full   "}
                    title={
                      <span className="flex items-center w-full">
                        {
                          state?.pubs?.arr?.[state?.front?.index]?.metadata
                            ?.title
                        }
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
                        value: (
                          <CVName
                            cvHash={
                              state?.pubs?.arr?.[state?.front?.index]?.metadata
                                ?.userID
                            }
                          />
                        ),
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
                        value:
                          state?.pubs?.arr?.[state?.front?.index]?.metadata
                            ?.created,
                      },
                    ]}
                  >
                    <div className="flex  mt-auto items-end">
                      <MyMainBtn
                        style={"btn-xs"}
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
                      state?.pubs?.arr?.[state?.front?.index]?.metadata?.preview
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
