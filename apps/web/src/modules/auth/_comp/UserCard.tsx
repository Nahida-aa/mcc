'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  MessageCircle,
  UserPlus,
  MoreHorizontal,
  Shield,
  Crown,
  Zap,
  Gamepad2,
} from 'lucide-react'

// Status indicator variants
const statusVariants = cva(
  'absolute bottom-0 right-0 size-4 rounded-full border-[3px] border-[#232428]',
  {
    variants: {
      status: {
        online: 'bg-[#23a55a]',
        idle: 'bg-[#f0b232]',
        dnd: 'bg-[#f23f43]',
        offline: 'bg-[#80848e]',
        streaming: 'bg-[#593695]',
      },
    },
    defaultVariants: {
      status: 'online',
    },
  },
)

// Badge variants
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase',
  {
    variants: {
      variant: {
        nitro: 'bg-[#f47fff]/20 text-[#f47fff]',
        boost: 'bg-[#ff73fa]/20 text-[#ff73fa]',
        staff: 'bg-[#5865f2]/20 text-[#5865f2]',
        partner: 'bg-[#5865f2]/20 text-[#5865f2]',
        hypesquad: 'bg-[#faa81a]/20 text-[#faa81a]',
        developer: 'bg-[#5865f2]/20 text-[#5865f2]',
      },
    },
    defaultVariants: {
      variant: 'nitro',
    },
  },
)

// Role pill component
function RolePill({ color, name }: { color: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#2b2d31] px-2 py-1 text-xs font-medium text-[#dbdee1]">
      <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
      {name}
    </span>
  )
}

// Badge component
function Badge({
  icon: Icon,
  tooltip,
  variant,
}: {
  icon: React.ElementType
  tooltip: string
  variant: VariantProps<typeof badgeVariants>['variant']
}) {
  return (
    <span className={cn(badgeVariants({ variant }), 'size-5 p-0')} title={tooltip}>
      <Icon className="size-3" />
    </span>
  )
}

