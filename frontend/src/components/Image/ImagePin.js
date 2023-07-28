import { pinataGateway } from "utils/ui-tools/pinata-tools";

export const ImagePin = ({ CID, style }) => {
  return (
    <img
      src={CID ? pinataGateway + CID : "/profile.jpeg"}
      alt="Pinata Image"
      className={`w-full h-full ${style}`}
    />
  );
};
