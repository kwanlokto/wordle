"use client";

import Link from "next/link";

const tabs = [
  { label: "Home", href: "/" },
  { label: "How To Play", href: "/help" },
];

interface NavButtonProps {
  label: string;
  onClick?: () => void;
}

const NavButton = ({ label, onClick }: NavButtonProps) => (
  <button
    onClick={onClick}
    className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
  >
    {label}
  </button>
);

export const Navbar = () => {
  return (
    <div className="w-full border-b border-gray-700 flex justify-end gap-4 p-4">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href}>
          <NavButton label={tab.label} />
        </Link>
      ))}
    </div>
  );
};
