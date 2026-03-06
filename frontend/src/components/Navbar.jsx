export default function Navbar({ setOpen }) {

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">

      <button
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      <div className="font-bold">
        Painel Agendrin
      </div>

      <div>
        Usuário
      </div>

    </header>
  );
}