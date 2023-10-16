import React, { useState } from "react";

export const MyBtnPost = ({ style, children, setter }) => {
  let [isLoading, setIsLoading] = useState(false);
  let handleClick = async () => {
    setIsLoading(true);
    await setter();
    setIsLoading(false);
  };
  return (
    <button
      onClick={handleClick}
      className={`btn ${style || "btn-xs btn-outline c2"}`}
    >
      {isLoading ? (
        <span className="loading loading-bars loading-xs"></span>
      ) : (
        children
      )}
    </button>
  );
};
