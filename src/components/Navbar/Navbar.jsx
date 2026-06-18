import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  Settings,
  Pencil,
  Menu,
  Sparkles
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ModeToggle } from '@/components/theme/ModeToggle'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/', label: 'Inicio', Icon: Home, end: true },
  { to: '/avatars', label: 'Galería', Icon: Users },
  { to: '/editar', label: 'Editar', Icon: Pencil },
  { to: '/preferencias', label: 'Preferencias', Icon: Settings }
]

function DesktopLink ({ to, label, Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'group relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          isActive
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden
            data-icon="inline-start"
            className={cn(
              'transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <span>{label}</span>
          <span
            aria-hidden
            className={cn(
              'absolute inset-x-2 -bottom-px h-0.5 origin-left rounded-full bg-primary transition-transform duration-200',
              isActive ? 'scale-x-100' : 'scale-x-0'
            )}
          />
        </>
      )}
    </NavLink>
  )
}

function MobileLink ({ to, label, Icon, end, onSelect }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onSelect}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground/80 hover:bg-muted hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden
            className={cn(
              'transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function Navbar () {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50"
    >
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        <Logo />

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex md:items-center md:gap-1"
        >
          {LINKS.map((l) => (
            <DesktopLink key={l.to} {...l} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            asChild
            size="sm"
            className="group/cta relative h-9 gap-1.5 overflow-hidden rounded-full border-0 px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/40 active:scale-100 hover:[animation:none] [animation:var(--animate-cta-pulse)]"
            style={{
              backgroundImage:
                'linear-gradient(120deg, var(--primary) 0%, var(--accent) 100%)'
            }}
          >
            <Link to="/" aria-label="Ir al generador de avatares">
              <Sparkles
                data-icon="inline-start"
                className="transition-transform group-hover/cta:rotate-12 group-hover/cta:scale-110"
                aria-hidden
              />
              <span>Generar</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover/cta:translate-x-full"
              />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menú de navegación"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full max-w-xs flex-col gap-0 p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-border/60 p-4">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Menú principal de navegación
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Navegación móvil"
                className="flex flex-col gap-1 p-3"
              >
                {LINKS.map((l) => (
                  <MobileLink
                    key={l.to}
                    {...l}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </nav>
              <div className="mt-auto border-t border-border/60 p-4">
                <Button
                  asChild
                  size="lg"
                  className="group/cta relative w-full overflow-hidden rounded-xl border-0 text-base font-semibold text-primary-foreground shadow-md shadow-primary/30"
                  style={{
                    backgroundImage:
                      'linear-gradient(120deg, var(--primary) 0%, var(--accent) 100%)'
                  }}
                >
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    aria-label="Ir al generador de avatares"
                  >
                    <Sparkles
                      data-icon="inline-start"
                      className="transition-transform group-hover/cta:rotate-12 group-hover/cta:scale-110"
                      aria-hidden
                    />
                    <span>Generar nuevo avatar</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover/cta:translate-x-full"
                    />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
