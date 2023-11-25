import { Icon } from "@iconify/react";
import { icfyETHER } from "icones";
import React from "react";
import { MyNum } from "../text/MyNum";
import { MyCard } from "../card/MyCard";
import { MySub } from "../text/MySub";

export const MyChart = ({ children, style, title, price }) => {
  return (
    <MyCard
      styles={style + " min-w-[20vw] min-h-[10vh] rounded-xl overflow-hidden"}
    >
      <div
        className={
          "h-full w-full  g1 gb2  relative rounded-xl border border-slate-200/5 "
        }
      >
        <dl className="absolute top-0 left-0 p-3">
          <dt className="text-2xl flex items-center font-bold">
            {children || (
              <>
                <Icon icon={icfyETHER} className="mr-2" /> <MyNum num={price} />
              </>
            )}
          </dt>
          <dd className="text-sm  c4">
            <MySub>{title || "Total Depense"}</MySub>
          </dd>
        </dl>
        <div className="-m-2">
          <svg
            className="  w-auto   "
            fill="g1 gb1"
            stroke="black"
            strokeWidth="2px"
            viewBox="0 0 1000 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="greenToTransparentGradient"
                x1="0%"
                y2="0%"
                y1="100%"
                x2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "green", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#244f09", stopOpacity: 0 }}
                />
              </linearGradient>
            </defs>
            <path
              d="M 0,493.9109719606716 C 14.200000000000001,490.40802978683513 42.60000000000001,487.5791262811064 71,476.39626109148924 C 99.4,465.21339590187205 113.6,453.15974467495977 142,437.99664601258576 C 170.4,422.8335473502118 184.6,406.98651600999744 213,400.58076777961935 C 241.4,394.17501954924126 255.6,416.4756240849917 284,405.9679048606953 C 312.4,395.46018563639893 326.6,358.32287941899733 355,348.0421716581375 C 383.4,337.7614638972776 397.6,368.4679124832968 426,354.5643660563959 C 454.4,340.660819629495 468.6,300.30672545627453 497,278.5244395236329 C 525.4,256.7421535909913 539.6,252.0730672209553 568,245.65293639318784 C 596.4,239.23280556542042 610.6,231.89211788080013 639,246.42378538479574 C 667.4,260.95545288879134 681.6,336.33567203932097 710,318.3112739131659 C 738.4,300.28687578701084 752.6,166.6854990107404 781,156.30179475402042 C 809.4,145.91809049730045 823.6,289.85843160308036 852,266.3927526295661 C 880.4,242.92707365605182 894.6,59.99402379966443 923,38.9733998864491 C 951.4,17.952775973233773 979.8,136.82638642808135 994,161.28963306348942,L 1000 500,L 0 500Z"
              fill="url(#greenToTransparentGradient)"
            />
          </svg>
        </div>
      </div>
    </MyCard>
  );
};
