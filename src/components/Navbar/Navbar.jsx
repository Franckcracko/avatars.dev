import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Settings, Pencil, Menu, Sparkles } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { ModeToggle } from '@/components/theme/ModeToggle'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/', label: 'Inicio', Icon: Home, end: true, hint: 'Ir al generador' },
  { to: '/avatars', label: 'Galería', Icon: Users, hint: 'Explorar galería' },
  { to: '/editar', label: 'Editar', Icon: Pencil, hint: 'Personalizar avatar' },
  {
    to: '/preferencias',
    label: 'Preferencias',
    Icon: Settings,
    hint: 'Ajustes y datos'
  }
]

function DesktopLink ({ to, label, Icon, end, hint }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild className='group/nav'>
        <NavLink to={to} end={end} aria-label={hint}>
          {({ isActive }) => (
            <>
              <Icon
                aria-hidden
                className={cn(
                  'size-4 transition-all duration-300 ease-out',
                  'group-hover/nav:scale-110 group-hover/nav:-rotate-6',
                  'motion-reduce:transform-none',
                  isActive
                    ? 'text-primary drop-shadow-[0_0_6px_var(--brand-glow)]'
                    : 'text-muted-foreground'
                )}
              />
              <span className='relative'>
                <span
                  className={cn(
                    'transition-colors duration-300',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover/nav:text-foreground'
                  )}
                >
                  {label}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 ease-out motion-reduce:transition-none',
                    isActive
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover/nav:scale-x-100'
                  )}
                />
              </span>
            </>
          )}
        </NavLink>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

function MobileLink ({ to, label, Icon, end, onSelect, index }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onSelect}
      style={{ animationDelay: `${index * 55}ms` }}
      className={({ isActive }) =>
        cn(
          'group/item relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out',
          'motion-safe:animate-[sheet-item-in_0.4s_cubic-bezier(0.22,1,0.36,1)_both]',
          isActive
            ? 'bg-gradient-to-r from-primary/12 via-primary/8 to-accent/12 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary),transparent_75%)]'
            : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            aria-hidden
            className={cn(
              'flex size-8 items-center justify-center rounded-md transition-all duration-300 ease-out',
              isActive
                ? 'bg-primary/15 text-primary'
                : 'bg-muted/50 text-muted-foreground group-hover/item:bg-muted group-hover/item:text-foreground group-hover/item:scale-105'
            )}
          >
            <Icon
              aria-hidden
              className='size-4 transition-transform duration-300 ease-out group-hover/item:scale-110 group-hover/item:-rotate-6 motion-reduce:transform-none'
            />
          </span>
          <span className='flex-1'>{label}</span>
          {isActive && (
            <span
              aria-hidden
              className='size-2 rounded-full bg-primary shadow-[0_0_10px_var(--brand-glow)] motion-safe:animate-[pop_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]'
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export function Navbar () {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() !== 'g') return
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      e.preventDefault()
      navigate('/')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [navigate])

  return (
    <header
      role='banner'
      className='sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/50'
    >
      <a href='#main-content' className='skip-link'>
        Saltar al contenido principal
      </a>

      <div className='mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6'>
        <Logo />

        <NavigationMenu
          viewport={false}
          aria-label='Navegación principal'
          className='hidden md:flex'
        >
          <NavigationMenuList className='gap-1'>
            {LINKS.map((l) => (
              <DesktopLink key={l.to} {...l} />
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className='flex items-center gap-2'>
          <ModeToggle />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                size='sm'
                className='group/cta relative h-9 gap-1.5 overflow-hidden rounded-full border-0 px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-lg hover:shadow-primary/40 active:scale-100 [animation:var(--animate-cta-pulse)]'
                style={{
                  backgroundImage:
                    'linear-gradient(120deg, var(--primary) 0%, var(--accent) 100%)'
                }}
              >
                <Link to='/' aria-label='Generar un avatar aleatorio'>
                  <Sparkles
                    data-icon='inline-start'
                    className='size-4 transition-transform duration-300 ease-out group-hover/cta:rotate-12 group-hover/cta:scale-110 motion-reduce:transform-none'
                    aria-hidden
                  />
                  <span>Generar</span>
                  <span
                    aria-hidden
                    className='pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full'
                  />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom' sideOffset={10} className='flex items-center gap-2'>
              <span>Generar nuevo avatar</span>
              <Kbd>G</Kbd>
            </TooltipContent>
          </Tooltip>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='md:hidden'
                aria-label='Abrir menú de navegación'
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='flex w-full max-w-xs flex-col gap-0 p-0 sm:max-w-sm'
            >
              <SheetHeader className='border-b border-border/60 p-4 motion-safe:animate-[sheet-header-in_0.4s_cubic-bezier(0.22,1,0.36,1)_both]'>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className='sr-only'>
                  Menú principal de navegación
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label='Navegación móvil'
                className='flex flex-col gap-1 p-3'
              >
                {LINKS.map((l, i) => (
                  <MobileLink
                    key={l.to}
                    {...l}
                    index={i}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </nav>
              <Separator className='mx-3 w-auto opacity-60' />
              <div className='space-y-2 p-4 motion-safe:animate-[sheet-item-in_0.4s_cubic-bezier(0.22,1,0.36,1)_both]' style={{ animationDelay: '260ms' }}>
                <p className='px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                  Apariencia
                </p>
                <div className='flex items-center justify-between rounded-lg bg-muted/40 p-3'>
                  <span className='text-sm font-medium'>Tema</span>
                  <ModeToggle />
                </div>
              </div>
              <div className='mt-auto border-t border-border/60 p-4 motion-safe:animate-[sheet-item-in_0.4s_cubic-bezier(0.22,1,0.36,1)_both]' style={{ animationDelay: '320ms' }}>
                <Button
                  asChild
                  size='lg'
                  className='group/cta relative w-full overflow-hidden rounded-xl border-0 text-base font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-transform duration-300 ease-out hover:scale-[1.02] active:scale-100'
                  style={{
                    backgroundImage:
                      'linear-gradient(120deg, var(--primary) 0%, var(--accent) 100%)'
                  }}
                >
                  <Link
                    to='/'
                    onClick={() => setOpen(false)}
                    aria-label='Generar un avatar aleatorio'
                  >
                    <Sparkles
                      data-icon='inline-start'
                      className='size-4 transition-transform duration-300 ease-out group-hover/cta:rotate-12 group-hover/cta:scale-110 motion-reduce:transform-none'
                      aria-hidden
                    />
                    <span>Generar nuevo avatar</span>
                    <span
                      aria-hidden
                      className='pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full'
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
