import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Topbar />

          <main className="px-6 py-6">
            <div className="mx-auto max-w-[1200px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}