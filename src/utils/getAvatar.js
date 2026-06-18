import { avataaars } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

export const getAvatar = ({ typeAvatar = avataaars, seed, configs }) => {
  return createAvatar(typeAvatar, {
    ...configs,
    seed
  })
}

export const toFormat = (avatar, format = 'svg') => {
  if (!avatar) return ''
  if (format === 'png') {
    return avatar.toDataUri()
  }
  if (format === 'jpg' || format === 'jpeg') {
    return avatar.toDataUri()
  }
  return avatar.toDataUriSync()
}
