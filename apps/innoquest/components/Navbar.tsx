import { Navbar as BaseNavbar, NavbarProps } from "@repo/ui/shared/Navbar";

const navLinks = [
  { label: "Database", href: "/" },
  { label: "About", href: "/about" },
];

export function Navbar(props: NavbarProps) {
  return <BaseNavbar {...props} links={navLinks} />;
}
