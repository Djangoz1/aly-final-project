// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library Constants {
    string internal constant PROFILE_NAME_PREFIX = "__/Name:";
    string internal constant PROFILE_CONTENT_PREFIX = "__/Content:";
    string internal constant PROFILE_IMAGE_PREFIX = "__/Img:";
    string internal constant PROFILE_PUBLISHER_PREFIX = "__/Publisher:";
    string internal constant PROFILE_FOLLOWERS_PREFIX = "__/Followers:";
    uint internal constant MAX_PROFILE_METADATA_SIZE = 6000;
}
