'use client'

import { useEffect, useRef } from 'react'

import { useSplashStore } from '@/hooks/useSplashStore'

export const SplashScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoPathsRef = useRef<(SVGElement | null)[]>([])
  const logoWrapperRef = useRef<HTMLDivElement>(null)
  const finish = useSplashStore((s) => s.finish)

  useEffect(() => {
    let isActive = true
    let tl: { kill: () => void } | null = null

    const runAnim = async () => {
      const { gsap } = await import('gsap')

      if (!isActive) return

      const container = containerRef.current
      const logoWrapper = logoWrapperRef.current
      const paths = logoPathsRef.current.filter(Boolean)

      if (!container || !logoWrapper || paths.length === 0) return

      gsap.set(paths, { opacity: 0 })

      if (paths[2]) {
        gsap.set(paths[0], { opacity: 0, scale: 0.9, rotation: -12, transformOrigin: '25px 35px' })

        gsap.set(paths[1], { opacity: 0, scale: 0.85, x: -6, y: -6, transformOrigin: '38px 49px' })

        gsap.set(paths[2], { opacity: 0, x: -80, filter: 'blur(10px)' })
      }

      const timeline = gsap.timeline()

      if (paths[2]) {
        timeline
          .to(paths[0], {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            ease: 'expo.out',
            transformOrigin: '25px 35px'
          })
          .to(
            paths[1],
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.9,
              ease: 'expo.out'
            },
            '-=0.75'
          )
          .to(
            paths[2],
            {
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: 1.1,
              ease: 'expo.out'
            },
            '-=0.65'
          )
      } else {
        timeline.fromTo(paths, { opacity: 0 }, { opacity: 1, duration: 0.8 })
      }

      timeline.to({}, { duration: 0.5 }).to(container, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          if (!isActive) return
          finish()
        }
      })

      tl = timeline
    }

    void runAnim()

    return () => {
      isActive = false
      tl?.kill()
    }
  }, [finish])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-999 flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      <div ref={logoWrapperRef} className="mb-4 flex items-center justify-center">
        <svg
          width="420"
          height="80"
          viewBox="0 0 420 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-auto md:h-16 lg:h-20"
        >
          <defs>
            <clipPath id="textClip">
              <rect x="50" y="0" width="370" height="80" />
            </clipPath>
          </defs>
          <path
            ref={(el) => {
              logoPathsRef.current[0] = el
            }}
            d="M25 10.0002C38.8071 10.0002 50 21.1931 50 35.0002C49.9999 47.0322 41.4995 57.0768 30.1768 59.4611V24.7697C30.1767 23.5565 29.7796 22.5532 28.9863 21.76C28.193 20.92 27.1198 20.5002 25.7666 20.5002C25.2534 20.5002 24.6934 20.5702 24.0869 20.7102C23.527 20.8501 23.0135 21.0837 22.5469 21.4104L12.4668 28.1301C11.0202 29.0634 10.297 30.2765 10.2969 31.7697C10.2969 32.9364 10.7166 33.9405 11.5566 34.7805C12.3965 35.6202 13.3764 36.0401 14.4961 36.0402C15.4761 36.0402 16.293 35.7831 16.9463 35.2697L21.0762 32.215V59.6926C9.13327 57.8098 9.54473e-05 47.4722 0 35.0002C0 21.1931 11.1929 10.0002 25 10.0002Z"
            fill="#0F2854"
          />
          <path
            ref={(el) => {
              logoPathsRef.current[1] = el
            }}
            d="M46 48.5C44.2776 51.295 42.1608 53.5769 39.5 55.5C36.8392 57.4231 33.5 59 30.2 59.4455V38.6667L46 48.5Z"
            fill="#FF9D00"
          />
          <text
            ref={(el) => {
              logoPathsRef.current[2] = el
            }}
            x="54"
            y="55"
            fill="#0F2854"
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Poppins', 'Segoe UI', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: '52px',
              letterSpacing: '-0.03em'
            }}
          >
            ne academy
          </text>
        </svg>
      </div>
    </div>
  )
}
