import Link from "next/link";
import React from "react";

export const BtnToProfileCV = ({ cvAddress }) => {
  return (
    <Link
      className="btn btn-xs btn-success btn-outline ml-auto"
      href={`/profile/cv/${cvAddress}`}
    >
      Go to Profile
    </Link>
  );
};
