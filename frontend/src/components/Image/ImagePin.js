import { pinataGateway } from "utils/ui-tools/pinata-tools";

export const ImagePin = ({ CID, style, styleImg }) => {
  return (
    <div className={style || "w-full h-full"}>
      <img
        className={styleImg}
        src={CID ? pinataGateway + CID : "/profile.jpeg"}
        alt="Pinata Image"
      />
    </div>
  );
};
