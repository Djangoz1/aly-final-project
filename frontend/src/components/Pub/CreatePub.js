import React from "react";

import { MySelects } from "components/myComponents/form/MySelects";

import { MyModal } from "components/modal/MyModal";
import { ProfileAvatar } from "components/profile/ProfileAvatar";
import { MyInputsFile } from "components/myComponents/form/MyInputsFile";
import { useAuthState } from "context/auth";

export const CreatePub = () => {
  const { cv, metadatas } = useAuthState();
  return (
    <MyModal
      btn={"Create Post"}
      styles={{ btn: "ml-5 btn btn-xs btn-primary btn-outline" }}
      modal={
        <div className="">
          <ProfileAvatar
            cvID={cv}
            metadatas={metadatas}
            component={
              <MySelects
                selects={[
                  {
                    placeholder: "Reference",
                    arr: ["Public", "Mission"],
                  },
                ]}
              />
            }
          />
          <form className="flex flex-col mt-5">
            <div className="my-4  flex flex-col">
              <textarea
                className="textarea font2 font-light textarea-bordered min-h-[30vh] max-h-[50vh]"
                placeholder="What's  new ?"
              ></textarea>
            </div>
            <div className="flex justify-between items-end">
              <MyInputsFile inputs={[{ label: "Image" }]} />

              <button className="  ml-auto btn btn-success btn-xs">
                Publier
              </button>
            </div>
          </form>
        </div>
      }
    />
  );
};
