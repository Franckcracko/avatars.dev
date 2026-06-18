import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const labels = {
  light: { label: 'Claro', Icon: Sun },
  dark: { label: 'Oscuro', Icon: Moon },
  system: { label: 'Sistema', Icon: Monitor }
}

const triggerClass = cn(
  'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground size-8 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 transition-all relative dark:border-input dark:bg-input/30 dark:hover:bg-input/50'
)

export function ModeToggle () {
  const { theme, setTheme } = useTheme()
  const current = labels[theme] || labels.system

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Cambiar tema — actual: ${current.label}`}
        className={triggerClass}
      >
        <Sun
          aria-hidden
          className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
        <Moon
          aria-hidden
          className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <span className="sr-only">Cambiar tema</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {Object.entries(labels).map(([key, { label, Icon }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key)}
            className="cursor-pointer"
          >
            <Icon aria-hidden data-icon="inline-start" />
            <span>{label}</span>
            {theme === key && (
              <span className="ml-auto text-xs text-muted-foreground">·</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
