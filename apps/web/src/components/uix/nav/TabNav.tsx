// "use client";
// import { buildUrl } from "@/lib/util/url";
// import { iconMap, type NavItem } from ".";
// import { Tab, Tabs, type TabsProps } from "@heroui/react";
// import {
//   usePathname,
//   useRouter,
//   useSearchParams,
//   useSelectedLayoutSegment,
//   useSelectedLayoutSegments,
// } from "next/navigation";

// export const TabNav = ({
//   basePath = "",
//   baseSegment,
//   isVertical = false,
//   items,
//   withIcon = true,
//   includeSubPath = false,
//   classNames,
// }: TabsProps<NavItem> & {
//   basePath?: string;
//   baseSegment?: string;
//   withIcon?: boolean;
//   includeSubPath?: boolean;
//   classNames?: {
//     ul?: string;
//   };
//   // items: NavItem[]
// }) => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const segment = useSelectedLayoutSegment();
//   const segments = useSelectedLayoutSegments();
//   const searchParams = useSearchParams();

//   const currentKey = [baseSegment, ...segments].join("/");
//   return (
//     <Tabs
//       aria-label="SideNav"
//       isVertical={isVertical}
//       selectedKey={currentKey}
//       variant="light"
//       color="primary"
//       classNames={{
//         base: "h-full",
//       }}
//     >
//       {items?.map((item) => {
//         const Icon = item.icon ?? iconMap[item.key];
//         const itemPath = `${basePath}/${item.key}`;
//         item.label = item.label ?? item.key;
//         return (
//           <Tab
//             onClick={() => router.push(buildUrl(itemPath, searchParams))}
//             key={item.key}
//             title={
//               <div className="flex items-center justify-between w-full min-w-0">
//                 <div className="flex items-center gap-3 min-w-0 flex-1">
//                   {/* <item.icon
//                   className={`
//                       w-4 h-4 flex-shrink-0  duration-200
//                     `}
//                 /> */}
//                   {withIcon && Icon && <Icon size={16} />}
//                   <div className="flex flex-col items-start min-w-0 flex-1">
//                     <span
//                       className={`
//                         text-sm font-medium truncate
//                       `}
//                     >
//                       {item.label}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             }
//           />
//         );
//       })}
//     </Tabs>
//   );
// };
