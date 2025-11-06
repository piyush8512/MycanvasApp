import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>;
  }
  const user = await currentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="p-6">
        <p className="text-lg">
          Welcome! This is your protected web app dashboard.
        </p>
        <p className="text-gray-600 mt-2">Your User ID is: {user?.id}</p>
      </main>
    </div>
  );
}
