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

    function castFeatureMetadata(
        DataTypes.CreationFeatureData memory _datas
    ) internal pure returns (string memory) {
        string memory metadata = string(
            abi.encodePacked(
                "title :{",
                _datas.title,
                "}",
                "content :{",
                _datas.content,
                "}",
                "imgURI :{",
                _datas.imgURI,
                "}",
                "devLanguage :{",
                _datas.devLanguage,
                "}"
            )
        );
        return metadata;
    }

    function castFeatureData(
        DataTypes.CreationFeatureData memory _data
    ) internal pure returns (DataTypes.FeatureData memory) {
        require(_data.wadge > 0, "You must provide a value");
        DataTypes.FeatureData memory _featureData;
        string memory metadata = DataRecast.castFeatureMetadata(_data);
        _featureData.metadata = metadata;
        _featureData.wadge = _data.wadge;
        _featureData.assignedWorker = _data.assignedWorker;
        return _featureData;
    }

    function castPubMetadata(
        DataTypes.PubData memory _datas
    ) internal view returns (string memory) {
        string memory metadata = string(
            abi.encodePacked(
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
            )
        );
        return metadata;
    }
}
