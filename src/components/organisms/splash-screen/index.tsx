'use client'

import { useEffect, useRef } from 'react'

import { useSplashStore } from '@/hooks/useSplashStore'

export const SplashScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoPathsRef = useRef<(SVGElement | null)[]>([])
  const logoWrapperRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const finish = useSplashStore((s) => s.finish)

  useEffect(() => {
    let isActive = true
    let tl: { kill: () => void } | null = null

    const runAnim = async () => {
      const { gsap } = await import('gsap')

      if (!isActive) return

      const container = containerRef.current
      const logoWrapper = logoWrapperRef.current
      const glow = glowRef.current
      const particles = particlesRef.current
      const ring = ringRef.current
      const paths = logoPathsRef.current.filter(Boolean)

      if (!container || !logoWrapper || paths.length === 0) return

      gsap.set(paths, { opacity: 0 })
      gsap.set(logoWrapper, { scale: 0.8, opacity: 0 })

      if (glow) gsap.set(glow, { scale: 0, opacity: 0 })
      if (ring) gsap.set(ring, { scale: 0, opacity: 0 })

      if (paths[0]) {
        gsap.set(paths[0], {
          opacity: 0,
          scale: 0.3,
          rotation: -180,
          transformOrigin: '25px 35px'
        })
      }
      if (paths[1]) {
        gsap.set(paths[1], {
          opacity: 0,
          scale: 0,
          transformOrigin: '38px 49px'
        })
      }
      if (paths[2]) {
        gsap.set(paths[2], {
          opacity: 0,
          clipPath: 'inset(0 100% 0 0)'
        })
      }

      const timeline = gsap.timeline()

      timeline.to(logoWrapper, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      })

      if (glow) {
        timeline.to(
          glow,
          {
            scale: 1.2,
            opacity: 0.6,
            duration: 0.6,
            ease: 'power2.out'
          },
          '-=0.3'
        )
      }

      if (ring) {
        timeline.to(
          ring,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.4)'
          },
          '-=0.4'
        )

        timeline.to(ring, {
          scale: 1.8,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
      }

      if (paths[0]) {
        timeline.to(
          paths[0],
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            transformOrigin: '25px 35px'
          },
          '-=0.6'
        )
      }

      if (particles) {
        const dots = particles.querySelectorAll('.particle')
        dots.forEach((dot) => {
          const angle = Math.random() * Math.PI * 2
          const distance = 60 + Math.random() * 80
          gsap.set(dot, { x: 0, y: 0, opacity: 1, scale: 1 })
          timeline.to(
            dot,
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0,
              duration: 0.6,
              ease: 'power3.out'
            },
            '-=0.6'
          )
        })
      }

      if (paths[1]) {
        timeline.to(
          paths[1],
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
            transformOrigin: '38px 49px'
          },
          '-=0.4'
        )
      }

      if (paths[2]) {
        timeline.to(
          paths[2],
          {
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.8,
            ease: 'power4.out'
          },
          '-=0.2'
        )
      }

      if (glow) {
        timeline.to(
          glow,
          {
            scale: 0.8,
            opacity: 0.3,
            duration: 0.4,
            ease: 'power2.inOut'
          },
          '-=0.5'
        )
      }

      timeline.to({}, { duration: 0.6 })

      timeline.to(logoWrapper, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.in'
      })

      timeline.to(container, {
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
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
      className="fixed inset-0 z-999 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a1e3d 0%, #060f1f 100%)'
      }}
    >
      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute h-[500px] w-[500px] animate-pulse rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #008ae3 0%, transparent 70%)',
          animationDuration: '4s',
          top: '10%',
          left: '-10%'
        }}
      />
      <div
        className="pointer-events-none absolute h-[400px] w-[400px] animate-pulse rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #FF9D00 0%, transparent 70%)',
          animationDuration: '5s',
          bottom: '5%',
          right: '-8%'
        }}
      />

      {/* Center glow burst */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-64 w-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,138,227,0.35) 0%, rgba(0,138,227,0.08) 50%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />

      {/* Expanding ring */}
      <div ref={ringRef} className="pointer-events-none absolute h-28 w-28 rounded-full border-2 border-white/20" />

      {/* Particles */}
      <div ref={particlesRef} className="pointer-events-none absolute">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: i % 3 === 0 ? '#FF9D00' : i % 3 === 1 ? '#008ae3' : '#ffffff'
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div ref={logoWrapperRef} className="flex items-center justify-center">
        <svg
          width="420"
          height="80"
          viewBox="0 0 420 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-auto md:h-16 lg:h-20"
        >
          <path
            ref={(el) => {
              logoPathsRef.current[0] = el
            }}
            d="M25 10.0002C38.8071 10.0002 50 21.1931 50 35.0002C49.9999 47.0322 41.4995 57.0768 30.1768 59.4611V24.7697C30.1767 23.5565 29.7796 22.5532 28.9863 21.76C28.193 20.92 27.1198 20.5002 25.7666 20.5002C25.2534 20.5002 24.6934 20.5702 24.0869 20.7102C23.527 20.8501 23.0135 21.0837 22.5469 21.4104L12.4668 28.1301C11.0202 29.0634 10.297 30.2765 10.2969 31.7697C10.2969 32.9364 10.7166 33.9405 11.5566 34.7805C12.3965 35.6202 13.3764 36.0401 14.4961 36.0402C15.4761 36.0402 16.293 35.7831 16.9463 35.2697L21.0762 32.215V59.6926C9.13327 57.8098 9.54473e-05 47.4722 0 35.0002C0 21.1931 11.1929 10.0002 25 10.0002Z"
            fill="white"
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
            fill="white"
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
