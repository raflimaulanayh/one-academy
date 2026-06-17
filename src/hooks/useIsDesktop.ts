import { useMedia } from 'react-use'

export const useIsDesktop = (width?: string) => {
  const isDesktop = useMedia(width ?? '(min-width: 1024px)')

  return isDesktop
}
