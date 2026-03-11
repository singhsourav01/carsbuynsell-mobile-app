import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
