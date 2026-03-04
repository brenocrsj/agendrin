import { Routes, Route } from "react-router-dom"
import AppShell from "./layout/AppShell"

import DashboardPage from "./pages/DashboardPage"
import AgendaPage from "./pages/AgendaPage"
import ClientesPage from "./pages/ClientesPage"
import ProfissionaisPage from "./pages/ProfissionaisPage"
import ServicosPage from "./pages/ServicosPage"
import FinanceiroPage from "./pages/FinanceiroPage"
import ConfiguracoesPage from "./pages/ConfiguracoesPage"

export default function App(){

return(

<AppShell>

<Routes>

<Route path="/" element={<DashboardPage/>}/>
<Route path="/agenda" element={<AgendaPage/>}/>
<Route path="/clientes" element={<ClientesPage/>}/>
<Route path="/profissionais" element={<ProfissionaisPage/>}/>
<Route path="/servicos" element={<ServicosPage/>}/>
<Route path="/financeiro" element={<FinanceiroPage/>}/>
<Route path="/configuracoes" element={<ConfiguracoesPage/>}/>

</Routes>

</AppShell>

)

}