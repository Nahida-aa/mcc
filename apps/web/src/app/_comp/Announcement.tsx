import { NoStyleLink } from '@/components/uix/html'
import { ServerImage } from '@/components/uix/ServerImage'
import { aDefault } from '@/components/html/css'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export const Announcement2 = () => {
  return (
    <section className="flex gap-4 my-2 justify-center h-fit">
      <div className="relative">
        {/* 告示牌主板 */}
        <div
          className="bg-yellow-200 border-4 border-yellow-700 rounded-lg shadow-lg px-8 py-4 min-w-[320px] max-w-full font-minecraft text-brown-900 text-center relative"
          style={{
            fontFamily: "'Minecraftia', 'monospace', 'SimHei', 'Arial'",
            boxShadow: '0 4px 12px #0004',
            // 可选：模拟木纹
            backgroundImage:
              'repeating-linear-gradient(90deg, #f7e09c 0 10px, #e2b86b 10px 20px)',
          }}
        >
          {/* 钉子装饰 */}
          <span className="absolute left-2 top-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          <span className="absolute right-2 top-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          <span className="absolute left-2 bottom-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          <span className="absolute right-2 bottom-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          {/* 内容 */}
          <div className="mb-2">
            <ServerImage
              className="mx-auto mb-2 dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={28}
              priority
            />
            <h1 className="text-2xl font-bold mb-1">MC联合创作论坛</h1>
            <p className="text-sm mb-1">创作者们的联合创作基地</p>
            <p className="text-base">保持自己的热情 珍惜每一份情谊</p>
            <p className="text-base">好好的做出计划 陪伴着彼此生长</p>
          </div>
        </div>
      </div>
      {/* 右侧内容可保留原样 */}
      <section className="flex flex-col space-y-4 min-w-fit">
        {/* ...原有内容... */}
      </section>
    </section>
  )
}

