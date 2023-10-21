import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const MyBtnPost = ({ style, children, disabled, setter }) => {
  let [isLoading, setIsLoading] = useState(false);
  let router = useRouter();
  let handleClick = async () => {
    setIsLoading(true);
    await setter();
    setIsLoading(false);
    router.refresh();
  };
  return (
    <MyMainBtn
      disabled={disabled}
      setter={handleClick}
      style={` ${style || " c2"}`}
    >
      {isLoading ? (
        <span className="loading loading-bars loading-xs"></span>
      ) : (
        children
      )}
    </MyMainBtn>
  );
};
