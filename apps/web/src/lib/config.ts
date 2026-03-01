export const dev = process.env.NODE_ENV === "development";
export const appPort = process.env.PORT || "3000";
// NEXT_PUBLIC_ 用于捆绑 浏览器端环境变量
export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${appPort}`;
export const serverHost = process.env.serverHost || "localhost";
// 转换端口为数字类型，默认为 3333
export const serverPort = Number(process.env.serverPort) || 3333;
export const serverBasePath = process.env.serverBasePath || "api";
export const serverUrl =
  process.env.serverUrl ||
  `http${dev ? "" : "s"}://${serverHost}:${serverPort}`;
export const serverUrlPath = `${serverUrl}/${serverBasePath}`;
export const s3PublicUrl = process.env.NEXT_PUBLIC_S3_URL!

export const imageMaxSize = 1024 * 1024 * 10; // 10MB

export const socketIoAdminPassword =
  process.env.SOCKET_IO_ADMIN_PASSWORD || "admin";

export const title = "联合创作平台";
export const description = "";
export const primaryColor = "#a6e3a1";

// 版权 等 信息
// icp备案
export const icp = process.env.ICP || "冀ICP备2025123950号-1";
// https://beian.miit.gov.cn
export const icpUrl = process.env.ICP_URL || "https://beian.miit.gov.cn";
export const icpImg = process.env.ICP_IMG_URL || "/icp.png";
// https://联合创作平台.cn
const owner = "菲克斯哈尔特重构交互网络（保定）有限公司"; // 版权所属公司或个人
const currentYear = new Date().getFullYear();
export const copyright = `© 2025-${currentYear} ${owner} 版权所有`;
// 公网安备案
export const publicRecord =
  process.env.PUBLIC_RECORD || "冀公网安备13065202000591号";
export const publicRecordUrl =
  process.env.PUBLIC_RECORD_URL ||
  "https://beian.mps.gov.cn/#/query/webSearch?code=13065202000591";
// <a href="https://beian.mps.gov.cn/#/query/webSearch?code=13065202000591" rel="noreferrer" target="_blank">冀公网安备13065202000591号</a>
export const publicRecordImg =
  process.env.PUBLIC_RECORD_IMG_URL || "/public_record.png";
// 冀公网安备13065202000591号

// icp 许可证
// TODO

// 营业执照
// 统一社会信用代码: 91440101MA9XWNRN0L
// 130625199609193413
// 企业对公账户
// 开户行: 保定银行光华支行
// 账户: 60101072010336400
// 开户地点: 河北省, 保定市, 河北省保定市竞秀区百花东路689号

// wx ¥0.67
export const wxAppId = process.env.WX_APP_ID;
// wx pay
export const mchid = process.env.WX_PAY_MCH_ID;
export const serialNo = process.env.WX_PAY_API_SERIAL_NO;
// export const privateKey = process.env.WX_PAY_API_PRIVATE_KEY;
