export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Monitor',
      href: '/monitor',
    },
    {
      label: 'Alumnos',
      href: '/alumnos',
    },
    {
      label: 'Cursos',
      href: '/cursos',
    },
  ],
  navMenuItems: [
    {
      label: 'Monitor',
      href: '/monitor',
    },
    {
      label: 'Alumnos',
      href: '/alumnos',
    },
    {
      label: 'Cursos',
      href: '/cursos',
    },
  ],
  links: {
    github: 'https://github.com/heroui-inc/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};
