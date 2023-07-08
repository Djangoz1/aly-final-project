// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "./DataTypes.sol";
import {Constants} from "./Constants.sol";

library DataRecast {


    function castMetadata(DataTypes.ProfileData memory data) internal view returns(string memory){
        string memory metadata = string(abi.encodePacked(Constants.PROFILE_NAME_PREFIX, "{", data.name, "}", Constants.PROFILE_IMAGE_PREFIX, "{", data.imgURI, "}"));

        return metadata;
    }

    function castPubMetadata(DataTypes.PubData memory _datas) internal returns(string memory){
        string memory metadata = string(abi.encodePacked(_datas.title, _datas.content, _datas.imgURI, _datas.publisher, _datas.followers));
        return metadata;
    }


}