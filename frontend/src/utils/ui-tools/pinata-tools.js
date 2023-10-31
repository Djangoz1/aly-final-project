require("dotenv").config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;

import axios from "axios";
import { ADDRESSES } from "constants/web3";

import { _apiGet } from "utils/ui-tools/web3-tools";

export const pinataGateway =
  "https://copper-immense-nightingale-374.mypinata.cloud/ipfs/";

export const fetchJSONByCID = async (CID) => {
  try {
    const response = await axios.get(
      `https://copper-immense-nightingale-374.mypinata.cloud/ipfs/${CID}`
    );

    if (response.data.name) {
      return response.data;
    } else {
      return JSON.parse(response.data);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'objet JSON :", error);
    return null;
  }
};

export const createImageCIDOnPinata = async (file, pinataMetadata) => {
  const imageData = new FormData();
  imageData.append("file", file);
  imageData.append("pinataMetadata", JSON.stringify(pinataMetadata));

  try {
    const responseImg = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",

      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // "x-api-key": "g9qfkj50yoSr8q3040vu6N5XgCsdVr7N",
          pinata_api_key: "f77b863f0d06b51f0c63",
          pinata_secret_api_key: `be5170c1049d407a0bdbd0a8b8a077c88aa5927aaade281ee9fe390e5cd1389d`,
        },
      }
    );

    const imageCID = responseImg.data.IpfsHash;
    return imageCID;
  } catch (error) {
    console.log({ error });
  }
};

export let refreshURI = async ({
  id,
  title,
  images,
  metadatas,
  refreshArr,
}) => {
  const pinataOptions = {
    cidVersion: 0,
  };

  for (let index = 0; index < images?.length; index++) {
    const element = images[index];
    if (element?.image?.size > 0) {
      let uri = await createImageCIDOnPinata(element.image, {
        name: "Work3 - Img " + title + "#" + id,
      });
      if (element?.attributes) {
        metadatas.attributes[0][element?.target] = uri;
      } else {
        metadatas[element.target] = uri;
      }
    } else {
      if (element?.attributes) {
        metadatas.attributes[0][element?.target] = element?.image;
      } else {
        metadatas[element.target] = element?.image;
      }
    }
  }

  console.log(metadatas);
  console.log(refreshArr);
  let allowed = false;
  for (let index = 0; index < refreshArr.length; index++) {
    const element = refreshArr[index];
    console.log(element);
    console.log(metadatas?.[element?.target]);
    if (
      metadatas?.[element?.target] != element?.value &&
      metadatas?.[element?.target] !== undefined
    ) {
      allowed = true;
      metadatas?.attributes?.[0]?.[element?.target] === element?.value;
    } else if (
      metadatas?.attributes?.[0]?.[element?.target] != element?.value &&
      metadatas?.attributes?.[0]?.[element?.target] !== undefined
    ) {
      allowed = true;
      metadatas?.attributes?.[0]?.[element?.target] === element?.value;
    }
  }
  if (!allowed) {
    throw new Error("Error metadatas: Nothing to update !");
  }

  console.log("metadatas create uri ", metadatas);

  const formData = new FormData();
  formData.append("pinataMetadata", JSON.stringify(metadatas?.name));
  formData.append("pinataOptions", JSON.stringify(pinataOptions));
  formData.append("pinataContent", JSON.stringify(metadatas));
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: "f77b863f0d06b51f0c63",
        pinata_secret_api_key: `be5170c1049d407a0bdbd0a8b8a077c88aa5927aaade281ee9fe390e5cd1389d`,
      },
    }
  );
  console.log("response", response);

  return response.data.IpfsHash;
};

