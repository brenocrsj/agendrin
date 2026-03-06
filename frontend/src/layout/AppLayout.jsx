import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">

        <Navbar setOpen={setOpen} />

        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}