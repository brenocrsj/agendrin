import { Link } from "react-router-dom"

export default function Sidebar(){

return(

<div className="w-64 bg-slate-900 p-6 space-y-4">

<h1 className="text-xl font-bold">
Agendrin
</h1>

<nav className="flex flex-col space-y-2">

<Link to="/">Dashboard</Link>
<Link to="/agenda">Agenda</Link>
<Link to="/clientes">Clientes</Link>
<Link to="/profissionais">Profissionais</Link>
<Link to="/servicos">Serviços</Link>
<Link to="/financeiro">Financeiro</Link>
<Link to="/configuracoes">Configurações</Link>

</nav>

</div>

)

}