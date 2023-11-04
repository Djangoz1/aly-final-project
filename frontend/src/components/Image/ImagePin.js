import { pinataGateway } from "utils/ui-tools/pinata-tools";

export const ImagePin = ({ CID, style, defaultImage, styleImg }) => {
  return (
    <div className={style || "w-full h-full"}>
      <img
        className={styleImg || "w-full h-full"}
        src={CID ? pinataGateway + CID : defaultImage || "/default.jpeg"}
        alt="Pinata Image"
      />
    </div>
  );
};
