import { Icon } from "@iconify/react";
import { v4 as uuidv4 } from "uuid";

export const MyBadgesBar = ({ badges }) => {
  return (
    <div
      className={`flex flex-col h-full rounded-r-lg shadow overflow-y-scroll hide-scrollbar items-center w-fit px-3 to-black  from-black/70 bg-gradient-to-t py-3`}
    >
      {badges?.map((el) => (
        <Icon icon={el?.badge} key={uuidv4()} className={"text-[38px] mb-12"} />
      ))}
    </div>
  );
};
