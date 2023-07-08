// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "./DataTypes.sol";
import {Constants} from "./Constants.sol";

library DataRecast {


    function castMetadata(DataTypes.ProfileData memory data) internal view returns(string memory){
        string memory metadata = string(abi.encodePacked(Constants.PROFILE_NAME_PREFIX, "{", data.name, "}", Constants.PROFILE_IMAGE_PREFIX, "{", data.imageURI, "}"));

        return metadata;
    }


}