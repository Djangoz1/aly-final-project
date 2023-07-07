"use client";

import React from "react";
import { Layout } from "sections/Layout";
import { useState, useEffect } from "react";
// import { client, getProfileById } from "../../../api";
import { apolloClient, getProfileById, getPublications } from "../../../../api";
import { gql } from "@apollo/client";
import { SocialProfile } from "components/social-media/profile/SocialProfile";
import { ListSocialPubs } from "components/social-media/publications/ListSocialPubs";
import ABI_LENS_HUB from "../../../abi/abi_lens_hub.json";
import { ADDR_LENS_HUB_PROXY } from "constants/web3";
import {
  _getterCONTRACT,
  _setterCONTRACT,
  _setterLENS,
} from "utils/ui-tools/web3-tools";
const Profile = ({ params }) => {
  const id = params.id;
  const [profile, setProfile] = useState(null);
  const [pubs, setPubs] = useState([]);
  useEffect(() => {
    id && fetchProfile();
  }, [id]);

  async function fetchProfile() {
    try {
      const response = await apolloClient.query({
        query: gql(getProfileById),
        variables: { id },
      });
      setProfile(response.data.profile);

      const publicationData = await apolloClient.query({
        query: gql(getPublications),
        variables: { id },
      });
      console.log(publicationData);
      setPubs(publicationData.data.publications);
    } catch (error) {
      console.log({ error });
    }
  }

  async function followUser() {
    const test = await _setterLENS({
      funcName: "follow",
      args: [[id], ["0x0"]],
    });
    console.log(test);
    console.log("follow user successfully");
  }

  return (
    <Layout>
      <div>
        <SocialProfile profile={profile} />
        <button className="btn" onClick={followUser}>
          Follow him
        </button>
        <ListSocialPubs pubs={pubs} />
      </div>
    </Layout>
  );
};

export default Profile;
