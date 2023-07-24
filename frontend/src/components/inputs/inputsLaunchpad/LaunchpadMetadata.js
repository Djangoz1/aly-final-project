import React from "react";
import { InputText, InputTextArea } from "..";

export const LaunchpadMetadata = ({ datas, setter }) => {
  return (
    <div className="flex flex-col">
      <div className="divider text-primary">Metadata</div>
      <div className="flex w-full justify-between">
        <div>
          <label className="text-primary">Title</label>
          <InputText
            title={"Write a title of your project"}
            setter={setter}
            target={"title"}
            style={"xs w-1/2"}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-primary">Image</label>
          <input
            type="file"
            onChange={(e) => setter("image", e.target.files[0])}
          />
        </div>
      </div>
      <label className="text-primary">Description</label>
      <InputTextArea
        setter={setter}
        value={datas.description}
        target={"description"}
        title={"Write a description of your project"}
      />
    </div>
  );
};
