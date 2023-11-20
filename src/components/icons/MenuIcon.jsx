export const MenuIcon = ({ width = 24, height = 24, strokeColor = '#0A0C0D', ...params }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke={strokeColor}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...params}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l16 0" />
      <path d="M4 12l16 0" />
      <path d="M4 18l16 0" />
    </svg>
  )
}
