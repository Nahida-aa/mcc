// 解析 cookie: str -> {k:v, ...}
export const cookieToKV = (cookie: string = ''): { [k: string]: string | undefined } => cookie.split(";").reduce((acc, cur) => {
	const [k, v] = cur.split("=");
	if (k && v) {
		acc[k.trim()] = v.trim();
	}
	return acc;
}, {} as { [k: string]: string | undefined })