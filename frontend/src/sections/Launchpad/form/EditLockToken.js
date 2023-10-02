import { _form_create_profile } from "utils/ux-tools/form/profile";
import { MyFormModal } from "components/myComponents/form/MyFormModal";
import { MySteps } from "components/myComponents/MySteps";

import { useAccount } from "wagmi";

import {
  _apiGet,
  _apiGetAt,
  _apiPost,
  _apiPostAt,
} from "utils/ui-tools/web3-tools";
import { useAuthDispatch, useAuthState } from "context/auth";

import {
  MENU_LAUNCHPAD,
  _form_create_launchpad,
  _form_edit_launchpad_lock_token,
} from "utils/ux-tools/form/launchpad";

import { styles, themes } from "styles/style";
import { MyInput } from "components/myComponents/form/MyInput";
import {
  doStateLaunchpad,
  useLaunchpadDispatch,
  useLaunchpadState,
} from "context/hub/launchpad";
import { useEffect, useState } from "react";

export const EditTokenLaunchpad = ({ btn }) => {
  let { address, isConnected } = useAccount();
  let dispatch = useLaunchpadDispatch();
  let { datas, launchpadID } = useLaunchpadState();
  let submitForm = async (form) => {
    let hash = await _apiPostAt({
      func: "approve",
      targetContract: "erc20",
      address: datas.tokenAddress,
      args: [datas.address, parseInt(form.allowance)],
    });

    hash = await _apiPost("lockTokens", [
      launchpadID,
      parseInt(form?.allowance),
    ]);

    doStateLaunchpad(dispatch, launchpadID);
  };

  return (
    <MyFormModal
      stateInit={{
        form: { allowance: null },
        placeholders: { allowance: "300 Tokens" },
        checked: [[], ["allowance"]],
      }}
      submit={submitForm}
      side={<MySteps arr={[MENU_LAUNCHPAD.edit[0]]} />}
      arr={[_form_edit_launchpad_lock_token]}
      styles={{ btn: styles.gbtn + " gb3 btn-xs" }}
      components={[<Form />]}
      btn={btn}
    />
  );
};

let Form = () => {
  let [isBalance, setIsBalance] = useState(null);
  let { cv } = useAuthState();
  let { address } = useAccount();
  let { datas } = useLaunchpadState();
  let fetch = async () => {
    setIsBalance(
      parseInt(
        await _apiGetAt({
          func: "balanceOf",
          args: [address],
          targetContract: "erc20",
          address: datas?.tokenAddress,
        })
      )
    );
  };

  useEffect(() => {
    if (!isBalance) {
      fetch();
    }
  }, [cv]);

  console.log(isBalance);

  return (
    <MyInput target={"allowance"} type={"number"} min={1} max={isBalance} />
  );
};
