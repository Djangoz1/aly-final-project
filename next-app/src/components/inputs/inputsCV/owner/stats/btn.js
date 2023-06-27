import { useAuthState } from "context/auth";
import Link from "next/link";
import React from "react";

export const BtnWorkerJoinFeature = ({ cvAddress }) => {
  return (
    <Link href={`profile/cv/${cvAddress}`}>
      <div className="btn btn-primary btn-outline"> Join Feature</div>
    </Link>
  );
};
