import { ServerImage } from '@/components/uix/ServerImage'
import { Box } from 'lucide-react'

export const ProjectIcon = ({
  icon,
  name = 'img',
  size,
}: {
  icon?: string | null
  name?: string
  size: number
}) => {
  return icon ? (
    <ServerImage
      src={icon}
      alt={name}
      width={size}
      height={size}
      className={`size-${size / 4} rounded-lg object-cover `}
    />
  ) : (
    <div className="size-fit rounded-lg bg-card flex items-center justify-center border">
      <Box className="text-muted-foreground" size={size} />
    </div>
  )
}
