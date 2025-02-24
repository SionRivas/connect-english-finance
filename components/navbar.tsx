import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@heroui/navbar';
import { Link } from '@heroui/link';
import { link as linkStyles } from '@heroui/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import { Image } from '@heroui/image';

import LogoutButton from '@/components/user/logout';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import LogoutMin from './user/logoutMin';

interface NavbarProps {
  username: string;
}

export const Navbar = ({ username }: NavbarProps) => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky" shouldHideOnScroll>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit gap-3">
          <div>
            <p className="font-bold text-inherit">Connect English</p>
            <p className="text-xs text-inherit">Monitor Financiero</p>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden basis-1/5 sm:basis-full md:flex"
        justify="center"
      >
        <NavbarItem className="flex gap-2">
          <ul className="ml-2 flex justify-start gap-4">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:font-medium data-[active=true]:text-primary',
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden basis-1/5 sm:basis-full md:flex"
        justify="end"
      >
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
          <div className="flex flex-col items-end">
            <span className="font-bold text-inherit">Bienvendio</span>
            <span className="text-xs text-success-500 dark:text-red-700">
              {username}
            </span>
          </div>
          <LogoutButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="basis-1 pl-4 md:hidden" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex h-full flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={item.href === '/cursos' ? 'primary' : 'foreground'}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem className="mb-20 mt-auto">
            <LogoutMin />
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
