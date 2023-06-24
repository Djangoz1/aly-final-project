import { ethers } from "ethers";
export const _getProvider = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider;
  }
};

export const _getSigner = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    return provider.getSigner();
  }
};
