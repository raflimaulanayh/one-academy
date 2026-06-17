export const menuVar = (reduce: boolean) => ({
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: reduce ? 0 : 0.22,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      when: 'afterChildren',
      staggerChildren: reduce ? 0 : 0.04,
      staggerDirection: -1 as const
    }
  },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: reduce ? 0 : 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      when: 'beforeChildren',
      staggerChildren: reduce ? 0 : 0.06,
      delayChildren: reduce ? 0 : 0.04
    }
  }
})

export const menuItemVar = (reduce: boolean) => ({
  closed: { opacity: 0, y: reduce ? 0 : -8 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduce ? 0 : 0.24,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number]
    }
  }
})
