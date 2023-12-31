import { ChatBubble } from "components/ChatBubble";
import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { MyCheckboxes } from "components/myComponents/form/MyCheckboxes";
import { MyTextArea } from "components/myComponents/form/MyTextArea";
import { MyMenusTabs } from "components/myComponents/menu/MyMenus";
import { useFormState } from "context/form";
import { useToolsState } from "context/tools";
import React, { useState } from "react";
import { v4 } from "uuid";
import { clientPocket } from "../../utils/ui-tools/pinata-tools";
import { useAuthState } from "context/auth";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { icfy } from "icones";
import { MyBadge } from "components/myComponents/box/MyList";
import { ENUMS } from "constants/enums";
import { MySub } from "components/myComponents/text/MySub";
import { MyNum } from "components/myComponents/text/MyNum";
import { TextAI } from "components/myComponents/text/TextAI";
import { MissionName } from "components/links/MissionName";
import { controllers } from "utils/controllers";
import { FeatureName } from "components/links/FeatureName";

export const FormTxs = () => {
  let { metadatas, datas } = useAuthState();
  let { state, target } = useToolsState();
  let { form } = useFormState();

  let ai = form?.ai?.recommandations;
  let resumes = {
    escrow: [
      {
        target: "feature",
        value: form?.feature != null && (
          <FeatureName
            featureID={
              [...datas?.features, ...datas?.proposals]?.[form?.feature]
            }
          />
        ),
      },
      {
        target: "court",
        value:
          form?.court !== null ? (
            <>You decide to switch to {ENUMS.courts[form?.court]?.court}</>
          ) : (
            "You stay on initial court"
          ),
      },
      {
        target: "description",
      },
      {
        target: "image",
        value: form?.image?.name,
      },
      {
        target: "arbitrators",
      },
      {
        target: "Appeal delay",
        value: form?.appeal > 0 && <MyNum num={form?.appeal} />,
      },
      {
        target: "invite only",
        value: form?.onlyInvite > 0 ? <>Open</> : <>Close</>,
      },
    ],
    feature: [
      {
        target: "title",
        value: ai?.roles?.[0]?.role_name || form?.title || (
          <>
            <Icon icon={icfy.ux.warning} /> You can't create feature without
            name of feature !
          </>
        ),
      },
      {
        target: "skills",
        value:
          ai?.roles?.[0]?.skills_required || form?.skills ? (
            <div className="flex  flex-wrap w-2/3 gap-2">
              {ai?.roles?.[0]?.skills_required?.length
                ? ai?.roles?.[0]?.skills_required?.map((el, i) => (
                    <MyBadge style={"text-[8px]"} key={v4()} color={2}>
                      {el}
                    </MyBadge>
                  ))
                : form?.skills?.map((el, i) => (
                    <MyBadge style={"text-[8px]"} key={v4()} color={2}>
                      {ENUMS?.courts?.[el]?.court}
                    </MyBadge>
                  ))}
            </div>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You can't create feature without
              name of feature !
            </>
          ),
      },
      {
        target: "abstract",
        value: ai?.roles?.[0]?.reason || form?.abstract || (
          <>
            <Icon icon={icfy.ux.warning} /> We recommanded to provide an
            abstract description !
          </>
        ),
      },
      {
        target: "mission",
        value: form?.missionID ? (
          <MissionName id={datas?.missions?.[form?.missionID]} url={false} />
        ) : (
          <>
            <Icon icon={icfy.ux.warning} /> We recommanded to provide a name of
            company !
          </>
        ),
      },
      {
        target: "domain",
        value:
          form?.domain >= 0 ? (
            <>
              <MyBadge color={parseInt(form?.domain)}>
                {ENUMS.domain[parseInt(form?.domain || 0n)]?.name}
              </MyBadge>
            </>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You must provide a domain !
            </>
          ),
      },
      {
        target: "specification",
        value:
          form?.specification >= 0 ? (
            <>
              <MyBadge color={form?.specification}>
                {ENUMS.courts[form?.specification]?.court}
              </MyBadge>
            </>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You must provide a specification
              for a protection court !
            </>
          ),
      },
      {
        target: "invite only",
        value: form?.onlyInvite > 0 ? <>Open</> : <>Close</>,
      },

      {
        target: "description",
        value:
          ai?.detail || form?.description ? (
            <>
              {ai?.name}
              {ai?.abstract}
              <div
                dangerouslySetInnerHTML={{
                  __html: ai?.detail || form?.description,
                }}
                className="w-full"
              ></div>
            </>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You can't create feature without
              description !
            </>
          ),
      },
      {
        target: "images",
        value: form?.image ? (
          <>Thanks to provides image(s)</>
        ) : (
          <>
            <Icon icon={icfy.ux.warning} /> It's recommanded to provide images !
          </>
        ),
      },

      {
        target: "price",
        value: (
          <MySub style={"flex gap-2 items-center text-xl"}>
            <MyNum num={form?.wadge || ai?.budget?.total} style={"text-lg"} />
            ETH
          </MySub>
        ),
      },
    ],
    profile: [
      {
        target: "username",
      },
      {
        target: "skills",
        value: form?.skills?.length ? (
          <div className="flex  flex-wrap w-2/3 gap-2">
            {form?.skills?.map((el, i) => (
              <MyBadge style={"text-[8px]"} key={v4()} color={2}>
                {typeof el === "string" ? el : ENUMS?.courts?.[el]?.court}
              </MyBadge>
            ))}
          </div>
        ) : (
          <>
            <Icon icon={icfy.ux.warning} /> It's recommended to provide a skills
          </>
        ),
      },
      {
        target: "avatar",
        value: form?.image?.name || (
          <>
            <Icon icon={icfy.ux.warning} /> It's recommended to provide a avatar
          </>
        ),
      },
      {
        target: "date of birth",
        value: form?.dateOfBirth || (
          <>
            <Icon icon={icfy.ux.warning} /> You must provide a date of birth
          </>
        ),
      },
      {
        target: "identity",
        value:
          form?.lastName && form?.firstName ? (
            `${form?.lastName} ${form?.firstName}`
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You must provide your name
            </>
          ),
      },
      {
        target: "banniere",
        value: form?.baniere?.name || (
          <>
            <Icon icon={icfy.ux.warning} /> It's recommended to provide a skills
          </>
        ),
      },
      {
        target: "Bio",
        value: form?.description,
      },
      {
        target: "email",
      },
      {
        target: "visibility",
        value: form?.visibility === 1 ? "Visible" : "Hide",
      },
      {
        target: "domain",
        value:
          form?.domain >= 0 && form?.domain < ENUMS.domain.length ? (
            <>
              <MyBadge color={parseInt(form?.domain)}>
                {ENUMS.domain[parseInt(form?.domain || 0n)]?.name}
              </MyBadge>
            </>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You must provide a domain !
            </>
          ),
      },
      {
        target: "citizen",
        value:
          form?.citizen === 0 || form?.citizen === 1 ? (
            <>{["Mr", "Mme"][form?.citizen || 0]}</>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You must provide your gender !
            </>
          ),
      },

      {
        target: "images",
        value: form?.image ? (
          <>Thanks to provides image(s)</>
        ) : (
          <>
            <Icon icon={icfy.ux.warning} /> It's recommanded to provide images !
          </>
        ),
      },
    ],
    launchpad: [
      {
        target: "title",
      },
      {
        target: "abstract",
        value: form?.bio,
      },
      {
        target: "company",
      },
      {
        target: "sale start",
        value: form?.saleStart,
      },
      {
        target: "sale end",
        value: form?.saleEnd,
      },
      {
        target: "website",
      },
      {
        target: "domain",
        value:
          form?.domain >= 0 ? (
            <>
              <MyBadge color={parseInt(form?.domain)}>
                {ENUMS.domain[parseInt(form?.domain || 0n)]?.name}
              </MyBadge>
            </>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> You must provide a domain !
            </>
          ),
      },

      {
        target: "description",
      },
      {
        target: "website",
      },
      {
        target: "images",
        value:
          form?.banniere || form?.image ? (
            <>Thanks to provides image(s)</>
          ) : (
            <>
              <Icon icon={icfy.ux.warning} /> It's recommanded to provide images
              !
            </>
          ),
      },

      {
        target: "price",
        value: (
          <MySub style={"flex gap-2 items-center text-xl"}>
            <MyNum num={0.4} style={"text-lg"} />
            ETH{" "}
          </MySub>
        ),
      },
    ],
    mission: [
      {
        target: "title",
        value: ai?.name,
      },
      {
        target: "abstract",
        value: ai?.abstract,
      },
      {
        target: "company",
      },
      {
        target: "domain",
        value: form?.domain >= 0 && form?.domain !== null && (
          <>
            <MyBadge color={parseInt(form?.domain)}>
              {ENUMS.domain[parseInt(form?.domain || 0n)]?.name}
            </MyBadge>
          </>
        ),
      },

      {
        target: "description",
        value: (ai?.detail || form?.description) && (
          <div
            dangerouslySetInnerHTML={{
              __html: ai?.detail || form?.description,
            }}
            className="w-full"
          ></div>
        ),
      },
      {
        target: "images",
        value: (form?.banniere || form?.image) && (
          <>Thanks to provides image(s)</>
        ),
      },

      ai?.roles && {
        target: "features",
        value: ai?.roles?.length,
      },
      {
        target: "price",
        value: (
          <MySub style={"flex gap-2 items-center text-xl"}>
            <MyNum num={form?.price} style={"text-lg"} />
            ETH
          </MySub>
        ),
      },
    ],
  };
  let [isView, setIsView] = useState(0);
  let [isDone, setIsDone] = useState(null);

  let txs = [
    <h6 className="font3">Confirmer la création de {target} ...</h6>,
    <>
      <h6 className="font3">Datas post to database</h6>
      {state?.txs?.pointer >= 1 && (
        <>
          <span className="text-xs opacity-70 flex flex-col">
            Transaction confirmée !{" "}
          </span>
          <time className="text-[8px]">{state?.txs?.db?.created}</time>
          <p className="text-[8px]">ID #{state?.txs?.db?.id}</p>
        </>
      )}
    </>,
    <>
      <h6 className="font3">Datas post to blockchain</h6>
      {state?.txs?.pointer >= 2 && (
        <>
          <span className="text-xs opacity-70 flex flex-col">
            Transaction confirmée !{" "}
          </span>
          <time className="text-[8px]">{state?.txs?.db?.created}</time>
        </>
      )}
      <p className="text-[8px]">createMission({state?.txs?.db?.id})</p>
    </>,
    <>
      <h6 className="font3">Transaction confirm to blockchain</h6>
      <span className="text-xs opacity-70 flex flex-col">
        Transaction confirmée !{" "}
      </span>
      <p className="text-[8px]">Hash #{state?.txs?.bc}</p>
    </>,
    <>
      <h6 className="font3"> {form?.target} are ready !</h6>
      <Link href={state?.txs?.result} className="text-xs text-info ">
        Click to view !
      </Link>
    </>,
  ];
  return (
    <div className="flex w-2/3 overflow-y-scroll  min-h-[40vh]  flex-col">
      {!form?.result ? (
        <>
          <MyMenusTabs
            color={12}
            styleOrigin={"mb-4"}
            template={2}
            setter={setIsView}
            value={isView}
            arr={[
              "Resume",
              "Transaction",
              form?.aiAssisted ? "Feedback" : undefined,
            ]}
          />

          {
            [
              <div className="w-full flex flex-col divide-y divide-white/30 backdrop-blur-[4px]  gap-3 ">
                {resumes?.[form?.target]?.map(
                  (el) =>
                    el?.target && (
                      <div
                        key={v4()}
                        className="flex items-start  gap-2 p-2 hover:bg-white/5"
                      >
                        <MySub size={8} style={"min-w-1/4 c4 w-1/4"}>
                          {el?.target}
                        </MySub>
                        <div className="w-full text-white/70 font-light text-[9px] flex items-center">
                          {el?.value || form?.[el?.target] || (
                            <>
                              <Icon
                                icon={icfy.ux.warning}
                                className="text-warning text-lg"
                              />
                              <span className="text-warning">
                                Please provide a {el?.target}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>,
              <ul className="steps steps-vertical">
                {txs?.map(
                  (el, i) =>
                    (i <= state?.txs?.pointer + 1 || i === 0) && (
                      <li
                        key={v4()}
                        data-content={
                          i <= state?.txs?.pointer || i === 3 ? "✓" : "✋"
                        }
                        className={`step ${
                          i <= state?.txs?.pointer || i === 3
                            ? "step-success"
                            : "step-error"
                        }`}
                      >
                        <div className="flex flex-col items-start my-10">
                          {el}
                        </div>
                      </li>
                    )
                )}
              </ul>,
              <div className="flex gap-3 flex-col">
                <ChatBubble image={false} ai={true}>
                  Please post a feedback for help me to improve my knowledge.
                </ChatBubble>
                {!isDone ? (
                  <>
                    <MyCheckboxes
                      label={"Rating"}
                      target={"ratingAi"}
                      template={1}
                      checkboxes={[1, 2, 3, 4, 5]}
                    />

                    <MyTextArea
                      styles={"min-h-[20vh] mt-4"}
                      target={"feedbacks"}
                      label={{ no: true }}
                    />
                    <MyMainBtn
                      style={"mt-10 btn-xs py-2 ml-auto"}
                      setter={async () => {
                        console.log(form);
                        let datas = {
                          feedback: form?.feedbacks,
                          rating: form?.ratingAi + 1,
                          aiID: form?.ai?.recommandations?.id,
                        };
                        console.log(datas);
                        let record = await clientPocket.records.create(
                          "feedbacks",
                          datas
                        );
                        console.log(record);

                        if (record?.id) {
                          setIsDone(true);
                        }
                      }}
                      template={1}
                    >
                      Post feedback
                    </MyMainBtn>
                  </>
                ) : (
                  <ChatBubble
                    ai={true}
                    text={
                      "Thank you " +
                      metadatas?.username +
                      " for your feedback ! 🙏"
                    }
                  />
                )}
              </div>,
            ][isView]
          }
        </>
      ) : form?.result?.url ? (
        <TextAI
          style={"w-full justify-center items-center flex flex-col"}
          text={`Go to  ${
            !form?.result?.label && !form?.title
              ? `my ${form?.target}`
              : form?.result?.label || form?.title
          } `}
        >
          <MyMainBtn
            url={form?.result?.url}
            template={0}
            _refresh={false}
            style={"btn-sm mt-2 font-light"}
            color={2}
          >
            Click to view
          </MyMainBtn>
        </TextAI>
      ) : (
        <TextAI
          style={"w-full justify-center items-center flex flex-col"}
          text={`Well done ! Your ${form?.target} is ready !`}
        />
      )}
    </div>
  );
};
