import { pinataGateway } from "utils/ui-tools/pinata-tools";

export const ImagePin = ({ CID, metadatas, style, defaultImage, styleImg }) => {
  const BASE_URL = `http://127.0.0.1:8090/api/files/${metadatas?.["@collectionId"]}/${metadatas?.id}/`; // URL de base pour les fichiers PocketBase

  return (
    <div className={style || "w-full h-full"}>
      <img
        className={styleImg || "w-full h-full"}
        src={
          CID && metadatas
            ? `${BASE_URL}${CID}`
            : defaultImage || "/default.jpeg"
        }
        alt={"Image " + metadatas?.["@collectionName"]}
      />
    </div>
  );
};
