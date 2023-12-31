import React from "react";
import { MyMainBtn } from "../btn/MyMainBtn";
import { MySub } from "../text/MySub";
import { MyTitle } from "../text/MyTitle";
import { v4 } from "uuid";
import { MyCard } from "../card/MyCard";
import { ENUMS } from "constants/enums";
import { NoItems } from "../layout/NoItems";
import { Badge } from "@lemonsqueezy/wedges";
import { Icon } from "@iconify/react";

export const MyList = ({ withoutBtn, title, arr, description, head }) => {
  return (
    <MyCard
      template={1}
      styles="flex w-full flex-col overlow-x-scroll rounded-lg   md:col-span-3"
    >
      <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100/5 p-5 text-center sm:flex-row sm:text-start">
        <div>
          <MyTitle style={"mb-1"}>{title || "Recent Transactions"}</MyTitle>
          <MySub style="c4">{description}</MySub>
        </div>
        {arr?.length > 5 ? (
          <div>
            <MyMainBtn template={1} style={"btn-xs"} color={0}>
              All transactions
            </MyMainBtn>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="p-5">
        {/* <!-- Responsive Table Container --> */}
        <div className="min-w-full overflow-x-auto rounded">
          {/* <!-- Alternate Responsive Table --> */}
          <table className="min-w-full align-middle text-sm">
            {/* <!-- Table Header --> */}
            <thead>
              <tr className="border-b-2 c4 border-white/5">
                {head ? (
                  head.map((el, i) => (
                    <th
                      key={v4()}
                      className={` py-3 ${
                        i === 0
                          ? "pe-3"
                          : i === head?.length - 1
                          ? "ps-3 min-w-[100px]"
                          : "px-3"
                      } text-start text-sm font-semibold uppercase tracking-wider `}
                    >
                      {el}
                    </th>
                  ))
                ) : (
                  <>
                    <th className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider ">
                      Account
                    </th>
                    <th className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider ">
                      Description
                    </th>
                    <th className="min-w-[180px] px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider ">
                      Category
                    </th>
                    <th className="px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider ">
                      Amount
                    </th>
                    <th className="min-w-[100px] py-2 ps-3 text-end text-sm font-semibold uppercase tracking-wider ">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            {/* <!-- END Table Header --> */}

            {/* <!-- Table Body --> */}
            <tbody>
              {arr?.map((el) => (
                <tr
                  key={v4()}
                  className="border-b hover:bg-white/5 border-white/5"
                >
                  {el?.map((el1, i) => (
                    <td
                      key={v4()}
                      className={`${
                        i === 0
                          ? "pe-3 text-start text-xs"
                          : i === el1?.length - 1
                          ? "ps-3"
                          : "p-3 font-medium"
                      } py-3   hover:text-white c4`}
                    >
                      {el1}
                    </td>
                  ))}

                  {withoutBtn ? (
                    <></>
                  ) : (
                    <td className="py-3 ps-3 text-end font-medium">
                      <MyMainBtn
                        template={1}
                        color={1}
                        icon={false}
                        style={"flex ml-auto btn-xs"}
                        href="javascript:void(0)"
                        className="group inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-medium text-slate-800 hover:border-violet-300 hover:text-violet-800 active:border-slate-200"
                      >
                        View
                      </MyMainBtn>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            {/* <!-- END Table Body --> */}
          </table>
          {!arr?.length && <NoItems target={title || "items"} />}
          {/* <!-- END Alternate Responsive Table --> */}
        </div>
        {/* <!-- END Responsive Table Container --> */}
      </div>
    </MyCard>
  );
};

export const MyBadge = ({ style, shape, icon, children, color }) => {
  return (
    <Badge
      className={`${style || "text-xs"} flex items-center`}
      before={icon ? <Icon icon={icon} /> : undefined}
      stroke
      shape={shape}
      color={
        [
          undefined,
          "green",
          "red",
          "blue",
          "orange",
          "pink",
          "purple",
          "yellow",
          "primary",
        ][color || 0]
      }
    >
      {children}
      {/* <div
      
    >
      {children}
    </div> */}
    </Badge>
  );
};
