import { InputNumber, InputText, InputTextArea } from "components/inputs";
import { LaunchpadAllowance } from "components/inputs/inputsLaunchpad/LaunchpadAllowance";
import { LaunchpadMetadata } from "components/inputs/inputsLaunchpad/LaunchpadMetadata";
import { LaunchpadRound } from "components/inputs/inputsLaunchpad/LaunchpadRound";
import { MyModal } from "components/modal/MyModal";
import { IntTierDatas } from "constants/interfaces";
import { ethers } from "ethers";
import React, { useState } from "react";
import { calcTierAverage } from "utils/ui-tools/launchpad-tools";
import { createPubOnPinata } from "utils/ui-tools/pinata-tools";
import {
  _getterAccessControl,
  _setterAccessControl,
} from "utils/ui-tools/web3-tools";
import { CreationLaunchpad } from "./CreationLaunchpad";
import { ListLaunchpad } from "./ListLaunchpad";

export const Launchpad = () => {
  return (
    <div>
      <CreationLaunchpad />
      <ListLaunchpad />
    </div>
  );
};
