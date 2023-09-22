import { MyModal } from "components/modal/MyModal";
import React from "react";
import { MyFormInfo } from "./MyFormInfo";
import { v4 as uuidv4 } from "uuid";

export const MyFormModal = ({
  btn,
  left,
  styles,
  title,
  description,
  components,
  pointer,
  handleClick,
  total,
}) => {
  return (
    <MyModal
      btn={btn}
      styles={{
        btn: `btn w-fit btn-xs btn-primary btn-outline ${styles?.btn}`,
        modal: "w-[80vw] h-[80vh]",
      }}
      modal={
        <div className="flex h-full   relative ">
          <div className="h-[75vh] mr-8   p-0 w-1/5 ">{left}</div>

          <div className="w-full relative h-[75vh] ">
            <MyFormInfo
              title={<h6 className="text-2xl">{title}</h6>}
              description={description}
            />

            {components?.length > 0 && (
              <div className="flex flex-col h-auto ">
                {components?.map((el) => (
                  <div key={uuidv4()} className="mb-4">
                    {el}
                  </div>
                ))}
              </div>
            )}
            <div className="absolute  bottom-0 right-0 ">
              {pointer > 0 && (
                <div
                  onClick={() => handleClick(pointer - 1)}
                  className="  mr-5 btn btn-error btn-xs"
                >
                  Précédent
                </div>
              )}
              {pointer < total - 1 && (
                <div
                  onClick={() => handleClick(pointer + 1)}
                  className="  btn btn-success btn-xs"
                >
                  Suivant
                </div>
              )}
              {pointer === total - 1 && (
                <div className="  btn btn-info btn-xs">Créer</div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};
