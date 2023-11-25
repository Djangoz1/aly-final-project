import { ImagePin } from "components/Image/ImagePin";
import { CVName } from "components/inputs/inputsCV/CVName";
import { ADDRESSES } from "constants/web3";
import React, { useEffect, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";
import Image from "next/image";

import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
export const ProfileAvatar = ({
  cvID,
  onlyAvatar,
  component,
  metadatas,
  style,
}) => {
  const [isMetadatas, setIsMetadatas] = useState(null);
  let state = async () => {
    if (metadatas) {
      setIsMetadatas(metadatas);
      return;
    }
    if (cvID && cvID > 0) {
      let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);
      let _metadatas = await fetchJSONByCID({ id: uri, table: "accounts" });
      setIsMetadatas(_metadatas);
    }
  };
  useEffect(() => {
    if (!isMetadatas) state();
  }, [cvID]);

  return onlyAvatar ? (
    <>
      <Avatar style={style} metadatas={isMetadatas} CID={isMetadatas?.avatar} />
    </>
  ) : (
    <div className="flex items-end">
      <div className="avatar h-fit">
        <Avatar
          style={style}
          metadatas={isMetadatas}
          CID={isMetadatas?.avatar}
        />
      </div>
      <div className=" ml-3">
        <CVName metadata={isMetadatas} styles={"font-semibold text-xs"} />
        <br />
        <span className="font-light text-xs">CV #{cvID}</span>
        {component}
      </div>
    </div>
  );
};

export const Avatar = ({
  CID,
  metadatas,
  src,
  noCircle,
  avatarStyle,
  children,
  style,
}) => {
  return metadatas && !CID ? (
    <div className={"avatar placeholder " + avatarStyle || ""}>
      <div
        className={"bg-neutral-focus text-neutral-content rounded-full w-12"}
      >
        <span className="text-xl">{metadatas?.username?.[0]}</span>
        {children ? children : ""}
      </div>
    </div>
  ) : (
    <div className={`avatar ${avatarStyle || undefined}`}>
      <ImagePin
        metadatas={metadatas}
        style={`rounded-full ${
          !noCircle
            ? "ring ring-primary ring-offset-base-100 ring-offset-2"
            : null
        } ${style || "w-16"}`}
        CID={CID}
        defaultImage={src || "/defaultprofile.png"}
      />
      {children ? children : ""}
    </div>
  );
};

export const AvatarsList = ({ lists }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const springConfig = { stiffness: 100, damping: 5 };

  const x = useMotionValue(0); // going to set this value on mouse move

  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );

  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <div className="flex flex-row items-center justify-center  mb-10 w-full">
      {lists?.map((testimonial, idx) => (
        <div
          className="-mr-4  relative group"
          key={testimonial?.username}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                <div className="font-bold text-white relative z-30 text-base">
                  {testimonial?.metadatas?.username}
                </div>
                <div className="text-white text-xs">
                  {testimonial?.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div onMouseMove={handleMouseMove} className="">
            <Avatar
              style={
                "w-10 object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
              }
              // height={100}
              // width={100}
              metadatas={testimonial?.metadatas}
              CID={testimonial?.metadatas?.avatar}
              alt={testimonial?.metadatas?.username}
              // className=""
            />
          </div>
        </div>
      ))}
    </div>
  );
};
