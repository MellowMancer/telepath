export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const RESPONSIVE = {
  // Container widths
  container: {
    mobile: 'w-full',
    tablet: 'sm:max-w-xl md:max-w-2xl',
    desktop: 'lg:max-w-4xl xl:max-w-6xl',
  },
  // Layout
  stack: {
    mobile: 'flex flex-col',
    tablet: 'sm:flex-row',
  },
  // Spacing
  padding: {
    mobile: 'p-4',
    tablet: 'sm:p-6',
    desktop: 'lg:p-8',
  },
  // Text sizing
  heading: {
    mobile: 'text-3xl',
    tablet: 'sm:text-4xl',
    desktop: 'lg:text-5xl',
  },
} as const;
