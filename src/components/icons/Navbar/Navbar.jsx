import { useState } from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav>
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
          <ul className="flex flex-col font-medium  bg-primary_color">
            <li>
              <Link to="/" className="block py-2 px-3 text-white_secondary bg-primary_color_dark " aria-current="page">Home</Link>
            </li>
            <li>
              <Link to="/" className="block py-2 px-3   hover:bg-[#43a5a8] transition-colors text-white_secondary ">Services</Link>
            </li>

          </ul>
        </div>
      </div>

      <div className="max-lg:hidden flex bg-primary_color p-4 justify-between">
        <Link to="/" className="text-white font-semibold text-xl flex">
          <h2>AVATARS.DEV</h2>
        </Link>
        <ul className="flex gap-x-4">
          <li className="text-lg font-medium text-white_secondary hover:text-white"><Link to="/">INICIO</Link></li>
          <li className="text-lg font-medium text-white_secondary hover:text-white"><Link to="/">AVATARS</Link></li>
          <li className="text-lg font-medium text-white_secondary hover:text-white"><Link to="/">PREFERENCIAS</Link></li>
        </ul>
      </div>
    </nav>
  )
}