// Activity card component
function ActivityCard({
  type,
  name,
  details,
  state,
  image,
  elapsed,
}: {
  type: 'playing' | 'listening' | 'watching' | 'streaming'
  name: string
  details?: string
  state?: string
  image?: string
  elapsed?: string
}) {
  const typeLabels = {
    playing: 'Playing a game',
    listening: 'Listening to Spotify',
    watching: 'Watching',
    streaming: 'Live on Twitch',
  }

  return (
    <div className="rounded-lg bg-[#1e1f22] p-3">
      <h4 className="mb-2 text-xs font-semibold uppercase text-[#b5bac1]">
        {typeLabels[type]}
      </h4>
      <div className="flex gap-3">
        {image && (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#2b2d31]">
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className="size-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#f2f3f5]">{name}</p>
          {details && <p className="truncate text-xs text-[#b5bac1]">{details}</p>}
          {state && <p className="truncate text-xs text-[#b5bac1]">{state}</p>}
          {elapsed && <p className="mt-1 text-xs text-[#80848e]">{elapsed}</p>}
        </div>
      </div>
    </div>
  )
}

// Main user card props
export interface DiscordUserCardProps {
  username: string
  displayName?: string
  discriminator?: string
  avatarUrl?: string
  bannerUrl?: string
  bannerColor?: string
  status?: 'online' | 'idle' | 'dnd' | 'offline' | 'streaming'
  customStatus?: string
  aboutMe?: string
  memberSince?: string
  roles?: Array<{ name: string; color: string }>
  badges?: Array<{
    icon: React.ElementType
    tooltip: string
    variant: VariantProps<typeof badgeVariants>['variant']
  }>
  activity?: {
    type: 'playing' | 'listening' | 'watching' | 'streaming'
    name: string
    details?: string
    state?: string
    image?: string
    elapsed?: string
  }
  note?: string
  mutualServers?: number
  mutualFriends?: number
  onMessage?: () => void
  onAddFriend?: () => void
  onMore?: () => void
  className?: string
}

export function Banner({
  bannerUrl,
  bannerColor = '#a6e3a1',
  className,
}: {
  bannerUrl?: string
  bannerColor?: string | null
  className?: string
}) {
  return (
    <div
      className={cn(`relative h-25 w-full bg-cover bg-center bg-primary`, className)}
      style={{
        backgroundColor: bannerUrl ? undefined : bannerColor || '#a6e3a1',
        backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
      }}
    />
  )
}

export function UserCard({
  username,
  displayName,
  discriminator,
  avatarUrl,
  bannerUrl,
  bannerColor = '#5865f2',
  status = 'online',
  customStatus,
  aboutMe,
  memberSince,
  roles = [],
  badges = [],
  activity,
  note,
  mutualServers,
  mutualFriends,
  onMessage,
  onAddFriend,
  onMore,
  className,
}: DiscordUserCardProps) {
  return (
    <div className={cn('w-85 overflow-hidden rounded-lg bg-card shadow-xl', className)}>
      {/* Banner, 横幅 */}
      <Banner bannerUrl={bannerUrl} bannerColor={bannerColor} />

      {/* Avatar section */}
      <div className="relative px-4">
        <div className="absolute -top-9.5 left-4">
          <div className="relative">
            <Avatar className="size-19 border-[6px] border-[#232428]">
              <AvatarImage
                src={avatarUrl || '/placeholder.svg'}
                alt={displayName || username}
              />
              <AvatarFallback className="bg-[#5865f2] text-xl font-semibold text-white">
                {(displayName || username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className={cn(statusVariants({ status }), 'size-5 border-4')} />
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex justify-end gap-1 pt-2">
            <div className="flex gap-0.5 rounded-md bg-[#111214] p-1">
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  icon={badge.icon}
                  tooltip={badge.tooltip}
                  variant={badge.variant}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User info */}
      <div className="mt-8 px-4 pb-4">
        <div className="rounded-lg bg-[#111214] p-3">
          {/* Name and status */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-[#f2f3f5]">
              {displayName || username}
            </h3>
            <p className="text-sm text-[#b5bac1]">
              {username}
              {discriminator && <span className="text-[#80848e]">#{discriminator}</span>}
            </p>
            {customStatus && (
              <p className="mt-1 text-sm text-[#dbdee1]">{customStatus}</p>
            )}
          </div>

          <Separator className="my-3 bg-[#3f4147]" />

          {/* About Me */}
          {aboutMe && (
            <div className="mb-3">
              <h4 className="mb-1 text-xs font-semibold uppercase text-[#b5bac1]">
                About Me
              </h4>
              <p className="whitespace-pre-wrap text-sm text-[#dbdee1]">{aboutMe}</p>
            </div>
          )}

          {/* Member Since */}
          {memberSince && (
            <div className="mb-3">
              <h4 className="mb-1 text-xs font-semibold uppercase text-[#b5bac1]">
                Discord Member Since
              </h4>
              <p className="text-sm text-[#dbdee1]">{memberSince}</p>
            </div>
          )}

          {/* Activity */}
          {activity && (
            <div className="mb-3">
              <ActivityCard {...activity} />
            </div>
          )}

          {/* Roles */}
          {roles.length > 0 && (
            <div className="mb-3">
              <h4 className="mb-2 text-xs font-semibold uppercase text-[#b5bac1]">
                Roles
              </h4>
              <div className="flex flex-wrap gap-1">
                {roles.map((role, index) => (
                  <RolePill key={index} {...role} />
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          {note !== undefined && (
            <div className="mb-3">
              <h4 className="mb-1 text-xs font-semibold uppercase text-[#b5bac1]">
                Note
              </h4>
              <p className="text-sm text-[#80848e] italic">
                {note || 'Click to add a note'}
              </p>
            </div>
          )}

          {/* Mutual info */}
          {(mutualServers !== undefined || mutualFriends !== undefined) && (
            <div className="flex gap-4 text-xs text-[#b5bac1]">
              {mutualServers !== undefined && <span>{mutualServers} Mutual Servers</span>}
              {mutualFriends !== undefined && <span>{mutualFriends} Mutual Friends</span>}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-3 flex gap-2">
          <Button
            onClick={onMessage}
            className="flex-1 bg-[#5865f2] text-white hover:bg-[#4752c4]"
          >
            <MessageCircle className="mr-2 size-4" />
            Message
          </Button>
          <Button
            onClick={onAddFriend}
            variant="secondary"
            className="bg-[#4e5058] text-white hover:bg-[#6d6f78]"
          >
            <UserPlus className="size-4" />
          </Button>
          <Button
            onClick={onMore}
            variant="secondary"
            className="bg-[#4e5058] text-white hover:bg-[#6d6f78]"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Export a demo component for easy testing
export function UserCardDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center  p-8">
      <div className="flex flex-wrap justify-center gap-8">
        {/* Full featured card */}
        <UserCard
          username="akira_chen"
          displayName="Akira Chen"
          avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=akira"
          bannerColor="#7289da"
          status="online"
          customStatus="Building cool stuff"
          aboutMe="Full-stack developer passionate about React and TypeScript. Currently working on open source projects."
          memberSince="Jan 15, 2019"
          badges={[
            { icon: Crown, tooltip: 'Server Owner', variant: 'nitro' },
            { icon: Zap, tooltip: 'Early Supporter', variant: 'boost' },
            { icon: Shield, tooltip: 'Moderator', variant: 'staff' },
          ]}
          roles={[
            { name: 'Admin', color: '#f47fff' },
            { name: 'Developer', color: '#3ba55c' },
            { name: 'Contributor', color: '#faa81a' },
          ]}
          activity={{
            type: 'playing',
            name: 'Visual Studio Code',
            details: 'Editing discord-user-card.tsx',
            state: 'Workspace: my-project',
            elapsed: '2:34:12 elapsed',
          }}
          mutualServers={5}
          mutualFriends={12}
          onMessage={() => console.log('Message clicked')}
          onAddFriend={() => console.log('Add friend clicked')}
          onMore={() => console.log('More clicked')}
        />

        {/* Minimal card */}
        <UserCard
          username="guest_user"
          displayName="Guest"
          status="idle"
          bannerColor="#43b581"
          memberSince="Dec 1, 2023"
          onMessage={() => console.log('Message clicked')}
          onAddFriend={() => console.log('Add friend clicked')}
          onMore={() => console.log('More clicked')}
        />

        {/* DND status card */}
        <UserCard
          username="busy_dev"
          displayName="Busy Developer"
          avatarUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=busy"
          bannerColor="#ed4245"
          status="dnd"
          customStatus="Do Not Disturb"
          aboutMe="In a meeting. Will respond later."
          badges={[{ icon: Gamepad2, tooltip: 'Active Developer', variant: 'developer' }]}
          activity={{
            type: 'streaming',
            name: 'Live Coding Session',
            details: 'Building a Discord clone',
            elapsed: '45:00 elapsed',
          }}
          onMessage={() => console.log('Message clicked')}
          onAddFriend={() => console.log('Add friend clicked')}
          onMore={() => console.log('More clicked')}
        />
      </div>
    </div>
  )
}
