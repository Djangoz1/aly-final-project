import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";

import { _getterCV } from "utils/ui-tools/web3-tools";

export const CVName = ({ styles, address }) => {
  const { cv } = useAuthState();

  const [name, setName] = useState(null);
  useEffect(() => {
    (async () => {
      const requestAddress = address || cv;
      try {
        const _name = await _getterCV(requestAddress, "name");
        setName(_name);
      } catch (error) {
        return error;
      }
    })();
  }, [cv, address]);

  return <span className={styles}>{name}</span>;
};
