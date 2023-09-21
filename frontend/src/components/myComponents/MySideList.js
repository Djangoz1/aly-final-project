import { Icon } from "@iconify/react";
import { ImagePin } from "components/Image/ImagePin";

import { icfyARROWD } from "icones";
import React, { useEffect, useState } from "react";
import { themes, uxcomponent } from "styles/style";

import { v4 as uuidv4 } from "uuid";

import Link from "next/link";
import { MyBadgesBar } from "components/myComponents/MyBadgesBar";

export const MySideList = ({ list, badges }) => {
  return (
    <div className="flex border-l-1 border-y-0 border border-white/10 border-r-0 max-h[80vh] h-[80vh]   w-[35%]">
      <div className="flex h-full overflow-y-scroll hide-scrollbar flex-col   w-full">
        {list?.map((el) => (
          <MySideEl
            key={uuidv4()}
            img={el?.img}
            details={el?.details}
            title={el?.title}
            link={el?.link}
            description={el?.description}
            subContent={el?.subContent}
          />
        ))}
      </div>
      <MyBadgesBar badges={badges} />
    </div>
  );
};

export const MySideEl = ({
  img,
  details,
  title,
  link,
  description,
  subContent,
}) => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b-1 border-t-0 border px-1 py-3 font2 border-x-0 border-white/10 ">
      <div className="flex items-center">
        <div className="avatar ">
          <ImagePin style={"w-12 rounded-full"} CID={img} />
        </div>

        <Link href={link} className="ml-3 text-white">
          {title}
        </Link>
      </div>
      <div className="flex mt-1">
        {details.map((el) => (
          <p className="text-xs mr-2" key={uuidv4()}>
            <span className="text-white mr-1">{el?.value}</span>
            {el?.title}
          </p>
        ))}
      </div>
      <Icon
        icon={icfyARROWD}
        className={`text-white transition-all ml-auto -mt-4 cursor-pointer ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col">
          <div className="text-white border border-t-1 pt-1 border-white/10 border-b-0 border-x-0 mt-1 text-xs text-justify">
            <h6 className="text-white text-xs">Description</h6>
            <div className={`${uxcomponent.borderb} ${themes.proposals}`} />
            {description}
          </div>

          {subContent?.arr?.length > 0 && (
            <div className={`flex flex-col mt-2 w-full `}>
              <h6 className="text-white text-xs">{subContent.title}</h6>
              <div className={`${uxcomponent.borderb} ${subContent.theme}`} />
              <div className="text-white">
                {subContent?.arr?.map((el) => (
                  <div key={uuidv4()} className="text-sm flex items-center">
                    - {el?.value}
                    <div className="flex ml-auto">
                      <Icon
                        icon={el?.icon1}
                        className={` ${el?.styleIc1} ml-auto mr-3`}
                      />
                      <Icon icon={el?.icon2} className={`  ${el?.styleIc2}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
