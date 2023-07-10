const { ethers } = require("ethers");

// Bytes encodés
// const metadata = "0x5469746c65206f66206d7920706f7374546869732069732061207061727420776865726520636f6e74656e742076616c75652073746f7265642e20492063616e2077726974652065766572797468696e6720492077616e7420746f2073686172652061742074686520636f6d6d756e697479206f72206d697373696f6e7320636f6d6d756e697479206f72207072697661746520636f6d6d756e6974792e68747470733a2f2f70696373756d2e70686f746f732f69642f3130302f3230305821aa342bd011e0e77ac5eb8663b052592363a50000000000000000000000000000000000000000000000000000000000000000";


const decodePubMetadata =  (metadata)=>{
    const type = ["string", "string", "string", "address", "uint"];
    console.log(ethers.AbiCoder)
    // return
    function decodeData(metadata, type) {
        const abiCoder = new ethers.AbiCoder()
      const decodedData = abiCoder.decode(type, metadata);
      console.log(decodeData)
      
      return {
    string1: decodedData[0],
    string2: decodedData[1],
    string3: decodedData[2],
    address: decodedData[3],
    uintValue: uintValue.parseInt(10) // Convertir en chaîne de caractères décimale
  };
      
    }
    
    // Décoder les bytes
    const decodedData = decodeData(metadata, type);
    
    return decodedData

}
// Type de données attendu

// Fonction pour décoder les bytes

module.exports={decodePubMetadata}