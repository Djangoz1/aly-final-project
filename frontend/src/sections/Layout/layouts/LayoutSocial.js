"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToolsDispatch, useToolsState } from "context/tools";

import { _apiPost } from "utils/ui-tools/web3-tools";

import { useAuthState } from "context/auth";

import { Icon } from "@iconify/react";
import { icfy, icfyIMG, icfySEARCH, icsystem } from "icones";

import { _apiGet } from "utils/ui-tools/web3-tools";

import { MySub } from "components/myComponents/text/MySub";

import { MyCard } from "components/myComponents/card/MyCard";

import { Logo } from "components/Logo";
import { LayoutForm } from "sections/Form/LayoutForm";
import { MyInput } from "components/myComponents/form/MyInput";
import { Avatar, ProfileAvatar } from "components/profile/ProfileAvatar";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { Pub } from "components/Pub";
import { controllers } from "utils/controllers";
import { useFormState } from "context/form";
import { ImagePin } from "components/Image/ImagePin";
import { NoItems } from "components/myComponents/layout/NoItems";
import { CVName } from "components/links/CVName";

export const LayoutSocial = ({
  pubs,

  launchpad,
  owner,
  mission,
}) => {
  return (
    <LayoutForm
      stateInit={{
        form: { target: "pubPage", search: null, description: null },
        allowed: true,
        placeholders: {
          search: "Search everything ...",
          description: "What's happening ...",
        },
      }}
    >
      <Page launchpad={launchpad} pubs={pubs} mission={mission} owner={owner} />
    </LayoutForm>
  );
};

