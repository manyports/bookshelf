"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Book,
  Home,
  Languages,
  MessageCircle,
  Pencil,
  Timer,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Languages, title: "Словарь", href: "/dictionary" },
  { icon: Book, title: "BookMatch", href: "/bookmatch" },
  { icon: MessageCircle, title: "Чат", href: "/chat" },
  { icon: Users, title: "Форум", href: "/forum" },
  { icon: Pencil, title: "Заметки", href: "/notes" },
  { icon: Timer, title: "Игра", href: "/game" },
  { icon: Home, title: "Профиль", href: "/dash" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-center w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center">
        <nav className="hidden md:flex items-center justify-center space-x-4 lg:space-x-6">
          <Link href="/" className="flex items-center space-x-2 mr-4">
            <span className="font-bold">Dana</span>
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">{item.title}</span>
            </Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold">Dana</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-sm font-medium"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
