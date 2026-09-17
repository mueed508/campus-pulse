"use client";

import { UserButton } from "@clerk/nextjs";
import { ClockIcon } from "./icons";
import { MyEvents } from "./MyEvents";

export function UserMenu() {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action label="My events" labelIcon={<ClockIcon className="h-4 w-4" />} open="my-events" />
      </UserButton.MenuItems>
      <UserButton.UserProfilePage label="My events" labelIcon={<ClockIcon className="h-4 w-4" />} url="my-events">
        <MyEvents />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}