let Page = ({ mission, launchpad, pubs, owner }) => {
  const { cv, metadatas } = useAuthState();
  let { form } = useFormState();
  const { state, status, pointer } = useToolsState();

  return (
    <main
      id="page-content"
      className="flex relative max-w-full flex-auto flex-col "
    >
      {owner?.metadatas?.banniere ? (
        <div className="absolute top-0 left-0 w-full h-[20vh] ">
          <ImagePin
            CID={owner?.metadatas?.banniere}
            metadatas={owner?.metadatas}
          />
        </div>
      ) : (
        <></>
      )}
      <div
        className={`relative container mx-auto grid grid-cols-1 p-4 lg:grid-cols-12 lg:gap-8 lg:p-8 xl:max-w-5xl ${
          owner?.metadatas?.banniere ? "mt-20" : ""
        }`}
      >
        <div className="lg:col-span-8">
          <MyCard
            template={3}
            styles="mb-4   px-3 py-4 sm:p-6 flex gap-4 w-full"
          >
            <Avatar
              style={"h-12 w-12"}
              CID={metadatas?.avatar}
              metadatas={metadatas}
            />

            <div className="grow w-full">
              <MyTextArea
                styles=" min-h-[80px] w-full "
                rows="2"
                label={false}
                target={"description"}
                placeholder="What's happening?"
              ></MyTextArea>
              <hr className="my-3 border-slate-100 dark:border-slate-700" />
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex gap-3">
                  <button className="btn btn-ghost btn-xs p-0 text-sky-500 transition hover:text-sky-500 active:text-sky-600">
                    <Icon icon={icfyIMG} className="h-6 w-6" />
                  </button>
                  <button className="btn btn-ghost btn-xs p-0 text-sky-500 transition hover:text-sky-500 active:text-sky-600">
                    <Icon icon={icfy.code.casual} className="h-6 w-6" />
                  </button>
                  <button className="btn btn-ghost btn-xs p-0 text-sky-500 transition hover:text-sky-500 active:text-sky-600">
                    <Icon icon={icfy.ux.dots} className="h-6 w-6" />
                  </button>
                </div>
                <MyMainBtn
                  template={1}
                  setter={async () => {
                    let record = await controllers.create.pub({
                      ...form,
                      owner: metadatas,
                      launchpadID: launchpad?.metadatas?.id,
                      mission: { metadatas: { id: mission?.metadatas?.id } },
                    });
                  }}
                  style={"btn-xs"}
                >
                  Post
                </MyMainBtn>
              </div>
            </div>
          </MyCard>

          {pubs?.length > 0 ? (
            <MyCard
              template={3}
              styles={
                "p-0 w-full relative dark:divide-slate-700   divide-slate-100 divide-y min-h-[50vh]"
              }
              className="  "
            >
              {pubs?.map((el) => (
                <Pub _pub={{ metadatas: el?.metadatas }} _owner={el?.owner} />
              ))}
            </MyCard>
          ) : (
            <MyCard template={1} styles="w-full overflow-hidden">
              <NoItems
                style={"min-h-[60vh]"}
                target={"pubs"}
                icon={icfy.msg.casual}
              />
            </MyCard>
          )}
        </div>

        <div className="hidden space-y-4 lg:col-span-4 lg:block">
          {/* <div className="bg-zinc-900 w-fit rounded-lg">
          </div> */}
          <MyInput
            styles={"w-full backdrop-blur-2xl"}
            label={false}
            icon={icfySEARCH}
            target={"search"}
          />

          <MyCard template={1} styles="w-full space-y-2  py-4">
            <MySub style="px-4 text-lg">Relevant people</MySub>
            <nav>
              <a
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                href="javascript:void(0)"
              >
                <Avatar
                  CID={owner?.metadatas?.avatar}
                  style={"w-12 h-12"}
                  metadatas={owner?.metadatas}
                />

                <div className="grow space-y-1">
                  <h4 className="flex items-center gap-1 text-sm font-semibold">
                    <CVName metadata={owner?.metadatas} cvID={owner?.cvID} />

                    <Icon
                      className="h-5 w-5 text-sky-500"
                      icon={icfy.social.checkmark}
                    />
                  </h4>
                  <MySub style="text-xs c4">Owner</MySub>
                </div>
              </a>
              {launchpad || mission ? (
                <a
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                  href="javascript:void(0)"
                >
                  <Avatar style={"w-12 h-12"}>
                    <Icon
                      icon={launchpad ? icsystem.launchpad : icsystem.mission}
                      className=" text-lg "
                    />
                  </Avatar>

                  <div className="grow space-y-1">
                    <h4 className="flex items-center gap-1 text-sm font-semibold">
                      <span>
                        {launchpad?.metadatas?.title ||
                          mission?.metadatas?.title}
                      </span>
                      <Icon
                        className="h-5 w-5 text-sky-500"
                        icon={icfy.social.checkmark}
                      />
                    </h4>
                    <MySub style="text-xs c4">
                      {launchpad ? "Launchpad" : "Mission"}
                    </MySub>
                  </div>
                </a>
              ) : (
                <></>
              )}
            </nav>
          </MyCard>

          <MyCard template={1} styles="space-y-2 w-full  py-4">
            <MySub style={"px-4 text-lg"}>Trends for you</MySub>

            <nav>
              <a
                className="block space-y-1 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                href="javascript:void(0)"
              >
                <div className="text-xs font-medium text-slate-500">
                  Languages in your location
                </div>
                <div className="text-sm font-semibold">#webdesign</div>
                <div className="text-xs font-medium text-slate-500">
                  20k updates
                </div>
              </a>
              <a
                className="block space-y-1 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                href="javascript:void(0)"
              >
                <div className="text-xs font-medium text-slate-500">
                  Languages in your location
                </div>
                <div className="text-sm font-semibold">#webdev</div>
                <div className="text-xs font-medium text-slate-500">
                  5k updates
                </div>
              </a>
              <a
                className="block space-y-1 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                href="javascript:void(0)"
              >
                <div className="text-xs font-medium text-slate-500">
                  Languages
                </div>
                <div className="text-sm font-semibold">#tailwindcss</div>
                <div className="text-xs font-medium text-slate-500">
                  4,6k updates
                </div>
              </a>
              <a
                className="block space-y-1 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                href="javascript:void(0)"
              >
                <div className="text-xs font-medium text-slate-500">
                  Languages
                </div>
                <div className="text-sm font-semibold">#laravel</div>
                <div className="text-xs font-medium text-slate-500">
                  12,9k updates
                </div>
              </a>
              <a
                className="block space-y-1 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                href="javascript:void(0)"
              >
                <div className="text-xs font-medium text-slate-500">
                  Languages
                </div>
                <div className="text-sm font-semibold">#digitalNomads</div>
                <div className="text-xs font-medium text-slate-500">
                  7,8k updates
                </div>
              </a>
              <a
                className="block space-y-1 px-4 py-2 hover:bg-slate-300/40 active:bg-transparent dark:hover:bg-slate-700/40"
                href="javascript:void(0)"
              >
                <div className="text-xs font-medium text-slate-500">
                  Languages
                </div>
                <div className="text-sm font-semibold">#coffee</div>
                <div className="text-xs font-medium text-slate-500">
                  35k updates
                </div>
              </a>
            </nav>
          </MyCard>

          <MyCard template={0} styles="space-y-2 p-4 w-full">
            <div className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-500">
              <Logo />

              <div className="inline-flex items-center justify-center">
                <span>Crafted with</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="mx-0.5 h-4 w-4 text-red-600"
                >
                  <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"></path>
                </svg>
                <span>
                  by
                  <a
                    className="font-medium text-sky-600 transition hover:text-sky-700 hover:underline ml-1"
                    href="https://pixelcave.com"
                    target="_blank"
                  >
                    Django
                  </a>
                </span>
              </div>
            </div>
          </MyCard>
        </div>
      </div>
    </main>
  );
};
