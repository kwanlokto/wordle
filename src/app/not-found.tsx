import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <p className="text-xl text-neutral-400 mb-6">Page Not Found</p>
      <Link
        href="/"
        className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors duration-200"
      >
        Go Home
      </Link>
    </div>
  );
}
