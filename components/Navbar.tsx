"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Brain, Home, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [clientPathname, setClientPathname] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setClientPathname(window.location.pathname);
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    // { href: "/mock-tests", label: "Mock Tests", icon: Book },
    // { href: "/ai-tutor", label: "AI Tutor", icon: Brain },
  ];

  if (!mounted) return null; // Prevents hydration errors

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MockAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  clientPathname === href ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 ${
                        clientPathname === href ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};



export { Navbar };
