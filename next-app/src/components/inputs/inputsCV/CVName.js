import { useAuthState } from "context/auth";
import React, { useEffect, useState } from "react";
import { _getName } from "utils/auth-tools";

export const CVName = ({ styles }) => {
  const { cv } = useAuthState();

  const [name, setName] = useState(null);

  useEffect(() => {
    if (cv) {
      getName();
    }
  }, [cv]);
  const getName = async () => {
    const _name = await _getName(cv);
    setName(_name);
  };
  return <span className={styles}>{name}</span>;
};
