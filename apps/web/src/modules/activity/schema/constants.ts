export type ActivityMetadata = {
  name: string;
  slug: string;
  image: string | null;
};
export const activityTypes = [
  "team",
  // 1. 团队的筹备书
  "team_creation_proposal",
  // 2. 成立团队成功
  "team_created",
  // 3. 团队的评级提升通知
  // 4. 团队的解散通知，
  "team_deleted",
  // // 5. 团队的发起团建通知
  // // 6. 团队的团建完成通知
  // "team_dismissal",
  // "team_upgrade",
  // 团建意愿书
  "project",
  // 1. 创建了一个项目
  "project_created",
  // 2. 发布了一个版本
  "project_version_published",
  // 3. 删除了一个项目
  "project_deleted",
  // 招募施工者 ing
  // "project_contributor_recruitment",
  // 招募施工者 ed
  // "project_contributor_recruited",
] as const;
export type ActivityType = (typeof activityTypes)[number];
