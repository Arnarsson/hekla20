/**
 * Site-wide constants. Navigation, footer, ticker copy and company details
 * live here so they exist in exactly one place instead of being retyped
 * into the head and foot of every page.
 */

export const site = {
  name: 'HEKLA',
  url: 'https://hekla.cc',
  tagline: 'AI engineering, Copenhagen',
  description:
    'HEKLA builds AI agents that run inside your operations and hands over full ownership. 12+ systems shipped, 83% time saved on automated processes. Copenhagen.',
  ogDescription:
    'AI agents that run inside your operations. You own what we build. 12+ systems shipped, 83% time saved.',
  email: 'hjalti@hekla.cc',
  legalName: 'Seven Consult ApS',
  cvr: '39368218',
  address: {
    street: 'Store Kongensgade 81',
    postal: '1264 Copenhagen K',
    country: 'Denmark',
    city: 'Copenhagen',
  },
} as const;

/** Main navigation. Every entry is a section of the front page. */
export const nav = [
  { href: '/#products', label: 'Products' },
  { href: '/#about', label: 'About' },
  { href: '/#how', label: 'How we work' },
  { href: '/#contact', label: 'Contact' },
] as const;

/** The primary call to action, repeated in the masthead and across pages. */
export const primaryCta = { href: '/#contact', label: '→ Book a conversation' } as const;

export const footerColumns = [
  {
    heading: 'Products',
    links: [
      { href: '/lead-agent', label: 'Lead Agent' },
      { href: '/undo', label: 'UNDO' },
      { href: '/workshops', label: 'Workshops' },
      { href: '/build-agent', label: 'Build Agent' },
      { href: '/custom', label: 'Custom AI' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { href: '/#contact', label: 'Book a conversation' },
      { href: `mailto:${site.email}`, label: site.email },
    ],
  },
] as const;

/**
 * Footer ticker. Four lines, duplicated once in the component so the marquee
 * can translate exactly -50% and loop without a visible seam.
 */
export const tickerLines = [
  'HEKLA builds AI agents that run inside your operations.',
  'You own what we build. No lock-in, no license we control.',
  'Look at the work. Build one agent. Hand over the keys.',
  '12+ systems shipped. 83% time saved. Copenhagen.',
] as const;
