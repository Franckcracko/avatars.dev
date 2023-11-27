import { avataaars } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

export const getAvatar = ({ typeAvatar = avataaars, seed, configs }) => {
  return createAvatar(typeAvatar, {
    ...configs,
    seed
  }
  )
}
