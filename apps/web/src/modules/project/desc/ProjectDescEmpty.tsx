import { Button } from '@/components/uix/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ArrowUpRightIcon, BookOpen } from 'lucide-react'

export default function ProjectDescEmpty({ addDescLink }: { addDescLink: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <BookOpen size={32} />
        </EmptyMedia>
        <EmptyTitle>添加描述</EmptyTitle>
        <EmptyDescription>帮助对此项目感兴趣的人了解您的项目</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button href={addDescLink} variant="default">
          添加描述
        </Button>
      </EmptyContent>
    </Empty>
  )
}
