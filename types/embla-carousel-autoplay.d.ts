declare module 'embla-carousel-autoplay' {
  interface AutoplayOptions {
    delay: number
  }

  const Autoplay: (options: AutoplayOptions) => never

  export default Autoplay
}
