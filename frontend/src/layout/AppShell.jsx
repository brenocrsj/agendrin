import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function AppShell({children}){

return(

<div className="flex min-h-screen">

<Sidebar/>

<div className="flex-1">

<Topbar/>

<div className="p-6">

{children}

</div>

</div>

</div>

)

}