export let createURI = async ({ id, title, images, metadatas }) => {
  const pinataMetadata = {
    name: "Work3 - " + title + "#" + id,
  };
  const pinataOptions = {
    cidVersion: 0,
  };
  if (!id || !title || !metadatas) {
    throw new Error("Error metadatas: Missing value !");
  }

  for (let index = 0; index < images?.length; index++) {
    const element = images[index];
    if (element?.image?.size > 0) {
      let uri = await createImageCIDOnPinata(element.image, {
        name: "Work3 - Img " + title + "#" + id,
      });
      if (element?.attributes) {
        metadatas.attributes[0][element?.target] = uri;
      } else {
        metadatas[element.target] = uri;
      }
    } else {
      if (element?.attributes) {
        metadatas.attributes[0][element?.target] = element?.image;
      } else {
        metadatas[element.target] = element?.image;
      }
    }
  }

  metadatas.name = pinataMetadata.name;
  metadatas.attributes[0].createdAt =
    metadatas?.attributes?.[0]?.createdAt || Date.now();
  console.log("metadatas create uri ", metadatas);
  console.log("metadatas create azeuri ", pinataMetadata);
  console.log("metadatas create uridqsd ", pinataGateway);
  console.log("metadatas create uriqsdqs ", pinataOptions);
  const formData = new FormData();
  formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
  formData.append("pinataOptions", JSON.stringify(pinataOptions));
  formData.append("pinataContent", JSON.stringify(metadatas));
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: "f77b863f0d06b51f0c63",
        pinata_secret_api_key: `be5170c1049d407a0bdbd0a8b8a077c88aa5927aaade281ee9fe390e5cd1389d`,
      },
    }
  );
  console.log("respone", response);

  return response.data.IpfsHash;
};

export let createURICv = async (form) => {
  let id =
    form?.id > 0
      ? form?.id
      : parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["cvsHub"]]));

  let images = [];

  if (form?.cvImg) {
    images.push({ target: "cvImg", image: form?.cvImg, attributes: true });
  }
  if (form?.banniere) {
    images.push({
      target: "banniere",
      image: form?.banniere,
      attributes: true,
    });
  }
  if (form?.image) {
    images.push({ target: "image", image: form?.image });
  }

  let metadatas = {
    username: form.username,
    description: form.description,
    attributes: [
      {
        visibility: form.visibility,
        banniere: form.banniere,
        identity: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          dateOfBirth: form.dateOfBirth,
          citizen: form.citizen,
        },
        social: {
          linkedin: form.linkedin,
          github: form.github,
          twitter: form.twitter,
          facebook: form.facebook,
        },
        languages: form.languges,
        skills: form.skills,
        domain: form.domain,
      },
    ],
  };

  if (form?.cvImg)
    return await createURI({ id, title: "CV", images, metadatas });
};

export let createURIPub = async (form) => {
  let id =
    form?.id ||
    parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["pubsHub"]])) + 1;
  let images = [];
  if (form?.image) {
    images.push({ target: "image", image: form.image });
  }

  let uri = await createURI({
    id,
    title: "Pub",
    images,
    metadatas: {
      description: form.description,
      title: form?.title,
      attributes: [
        {
          owner: form?.owner,
          missionID: form?.missionID,
          answerID: form?.answerID,
          language: form?.language,
          tags: form?.tags,
          code: form?.code,
        },
      ],
    },
  });
  return uri;
};

export let createURIFeature = async (form) => {
  let id =
    form?.id ||
    parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["featuresHub"]])) + 1;
  let images = [];
  if (form?.image) {
    images.push({ target: "image", image: form.image });
  }
  let uri = await createURI({
    id,
    title: "Feature",
    images,
    metadatas: {
      description: form.description,
      title: form.title,
      attributes: [
        {
          domain: form.domain,
          experience: form.experience,
        },
      ],
    },
  });
  return uri;
};

export let createURILaunchpad = async (form) => {
  let id =
    form?.id ||
    parseInt(await _apiGet("tokensLengthOf", [ADDRESSES["launchpadHub"]])) + 1;

  let metadatas = {
    title: form?.title,
    description: form?.description,
    attributes: [
      {
        domain: form?.domain,
      },
    ],
  };

  let launchpadURI = await createURI({
    id,
    title: "Launchpad Datas",
    metadatas,
  });

  let images = [];

  if (form?.image) {
    images.push({ image: form?.image, target: "image" });
  }
  if (form?.banniere) {
    images.push({
      image: form?.banniere,
      target: "banniere",
      attributes: true,
    });
  }

  metadatas = {
    title: `Profile ${form?.title}`,
    description: form?.bio,
    attributes: [
      {
        facebook: form?.facebook,
        github: form?.github,
        linkedin: form?.linkedin,
        twitter: form?.twitter,
      },
    ],
  };
  let tokenURI = await createURI({
    id,
    title: "Launchpad Profile",
    metadatas: metadatas,
    images,
  });

  return { launchpadURI, tokenURI };
};