export const Announcement = () => {
  console.log('Announcement rendered')
  return (
    <section className="flex flex-col md:flex-row gap-6  max-w-fit justify-center items-center relative h-88 min-h-88">
      {/* 主告示牌 */}
      <div className="relative">
        {/* 木桩支撑 */}
        {/* <div className="absolute left-1/2 -bottom-20 w-8 h-24 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div> */}

        <Card className="p-3  shadow-lg relative z-10  ">
          <CardHeader className="flex p-1 justify-center items-center">
            <NoStyleLink
              href="/"
              className="relative flex  items-center justify-center gap-3 w-80 h-20 mb-2"
            >
              <ServerImage
                src="/announcement.png"
                alt="MC联合创作论坛 Logo"
                width={80}
                height={80}
                // priority
              />
              <div className="flex flex-col justify-center items-center">
                <h2 className="tracking-widest text-3xl">联合创作平台</h2>
                <h3 className="">Union Creation Platform</h3>
              </div>
            </NoStyleLink>
          </CardHeader>
          <CardContent className="p-2 pt-0 w-full flex-1 rounded-md  minecraft-text">
            <h1 className="text-center text-2xl   leading-relaxed font-bold  ">
              重构交互网的联合创作平台
            </h1>
            <p className="text-sm text-center  my-2">热爱mc的伙伴们的家</p>
            <p className="text-nowrap text-lg text-center">
              保持自己的热情 珍惜每一份情谊
            </p>
            <p className="text-nowrap text-lg text-center">
              陪伴着彼此成长 共同创作好作品
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 小告示牌 */}
      <section className="flex flex-col space-y-6 min-w-fit">
        {/* 迎新资料告示牌 */}
        <div className="relative">
          {/* 木桩支撑 */}
          {/* <div className="absolute left-1/2 -bottom-12 w-6 h-16 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div> */}

          <Card className="p-3 shadow-lg relative z-10 ">
            <CardContent className="p-3 h-full flex flex-col gap-2">
              <h2 className="text-center  font-bold ">用户须知</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                <li className="text-nowrap text-xs  minecraft-text">
                  <Link href="/legal/terms" className={aDefault}>
                    用户服务协议
                  </Link>
                </li>
                <li className="text-nowrap text-xs  minecraft-text">
                  <Link href="/legal/privacy" className={aDefault}>
                    用户隐私政策
                  </Link>
                </li>
                <li className="text-nowrap text-xs  minecraft-text">平台使用说明</li>
                <li className="text-nowrap text-xs  minecraft-text">平台创作规范</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 平台寄语告示牌 */}
        <div className="relative">
          {/* 木桩支撑 */}
          {/* <div className="absolute left-1/2 -bottom-14 w-6 h-16 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div> */}

          <Card className="p-3  shadow-lg relative z-10 ">
            <CardContent className=" rounded-md p-3 flex flex-col gap-2 h-full ">
              <h2 className="text-center  font-bold ">平台寄语</h2>
              <p className="text-xs   text-center minecraft-text">
                欢迎来到我的世界创作平台
              </p>
              <p className="text-xs  text-center minecraft-text">
                {/* 平台寄语，平台寄语 */}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  )
}
export const Announcement1 = () => {
  console.log('MinecraftAnnouncement rendered')
  return (
    <section className="flex flex-col md:flex-row gap-6 mb-8 max-w-fit justify-center items-center relative h-80">
      {/* 主告示牌 */}
      <div className="relative">
        {/* 木桩支撑 */}
        <div className="absolute left-1/2 -bottom-20 w-8 h-24 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div>

        <Card className="p-3 border-4 border-[#5D4037] bg-[#A1887F] shadow-lg relative z-10 transform rotate-1 minecraft-sign">
          <CardHeader className="flex p-2 justify-center items-center">
            <div className="relative w-60 h-20 mb-2">
              <ServerImage
                className="minecraft-pixel-image"
                src="/mc-forum-logo-pixel.svg"
                alt="MC联合创作论坛 Logo"
                width={240}
                height={80}
                priority
              />
            </div>
          </CardHeader>
          <CardContent className="w-fit bg-[#D7CCC8] py-3 px-4 flex-1 rounded-md border-2 border-[#8D6E63] minecraft-text">
            <h1 className="text-center text-2xl md:text-3xl leading-relaxed font-bold text-[#5D4037] minecraft-heading">
              MC联合创作论坛
            </h1>
            <p className="text-sm text-center text-[#795548] my-2">
              创作者们的联合创作基地
            </p>
            <p className="text-nowrap text-lg text-[#5D4037]">
              保持自己的热情 珍惜每一份情谊
            </p>
            <p className="text-nowrap text-lg text-[#5D4037]">
              好好的做出计划 陪伴着彼此生长
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 小告示牌 */}
      <section className="flex flex-col space-y-6 min-w-fit">
        {/* 迎新资料告示牌 */}
        <div className="relative">
          {/* 木桩支撑 */}
          <div className="absolute left-1/2 -bottom-12 w-6 h-16 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div>

          <Card className="p-3 border-4 border-[#5D4037] bg-[#A1887F] shadow-lg relative z-10 transform -rotate-1 minecraft-sign">
            <div className="bg-[#D7CCC8] rounded-md p-2 border-2 border-[#8D6E63]">
              <CardHeader className="p-2 mb-0">
                <CardTitle className="text-center text-base leading-none font-bold text-[#5D4037] minecraft-heading">
                  迎新资料
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 mb-1">
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">
                    平台用户协议
                  </li>
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">
                    平台介绍资料
                  </li>
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">
                    平台规章制度
                  </li>
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">
                    平台用户守则
                  </li>
                </ul>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* 平台寄语告示牌 */}
        <div className="relative">
          {/* 木桩支撑 */}
          <div className="absolute left-1/2 -bottom-14 w-6 h-16 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div>

          <Card className="p-3 border-4 border-[#5D4037] bg-[#A1887F] shadow-lg relative z-10 transform rotate-2 minecraft-sign">
            <CardContent className="bg-[#D7CCC8] rounded-md p-3 h-full border-2 border-[#8D6E63]">
              <h2 className="text-center text-[#5D4037] font-bold ">平台寄语</h2>
              <p className="text-xs text-[#795548] mt-2 text-center minecraft-text">
                欢迎来到我的世界创作社区
              </p>
              <p className="text-xs text-[#795548] mt-2 text-center minecraft-text">
                {/* 平台寄语，平台寄语 */}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  )
}
