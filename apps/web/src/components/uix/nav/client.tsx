// // app/tabs/page.tsx
// "use client";

// import { Card, CardBody, Tab, Tabs } from "@heroui/react";
// import { usePathname } from "next/navigation";

// export function ExampleClientRouterWithTabs() {
//   const pathname = usePathname();

//   return (
//     <Tabs aria-label="Options" selectedKey={pathname}>
//       <Tab key="/a" title="a" href="/a">
//         <Card>
//           <CardBody>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//             eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
//             ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
//             aliquip ex ea commodo consequat.
//           </CardBody>
//         </Card>
//       </Tab>
//       <Tab key="/music" title="Music" href="/music">
//         <Card>
//           <CardBody>
//             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
//             reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
//             pariatur.
//           </CardBody>
//         </Card>
//       </Tab>
//       <Tab key="/videos" title="Videos" href="/videos">
//         <Card>
//           <CardBody>
//             Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
//             officia deserunt mollit anim id est laborum.
//           </CardBody>
//         </Card>
//       </Tab>
//     </Tabs>
//   );
// }
