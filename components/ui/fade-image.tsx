import Image, { ImageProps } from 'next/image'

/**
 * FadeImage – Next/Image wrapper that provides lazy-loading with a soft fade-in.
 * Ensures high-quality imagery guideline and perceived performance.
 */
export const FadeImage = (props: ImageProps) => (
  <Image
    {...props}
    className={`${props.className ?? ''} opacity-0 animate-fadeIn`} // Tailwind animate-fadeIn declared in config
  />
) 