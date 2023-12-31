import { Icon } from "@iconify/react";
import { Button, DropdownMenu } from "@lemonsqueezy/wedges";
import Link from "next/link";
import { v4 } from "uuid";
import { icfy, icfyAI } from "icones";

export const MyBtnDropdown = ({ arr, style, children, disabled }) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          disabled={
            arr?.filter((el) => el?.title).length === 0
              ? true
              : disabled || false
          }
          isIconOnly
          className={style || "h-fit"}
          size="sm"
          variant="tertiary"
        >
          {children || (
            <Icon icon={icfy.ux.dots.horizontal} className={"rotate-90"} />
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="bg-first" align="end" side="top">
        <DropdownMenu.Group>
          {arr
            ?.filter((el) => el?.title)
            ?.map((el) => (
              <Link
                onClick={() => (el?.setter ? el.setter() : null)}
                href={el?.url || "#"}
                key={v4()}
              >
                <DropdownMenu.Item>
                  {el?.icon ? <Icon icon={el.icon} /> : <></>}
                  <span>{el.title}</span>
                  {el?.shortcut ? (
                    <DropdownMenu.Shortcut keys={["command"]}>
                      {el?.shortcut}
                    </DropdownMenu.Shortcut>
                  ) : (
                    <></>
                  )}
                </DropdownMenu.Item>
              </Link>
            ))}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
