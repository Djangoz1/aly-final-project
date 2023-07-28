import {
  _getterAccessControl,
  _setterAccessControl,
} from "utils/ui-tools/web3-tools";
import { CreationLaunchpad } from "./CreationLaunchpad";
import { ListLaunchpad } from "./ListLaunchpad";

import { useRouter } from "next/navigation";
import Link from "next/link";

export const Launchpad = () => {
  return (
    <div className="flex flex-col w-full">
      <Link
        href={"/community/launchpad/create"}
        className="btn-xs w-1/6 items-center ml-auto mb-5 btn btn-primary"
      >
        Create
      </Link>
      <ListLaunchpad />
    </div>
  );
};
