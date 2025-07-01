import { FC, PropsWithChildren } from 'react'

/**
 * Section – responsive page wrapper that keeps content centered,
 * maintains generous horizontal padding, and prevents the layout from
 * stretching too wide on large monitors.
 *
 * Brand principle: "Minimalist layouts with ample natural space".
 */
export const Section: FC<PropsWithChildren> = ({ children }) => (
  <section className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    {children}
  </section>
) 