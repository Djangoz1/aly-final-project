import { MyMainBtn } from "components/myComponents/btn/MyMainBtn";
import { useFormState } from "context/form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const MyBtnLoading = ({ style, children, disabled, setter }) => {
  let [isLoading, setIsLoading] = useState(false);

  let handleClick = async () => {
    setIsLoading(true);
    await setter();
    setIsLoading(false);
  };
  return (
    <button disabled={disabled} onClick={handleClick} className={` ${style}`}>
      {isLoading ? (
        <span className="loading loading-bars loading-xs"></span>
      ) : (
        children
      )}
    </button>
  );
};
export const MyBtnPost = ({ style, children, target, disabled, setter }) => {
  let [isLoading, setIsLoading] = useState(false);
  let formState = target && useFormState();
  let router = useRouter();
  let handleClick = async () => {
    setIsLoading(true);
    if (target) {
      await setter(formState?.form?.[target]);
    } else {
      await setter();
    }
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
