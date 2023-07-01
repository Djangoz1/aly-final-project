import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";

import { _getterCV } from "utils/ui-tools/web3-tools";

export const CVName = ({ styles }) => {
  const { cv } = useAuthState();

  const [name, setName] = useState(null);
  useEffect(() => {
    if (cv) {
      getName();
    }
  }, [cv]);
  const getName = async () => {
    const _name = await _getterCV(cv, "name");
    setName(_name);
  };
  return <span className={styles}>{name}</span>;
};
