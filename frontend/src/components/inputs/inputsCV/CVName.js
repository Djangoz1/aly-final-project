"use client";

import { ADDRESSES } from "constants/web3";
import { useAuthState } from "context/auth";
import { useInView } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";

export const CVName = ({ styles, metadata, cvID }) => {
  const { cv } = useAuthState();
  const [isName, setIsName] = useState(null);
  let ref = useRef(null);
  let isInView = useInView(ref);
  let state = async () => {
    if (metadata) {
      setIsName(metadata?.username);
      return;
    } else if (cvID && cvID > 0) {
      let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);
      let data = await fetchJSONByCID(uri);
      setIsName(data?.username);
      console.log("fetch cvName ...", data?.username);
    }
  };

  useEffect(() => {
    if (!isName && isInView) {
      state();
    }
  }, [cvID, metadata, isInView]);

  return (
    <Link
      ref={ref}
      href={`/profile/${metadata?.cvID || cvID || cv}`}
      className={styles + " w-fit hover:text-info"}
    >
      {isName || "No name"}
    </Link>
  );
};
