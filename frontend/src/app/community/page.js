"use client";
import React from "react";
import { Layout } from "sections/Layout";
import { useState, useEffect } from "react";
import { apolloClient, recommendProfiles } from "../../../api";
import { gql } from "@apollo/client";
import { ListSocialProfiles } from "components/social-media/profile/ListSocialProfiles";

const Community = () => {
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await apolloClient.query({
        query: gql(recommendProfiles),
      });

      setProfiles(response.data.recommendedProfiles);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <Layout>
      <div>Community</div>
      {console.log("coucoui")}
      <ListSocialProfiles profiles={profiles} />
    </Layout>
  );
};

export default Community;
