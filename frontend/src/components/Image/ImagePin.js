import { pinataGateway } from "utils/ui-tools/pinata-tools";

export const ImagePin = ({ CID }) => {
  return (
    <img
      src={pinataGateway + CID}
      alt="Pinata Image"
      className="w-full h-full"
    />
  );
};
