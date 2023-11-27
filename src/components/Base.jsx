import { Navbar } from './Navbar/Navbar'

export const Base = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
