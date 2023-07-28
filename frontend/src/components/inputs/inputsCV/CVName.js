import { useAuthState } from "context/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { _getterCV } from "utils/ui-tools/web3-tools";

export const CVName = ({ styles, address }) => {
  const { cv } = useAuthState();

  const [name, setName] = useState(null);
  useEffect(() => {
    (async () => {
      const requestAddress = address || cv;
      try {
        const profile = await _getterCV(requestAddress, "getProfile");
        setName(profile.name);
      } catch (error) {
        return error;
      }
    })();
  }, [cv, address]);

  return (
    <Link href={`/profile/cv/${address || cv}`} className={styles}>
      {name}
    </Link>
  );
};
