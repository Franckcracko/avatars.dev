import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function NotFoundPage () {
  usePageMeta({
    title: 'Página no encontrada (404)',
    description:
      'La página que buscas no existe en Avatars.Dev. Vuelve al inicio para seguir generando avatares únicos.',
    path: '/404',
    noindex: true
  })

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12 text-center sm:px-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Error 404
        </p>
        <h1 className="font-display text-5xl font-bold sm:text-6xl">
          Página <span className="text-gradient-brand">perdida</span>
        </h1>
        <p className="mx-auto max-w-md text-base text-muted-foreground">
          La ruta que buscas no existe o se ha mudado. Vuelve al inicio y
          sigue creando personajes.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link to="/">
            <Home data-icon="inline-start" />
            Ir al inicio
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/avatars">
            <Search data-icon="inline-start" />
            Explorar galería
          </Link>
        </Button>
      </div>
    </div>
  )
}
