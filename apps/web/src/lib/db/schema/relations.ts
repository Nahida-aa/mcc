import {
  organization,
  project,
  projectMember,
  version,
  user,
  userFollow,
  versionFile,
  session,
  account,
  twoFactor,
  member,
  invitation,
  apikey,
} from "@/lib/db/schema"
import { file } from "@/modules/upload/schema/file"
// import { defineRelations } from "drizzle-orm"; // v2
import { relations } from "drizzle-orm"

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  twoFactors: many(twoFactor),
  members: many(member),
  invitations: many(invitation),
  apikeys: many(apikey),
  projects: many(project),
  followers: many(userFollow, {
    relationName: "user_follow_target",
  }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}))

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}))

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}))

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}))

export const apikeyRelations = relations(apikey, ({ one }) => ({
  user: one(user, {
    fields: [apikey.userId],
    references: [user.id],
  }),
}))

export const userFollowRelations = relations(userFollow, ({ one }) => ({
  owner: one(user, {
    fields: [userFollow.ownerId],
    references: [user.id],
  }),
  target: one(user, {
    fields: [userFollow.targetId],
    references: [user.id],
  }),
}))

export const projectRelations = relations(project, ({ one, many }) => ({
  owner: one(user, { fields: [project.ownerId], references: [user.id] }),
  members: many(projectMember),
}))
export const projectVersionRelations = relations(version, ({ many }) => ({
  versionFiles: many(versionFile),
}))
export const versionFileRelations = relations(versionFile, ({ one }) => ({
  version: one(version, {
    fields: [versionFile.versionId],
    references: [version.id],
  }),
  file: one(file, {
    fields: [versionFile.fileId],
    references: [file.id],
  }),
}))
export const fileRelations = relations(file, ({ one, many }) => ({
  uploader: one(user, { fields: [file.uploaderId], references: [user.id] }),
  versionFiles: many(versionFile),
}))

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
  user: one(user, { fields: [projectMember.userId], references: [user.id] }),
  organization: one(organization, {
    fields: [projectMember.organizationId],
    references: [organization.id],
  }),
  project: one(project, {
    fields: [projectMember.projectId],
    references: [project.id],
  }),
}))
