import { useState } from 'react'
import logoEnecon from '../assets/Images/Logotipo enecon_ (002).png'
import Assignment from '../Pages/Contract_Employee/Assignment.jsx'
import Contract from '../Pages/Contract/Contract.jsx'
import Category from '../Pages/Category/Category.jsx'
import Dashboard from '../Pages/Dashboard/Dashboard.jsx'
import Employee from '../Pages/Employee/Employee.jsx'
import FormList from '../Pages/Form/FormList.jsx'
import FormType from '../Pages/Form/FormType.jsx'
import Permission from '../Pages/Role/Permission.jsx'
import Privilege from '../Pages/Role/Privilege.jsx'
import UserList from '../Pages/User/UserList.jsx'
import MyWorkOrder from '../Pages/Work_Order/MyWorkOrder.jsx'
import WorkOrder from '../Pages/Work_Order/WorkOrder.jsx'

import {
    LayoutDashboard,
    Folder,
    Users,
    ShieldCheck,
    ClipboardList,
    FileText,
    FileCog,
    FileSignature,
    UserRoundPlus,
    KeyRound,
    ListTodo,
} from 'lucide-react'


const dashboard = { id: 'dashboard', label: 'Dashboard' }

const categoria = { id: 'categories', label: 'Categorías' }

const modules = [
	
	{
		id: 'users',
		icon: Users,
		label: 'Usuarios',
		items: [
			{ id: 'users-list', label: 'Usuarios' },
			{ id: 'employees', label: 'Empleados' },
		],
	},
	{
		id: 'roles',
		icon: ShieldCheck,
		label: 'Roles',
		items: [
			{ id: 'permissions', label: 'Permisos' },
			{ id: 'privileges', label: 'Privilegios' },
		],
	},
	{
		id: 'work-orders',
		icon: ClipboardList,
		label: 'Orden de trabajo',
		items: [
			{ id: 'work-order-list', label: 'Orden de trabajo' },
			{ id: 'my-work-orders', label: 'Mi orden de trabajo' },
		],
	},
    {
		id: 'categories',
		icon: Folder,
		label: 'Categorías',
		items: [{ id: 'category-list', label: 'Categorías' }],
	},
	{
		id: 'forms',
		icon: FileText,
		label: 'Formulario',
		items: [
			{ id: 'forms-list', label: 'Formulario' },
			{ id: 'form-types', label: 'Tipo de formulario' },
		],
	},
	{
		id: 'contracts',
		icon: FileSignature,
		label: 'Contrato',
		items: [
			{ id: 'contracts-list', label: 'Contrato' },
			{ id: 'assignments', label: 'Asignación' },
		],
	},
]

const pageComponents = {
	dashboard: Dashboard,
	'category-list': Category,
	'users-list': UserList,
	employees: Employee,
	permissions: Permission,
	privileges: Privilege,
	'work-order-list': WorkOrder,
	'my-work-orders': MyWorkOrder,
	'forms-list': FormList,
	'form-types': FormType,
	'contracts-list': Contract,
	assignments: Assignment,
}

