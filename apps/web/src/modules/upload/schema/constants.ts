export const fileGroup = ['avatar', 'project', 'version', 'other'] as const
export type FileGroup = (typeof fileGroup)[number]
