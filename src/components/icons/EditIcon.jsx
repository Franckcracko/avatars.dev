export const EditIcon = ({ width = 24, height = 24, strokeColor = '#1C5052', ...params }) => {
  return (
    <svg width={width}
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
      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
      <path d="M16 5l3 3" />
    </svg>
  )
}