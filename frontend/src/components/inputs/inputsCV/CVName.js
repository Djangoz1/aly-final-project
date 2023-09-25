"use client";

import { ADDRESSES } from "constants/web3";
import { useAuthState } from "context/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchJSONByCID } from "utils/ui-tools/pinata-tools";
import { _apiGet } from "utils/ui-tools/web3-tools";

export const CVName = ({ styles, metadata, cvID }) => {
  const { cv } = useAuthState();
  const [isName, setIsName] = useState(null);

  let state = async () => {
    if (metadata) {
      setIsName(metadata?.username);
      return;
    } else if (cvID && cvID > 0) {
      let uri = await _apiGet("tokenURIOf", [cvID, ADDRESSES["cvsHub"]]);
      let data = await fetchJSONByCID(uri);
      setIsName(data?.username);
    }
  };

  useEffect(() => {
    if (!isName) state();
  }, [cv, metadata, cvID]);

  return (
    <Link href={`/profile/${metadata?.cvID || cvID || cv}`} className={styles}>
      {isName || "No name"}
    </Link>
  );
};
