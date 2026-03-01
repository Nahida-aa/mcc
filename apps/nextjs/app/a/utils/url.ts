import type { ReadonlyURLSearchParams } from "next/navigation";

export const addSearchParams = (
  url: string,
  searchParams: ReadonlyURLSearchParams | null,
) => {
  const searchString = searchParams?.toString();
  if (searchString) {
    // console.log('searchParams:', searchParams, searchString, searchString.length);
    return `${url}${url.includes("?") ? "&" : "?"}${searchString}`;
  }
  return url;
};

// class UrlBuilder {
//   private url: URL;

//   constructor(
//     pathname: string,
//     searchParams?: URLSearchParams | ReadonlyURLSearchParams | string,
//   ) {
//     this.url = new URL(pathname);

//     // 如果传入了初始 searchParams，合并进去
//     if (searchParams) {
//       const newParams = new URLSearchParams(searchParams);
//       newParams.forEach((value, key) => {
//         this.url.searchParams.append(key, value);
//       });
//     }
//   }

//   // 核心：链式调用的 set
//   set(key: string, value: string | number | null | undefined): UrlBuilder {
//     if (value === null || value === undefined) {
//       this.url.searchParams.delete(key);
//     } else {
//       this.url.searchParams.set(key, String(value));
//     }
//     return this; // 返回 this 以支持链式调用
//   }

//   // 支持追加（如果同一个 key 有多个值）
//   append(key: string, value: string | number): UrlBuilder {
//     this.url.searchParams.append(key, String(value));
//     return this;
//   }

//   // 删除
//   remove(key: string): UrlBuilder {
//     this.url.searchParams.delete(key);
//     return this;
//   }

//   // 输出最终字符串
//   toString(): string {
//     // 获取 path + query
//     return this.url.pathname + this.url.search;
//   }
// }

// 导出辅助函数，方便调用
export const buildUrl = (
  url: string,
  searchParams?: ReadonlyURLSearchParams | URLSearchParams | null,
) => {
  const searchString = searchParams?.toString();
  if (searchString) {
    // console.log('searchParams:', searchParams, searchString, searchString.length);
    return `${url}${url.includes("?") ? "&" : "?"}${searchString}`;
  }
  return url;
};

export const buildSearchParams = (
  key: string,
  value: string | number | null | undefined,
  searchParams?: URLSearchParams | ReadonlyURLSearchParams | string,
) => {
  const newParams = new URLSearchParams(searchParams);
  newParams.set(key, String(value));
  return newParams;
};
