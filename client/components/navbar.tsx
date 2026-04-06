import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
      classNames={{
        wrapper: "px-4 sm:px-8 h-16",
      }}
    >
      {/* Left: Brand */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Logo />
            <p className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">ACME</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-1 justify-start ml-4">
          <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl p-1 gap-0.5">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    "flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </div>
        </ul>
      </NavbarContent>

      {/* Right: Social + Sponsor */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-1">
          <NextLink
            aria-label="Twitter"
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-500 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <TwitterIcon />
          </NextLink>
          <NextLink
            aria-label="Discord"
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-500 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <DiscordIcon />
          </NextLink>
          <NextLink
            aria-label="Github"
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-500 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            <GithubIcon />
          </NextLink>
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <NextLink
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-md hover:shadow-lg hover:opacity-90 transition-all px-5 py-2 rounded-xl flex items-center gap-2"
            href={siteConfig.links.sponsor}
          >
            <HeartFilledIcon className="text-white" />
            Sponsor
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NextLink
          aria-label="Github"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400"
        >
          <GithubIcon />
        </NextLink>
        <NavbarMenuToggle className="text-slate-600 dark:text-slate-300" />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl pt-4 pb-8">
        <div className="mx-4 mt-2 flex flex-col gap-1">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={clsx(
                  "w-full block py-3 px-4 rounded-xl transition-colors text-base font-medium",
                  index === 2
                    ? "text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "text-red-500 font-semibold bg-red-50 dark:bg-red-500/10"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
                href="#"
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
