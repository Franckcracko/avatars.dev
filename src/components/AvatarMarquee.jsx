import { useMemo } from 'react'
import { getAvatar } from '@/utils/getAvatar'
import { CONFIG_AVATAAARS } from '@/configs/avatar'

export const AvatarMarquee = ({
  count = 24,
  reverse = false,
  speed = 40,
  className = ''
}) => {
  const avatars = useMemo(() => {
    return Array.from({ length: count }, () => {
      const seed = crypto.randomUUID()
      return getAvatar({
        seed,
        configs: { ...CONFIG_AVATAAARS.avataaars.configs_initial, size: 128 }
      }).toDataUriSync()
    })
  }, [count])

  return (
    <div
      className={`relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
      aria-hidden
    >
      <div
        className="flex w-max gap-3"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          willChange: 'transform'
        }}
      >
        {[...avatars, ...avatars].map((uri, i) => (
          <div
            key={i}
            className="grid size-20 shrink-0 place-items-center rounded-2xl border border-border/60 bg-card p-2 shadow-sm sm:size-24"
          >
            <img
              src={uri}
              alt=""
              className="size-full object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
