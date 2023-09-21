import { pinataGateway } from "utils/ui-tools/pinata-tools";

export const ImagePin = ({ CID, style }) => {
  return (
    <div className={style || "w-full h-full"}>
      <img
        src={CID ? pinataGateway + CID : "/profile.jpeg"}
        alt="Pinata Image"
      />
    </div>
  );
};
