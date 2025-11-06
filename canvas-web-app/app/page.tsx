import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-800">My Canvas App</h1>
        <SignedIn>
          {/* Shows profile/logout button if logged in */}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          {/* Shows sign in button if logged out */}
          <Link href="/sign-in">
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </Link>
        </SignedOut>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
        <SignedIn>
          <p className="text-lg text-gray-600 mb-6">You are signed in.</p>
          <Link href="/dashboard">
            <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700">
              Go to Your Dashboard
            </button>
          </Link>
        </SignedIn>
        <SignedOut>
          <p className="text-lg text-gray-600">
            Please sign in to access your dashboard.
          </p>
        </SignedOut>
      </main>
    </div>
  );
}
