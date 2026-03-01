"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Pickaxe,
  ScanSearch,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { Tabs } from "@/components/uix/nav/tabs";
// import { Tab, Tabs } from "@heroui/react";
// import Link from 'next/link';

export const UserRoleSwitcher = ({ className = "" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams?.get("role") || "guest"; // 默认角色为 "guest"
  const [value, setValue] = useState(role);
  const items = [
    { label: "游客", value: "guest", icon: UserRound },
    { label: "鉴赏家", value: "connoisseur", icon: ScanSearch },
    { label: "创作者", value: "creator", icon: WandSparkles },
    { label: "施工者", value: "developer", icon: Pickaxe },
    { label: "投资者", value: "investor", icon: BriefcaseBusiness },
  ];
  const onValueChange = (value: string) => {
    setValue(value);
    console.log("onValueChange", value);
    router.push(`?role=${value}`);
  };

  return (
    <nav className={`h-fit z-1 bg-card ${className}`}>
      <Tabs
        aria-label="Tabs variants"
        // variant="light"
        // selectedKey={value}
        className="flex w-full h-12"
        // classNames={{
        //   tabList: "h-12 w-full",
        //   tabContent: "flex items-center gap-2 [&_svg:not([class*='size-'])]:size-4",
        // }}
        items={items}
      >
        {/* {(item) => (
          <Tab
            key={item.key}
            title={
              <>
                <span>{<item.icon />}</span>
                <span>{item.label}</span>
              </>
            }
            value={item.key}
            className="h-9"
            onClick={(e) => onValueChange(item.key)}
          />
        )} */}
      </Tabs>
      {/* <ToggleGroup
        className="min-w-fit w-full h-12 z-1 "
        type="single"
        value={value || "guest"}
        onValueChange={onValueChange}
      >
        {items.map((role) => (
          <ToggleGroupItem
            key={role.key}
            value={role.key}
            aria-label={role.label}
            className="p-2  rounded-md data-[state=on]:text-primary data-[state=on]:bg-transparent hover:bg-accent! [state=on]:hover:bg-accent  hover:text-accent-foreground z-1"
          >
            <span>{<role.icon />}</span>
            <span>{role.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup> */}
    </nav>
  );
};
