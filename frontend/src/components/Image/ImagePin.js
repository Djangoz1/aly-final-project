import { pinataGateway } from "utils/ui-tools/pinata-tools";

export const ImagePin = ({ CID, style }) => {
  return (
    <img
      src={pinataGateway + CID}
      alt="Pinata Image"
      className={`w-full h-full ${style}`}
    />
  );
};
