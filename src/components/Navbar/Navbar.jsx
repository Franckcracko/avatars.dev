import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getAvatar } from '../../utils/getAvatar'
import { CONFIG_AVATAAARS } from '../../configs/avatar'

const LINKS = [
  { path: '/', label: 'INICIO', active: false },
  { path: '/avatars', label: 'AVATARS', active: false },
  { path: '/preferencias', label: 'PREFERENCIAS', active: false }
]
const useNavBar = () => {
  const [links, setLinks] = useState(LINKS)
  const location = useLocation()
  const updateLink = (path) => {
    const newLinks = links.map(link => ({ ...link, active: path === link.path }))
    setLinks(newLinks)
  }
  useEffect(() => {
    const path = location.pathname
    updateLink(path)
  }, [location.pathname])

  return { links }
}
const NavbarList = ({ links }) => (
  <ul className="flex gap-x-4">
    {links.map((link) => (
      <li className="text-lg font-medium text-white_secondary hover:text-white" key={link.label}><Link to={link.path}>{link.label}</Link></li>
    ))}
  </ul>
)

const NavbarListMobile = ({ links }) => (
  <ul className="flex flex-col font-medium  bg-primary_color">
    {links.map(link => (
      <li key={`${link.label} mobile`}>
        <Link to={link.path} className={`block py-2 transition-colors px-3 text-white_secondary ${link.active ? 'bg-primary_color_dark' : 'hover:bg-[#43a5a8]'}  `} >{link.label}</Link>
      </li>
    ))}
  </ul>
)

export const Navbar = () => {
  const avatar = getAvatar({ seed: crypto.randomUUID(), configs: { ...CONFIG_AVATAAARS.avataaars.configs_initial, size: 24 } })
  const [isOpen, setIsOpen] = useState(false)
  const { links } = useNavBar()
  return (
    <nav>
      {/* Mobile */}
      <div className="max-lg:block hidden max-w-screen-xl  mx-auto ">
        <div className='bg-primary_color p-4 flex flex-wrap items-center justify-between'>
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white_secondary">AVATARS.DEV</span>
          </Link>
          <button onClick={() => setIsOpen(prevState => !prevState)} data-collapse-toggle="navbar-hamburger" type="button" className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-white rounded-lg hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-hamburger" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`${isOpen ? '' : 'hidden'} w-full`} id="navbar-hamburger">
          <NavbarListMobile links={links} />
        </div>
      </div>
      {/* Desktop */}
      <div className="max-lg:hidden flex bg-primary_color p-4 justify-between">
        <Link to="/" className="text-white font-semibold text-xl flex items-center">
          <h2>AVATARS.DEV</h2>
          <img src={avatar.toDataUriSync()} alt='logo avatar'></img>
        </Link>
        <NavbarList links={links} />
      </div>
    </nav>
  )
}
