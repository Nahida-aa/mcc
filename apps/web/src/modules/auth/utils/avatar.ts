// https://ui-avatars.com/api/?name=%E4%BD%A0%E5%A5%BD&size=64&background=random
// `https://ui-avatars.com/api/?name=${name}&size=${size}&background=random`
export const getDefaultAvatar = (
  name: string = "null",
  size = 64,
  background?: string,
) => {
  if (background) {
    return `https://ui-avatars.com/api/?name=${name}&size=${size}&background=${background}`;
  }
  return `https://ui-avatars.com/api/?name=${name}&size=${size}`;
};
export const getAvatarByVercel = (name: string, size = 64, background?: string) => {
  // if (background) {
  //   return `https://ui-avatars.com/api/?name=${name}&size=${size}&background=${background}`;
  // }
  return `https://avatar.vercel.sh/${name}` || `https://avatar.vercel.sh/Guest`;
};
