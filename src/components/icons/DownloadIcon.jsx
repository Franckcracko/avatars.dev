export const DownloadIcon = ({ width = 24, height = 24, strokeColor = '#1C5052', ...params }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...params}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 20l16 0" />
      <path d="M12 14l0 -10" />
      <path d="M12 14l4 -4" />
      <path d="M12 14l-4 -4" />
    </svg>
  )
}
