import { ProjectMember } from "../schema/member.t"

export const isProjectMember = (projectMembers: ProjectMember[] = [], userId: string) =>
  projectMembers.some(
    member => member.entityType === "user" && member.user?.id === userId,
  )
export const findProjectMember = (projectMembers: ProjectMember[] = [], userId: string) =>
  projectMembers.find(
    member => member.entityType === "user" && member.user?.id === userId,
  )
