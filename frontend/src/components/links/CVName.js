"use client";

import { ADDRESSES } from "constants/web3";
import { useAuthState } from "context/auth";
import { useInView } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { clientPocket, fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";

export const CVName = ({ styles, metadata, cvID }) => {
  const { cv } = useAuthState();
  if (cvID == 0) {
    return "No worker";
  }
  const [isName, setIsName] = useState(null);
  let ref = useRef(null);
  let isInView = useInView(ref);
  let state = async () => {
    try {
      let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);
      let data = await clientPocket.records.getOne("accounts", uri);
      setIsName(data?.username);
      console.log("fetch cvName ...", data?.username);
    } catch (error) {
      console.error("error cvName", error.stack);
    }
  };

  useEffect(() => {
    if (!isName && !metadata && isInView && cvID > 0) {
      state();
    }
  }, [cvID, metadata, isInView]);

  return (
    <Link
      ref={ref}
      href={metadata?.cvID || cvID ? `/profile/${metadata?.cvID || cvID}` : "#"}
      className={" w-fit hover:text-info " + styles}
    >
      {metadata?.username || isName || "No name"}
    </Link>
  );
};
