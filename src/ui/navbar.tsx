"use client";

import Link from "next/link";
import { useState } from "react";

const tabs = [{ label: "Home", href: "/" }, { label: "How To Play" }];

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
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {/* NAVBAR */}
      <div className="w-full border-b border-gray-700 flex justify-end gap-4 p-4">
        {tabs.map((tab) =>
          typeof tab.href === "undefined" ? (
            <NavButton
              key={tab.label}
              label={tab.label}
              onClick={() => setShowModal(true)}
            />
          ) : (
            <Link key={tab.href} href={tab.href}>
              <NavButton label={tab.label} />
            </Link>
          )
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">How To Play</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Add your instructions here...
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
