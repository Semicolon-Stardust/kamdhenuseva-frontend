'use client';

import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/stores/authStore';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface NavLink {
  href: string;
  label: string;
}

interface VerticalSidebarProps {
  heading: string;
  headingLink: string;
  links: NavLink[];
}

export default function VerticalSidebar({
  heading,
  headingLink,
  links,
}: VerticalSidebarProps) {
  const { isAuthenticatedUser, user, logoutUser } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser();
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <h2 className="text-foreground text-2xl font-bold">
          <Link href={headingLink}>{heading}</Link>
        </h2>
      </SidebarHeader>
      <SidebarContent className="p-6">
        <nav className="mt-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary-foreground text-lg"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        {isAuthenticatedUser && user ? (
          <Button
            variant={"outline"}
            onClick={handleLogout}
            className="hover:text-primary-foreground text-lg cursor-pointer"
          >
            Logout
          </Button>

        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