function Menu() {
	const [activeSection, setActiveSection] = useState(dashboard.id)
	const [menuOpen, setMenuOpen] = useState(false)
	const [expandedModules, setExpandedModules] = useState({})
	const [moduleDashboard, setModuleDashboard] = useState(null)
	const activeLabel = [dashboard, ...modules.flatMap((module) => module.items)]
		.find((section) => section.id === activeSection)?.label
	const ActivePage = pageComponents[activeSection]

	const selectSection = (sectionId) => {
		setActiveSection(sectionId)
		setModuleDashboard(null)
		setMenuOpen(false)
	}

	const showModuleDashboard = (module) => {
		setModuleDashboard(module)
		setMenuOpen(false)
	}

	const toggleModule = (moduleId) => {
		setExpandedModules((current) => ({
			[moduleId]: !current[moduleId],
		}))
	}

	return (
		<div className="min-h-screen bg-[#f6f7f8] text-[#292d32]">
			<header className="fixed inset-x-0 top-0 z-50 flex h-[66px] items-center border-b border-[#e7e9eb] bg-white px-4 md:h-[76px] md:px-[34px]">
				<button
					aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
					aria-expanded={menuOpen}
					className="mr-2 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1 border-0 bg-transparent p-2 md:hidden"
					onClick={() => setMenuOpen(!menuOpen)}
					type="button"
				>
					<span className="h-0.5 w-[19px] rounded-sm bg-[#3c4247]" />
					<span className="h-0.5 w-[19px] rounded-sm bg-[#3c4247]" />
					<span className="h-0.5 w-[19px] rounded-sm bg-[#3c4247]" />
				</button>
				<a className="ml-1 flex h-full w-[108px] flex-none items-center md:ml-0 md:w-[190px]" href="#dashboard" onClick={() => selectSection(dashboard.id)}>
					<img alt="Enecon" className="block h-[40px] max-w-full object-contain object-left md:h-12" src={logoEnecon} />
				</a>
				<div className="ml-2 flex min-w-0 flex-col justify-center border-l border-[#f0d8cb] pl-2 md:ml-0 md:pl-3">
					<span className="text-[9px] font-bold tracking-[0.7px] text-[#a0a5a9]">ROL</span>
					<span className="max-w-[70px] truncate text-[11px] font-semibold text-[#c9521d] md:max-w-[140px] md:text-[13px]">Super Administradora</span>
				</div>
				<div className="flex-1" />
				<div className="flex items-center gap-[11px]">
					<span aria-hidden="true" className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#f4d3c2] bg-[#fff0e8] text-sm font-bold text-[#d96128] sm:inline-flex">T</span>
					<span className="flex min-w-0 flex-col leading-tight">
						<span className="max-w-[76px] truncate text-[11px] font-semibold text-[#373c40] sm:max-w-[120px] md:text-[13px]">Yessica Zulay Urrego</span>
						<span className="max-w-[76px] truncate text-[9px] text-[#898f94] sm:max-w-[120px] md:text-[11px]">Desarrolladora Senior</span>
					</span>
				</div>
			</header>

			<aside className={`fixed bottom-0 left-0 top-[66px] z-[70] flex w-[min(280px,84vw)] flex-col border-r border-[#e7e9eb] bg-white shadow-[10px_0_30px_rgb(20_24_28_/_10%)] transition-transform duration-200 md:top-[76px] md:z-40 md:w-[254px] md:translate-x-0 md:shadow-none ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				<nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-4 py-[26px]">
					<a
						aria-current={activeSection === dashboard.id ? 'page' : undefined}
						className={`mb-2 flex min-h-[42px] items-center gap-3 rounded-[5px] px-3 text-[13px] font-medium transition-colors hover:bg-[#f6f7f8] hover:text-[#292d32] ${activeSection === dashboard.id ? 'bg-[#fff1e9] font-semibold text-[#c9521d] hover:bg-[#fff1e9] hover:text-[#c9521d]' : 'text-[#5c6267]'}`}
						href={`#${dashboard.id}`}
						onClick={() => selectSection(dashboard.id)}
					>
						<LayoutDashboard aria-hidden="true" className={`h-4 w-4 shrink-0 ${activeSection === dashboard.id ? 'text-[#c9521d]' : 'text-[#92999e]'}`} />
						{dashboard.label}
					</a>
					{modules.map((module) => (
						<div className="border-t border-[#f0f1f2] py-1" key={module.id}>
							<button
								aria-controls={`submenu-${module.id}`}
								aria-expanded={Boolean(expandedModules[module.id])}
								className="flex min-h-[42px] w-full items-center justify-between rounded-[5px] px-3 text-left text-[13px] font-medium text-[#5c6267] transition-colors hover:bg-[#f6f7f8] hover:text-[#292d32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e36a2c]"
								onClick={() => toggleModule(module.id)}
								type="button"
							>
								<span className="flex items-center gap-3"><module.icon aria-hidden="true" className="h-4 w-4 text-[#92999e]" />{module.label}</span>
								<span className="flex items-center gap-3">
									<span aria-hidden="true" className={`h-2 w-2 rotate-45 border-b border-r border-[#969da2] transition-transform ${expandedModules[module.id] ? 'translate-y-[2px] rotate-[225deg]' : '-translate-y-[2px]'}`} />
									<button aria-label={`Mini dashboard de ${module.label}`} className="rounded p-1 text-[#92999e] hover:bg-[#fff1e9] hover:text-[#c9521d]" onClick={(event) => { event.stopPropagation(); showModuleDashboard(module) }} type="button">
										<LayoutDashboard aria-hidden="true" className="h-4 w-4" />
									</button>
								</span>
							</button>
							<div className={`ml-3 border-l border-[#e7e9eb] pl-3 ${expandedModules[module.id] ? 'block' : 'hidden'}`} id={`submenu-${module.id}`}>
								{module.items.map((item) => (
									<a
										aria-current={activeSection === item.id ? 'page' : undefined}
										className={`flex min-h-[38px] items-center rounded-[4px] px-2 text-[12px] transition-colors hover:bg-[#f6f7f8] ${activeSection === item.id ? 'font-semibold text-[#c9521d]' : 'text-[#737a80]'}`}
										href={`#${item.id}`}
										key={item.id}
										onClick={() => selectSection(item.id)}
									>
										{item.label}
									</a>
								))}
							</div>
						</div>
					))}
				</nav>
				<div className="flex min-h-[54px] items-center gap-[9px] border-t border-[#eef0f1] px-[25px] text-[11px] text-[#898f94]">
					<span className="h-[7px] w-[7px] rounded-full bg-[#55a878]" />
					<span>Plataforma ENECON</span>
				</div>
			</aside>

			{menuOpen && (
				<button
					aria-label="Cerrar menú"
					className="fixed inset-x-0 bottom-0 top-[66px] z-[60] border-0 bg-black/35 md:hidden"
					onClick={() => setMenuOpen(false)}
					type="button"
				/>
			)}

			<main className="min-h-screen px-5 pb-10 pt-[96px] md:ml-[254px] md:px-12 md:pt-[114px]" id={activeSection}>
				<div className="mx-auto mb-6 flex max-w-[1520px] items-start justify-between md:mb-[30px] md:items-end">
					<div>
						<p className="mb-2 text-[10px] font-bold tracking-[1px] text-[#a0a5a9]">ENECON / {activeLabel}</p>
						<h1 className="m-0 text-[27px] font-semibold leading-[1.2] text-[#292d32]">{activeLabel}</h1>
						<p className="mt-[9px] text-[13px] text-[#777e84]">
							Accede a los módulos de gestión desde el menú principal.
						</p>
					</div>
					<span className="hidden pb-1 text-[9px] font-bold tracking-[1px] text-[#959ba0] md:block">ENTORNO DE TRABAJO</span>
				</div>
				{moduleDashboard ? (
					<section aria-label={`Mini dashboard de ${moduleDashboard.label}`} className="mx-auto grid max-w-[1520px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{moduleDashboard.items.map((item) => (
							<button className="rounded-lg border border-[#e7e9eb] bg-white p-5 text-left shadow-sm transition hover:border-[#e9a17d]" key={item.id} onClick={() => selectSection(item.id)} type="button">
								<span className="block text-[12px] text-[#898f94]">Módulo</span>
								<span className="mt-2 block text-lg font-semibold text-[#292d32]">{item.label}</span>
								<span className="mt-3 block text-[12px] text-[#c9521d]">Abrir módulo →</span>
							</button>
						))}
					</section>
				) : <ActivePage />}
			</main>
		</div>
	)
}

export default Menu
