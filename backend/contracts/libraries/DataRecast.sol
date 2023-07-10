// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {DataTypes} from "./DataTypes.sol";
import {Constants} from "./Constants.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library DataRecast {
    function castMetadata(
        DataTypes.ProfileData memory data
    ) internal view returns (string memory) {
        string memory metadata = string(
            abi.encodePacked(
                Constants.PROFILE_NAME_PREFIX,
                "{",
                data.name,
                "}",
                Constants.PROFILE_IMAGE_PREFIX,
                "{",
                data.imgURI,
                "}"
            )
        );

        return metadata;
    }

    

    function castPubMetadata(
        DataTypes.PubData memory _datas
    ) internal view returns (string memory) {
        string memory metadata = string( abi.encodePacked(
            Constants.PROFILE_NAME_PREFIX,
            "{",
            _datas.title,
            "}",
            Constants.PROFILE_CONTENT_PREFIX,
            "{",
            _datas.content,
            "}",
            Constants.PROFILE_IMAGE_PREFIX,
            "{",
            _datas.imgURI,
            "}",
            Constants.PROFILE_PUBLISHER_PREFIX,
            "{",
            _datas.publisher,
            "}",
            Constants.PROFILE_FOLLOWERS_PREFIX,
            "{",
            _datas.followers,
            "}"
        ));
        return metadata;
    }
}
