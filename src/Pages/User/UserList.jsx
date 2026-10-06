import React, { useRef, useState } from "react";
import { Edit, Trash, Eye, Search, Users, LayoutDashboard, SquareDashedMousePointer } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import exampleSignature from "../../assets/images/firma.png";

const users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@enecon.net.co",
    phone: "+57 300 123 4567",
    date: "2026-03-15",
    role: "SUPER-ADMINISTRADOR",
    roleClass: "text-blue-500 bg-cyan-100",
  },
  {
    id: 2,
    name: "Maria Gómez",
    email: "maria.gomez@enecon.net.co",
    phone: "+57 310 987 6543",
    date: "2026-03-20",
    role: "OPERARIO",
    roleClass: "text-[#168C0DFF] bg-cyan-100",
  },
];

const ActionButton = ({ icon: Icon, label, tooltip, className = "", onClick }) => (
  <div className="relative group inline-flex">
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm ${className}`}
    >
      <Icon size={18} />
    </button>

    <span
      className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1"
      
    >
      {tooltip}
      <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
    </span>
  </div>
);

const GenericModal = ({ open, onClose, labelledBy, className, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby={labelledBy} className={className}>
        {children}
      </section>
    </div>
  );
};

const UserList = () => {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [selectedDirectoryUser, setSelectedDirectoryUser] = useState("");
  const [selectedCreateRole, setSelectedCreateRole] = useState("");
  const [isViewingUser, setIsViewingUser] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const signatureCanvas = useRef(null);
  const isDrawingSignature = useRef(false);
  const [signature, setSignature] = useState("");
  const [selectedusers, setSelectedusers] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const userIds = [1, 2, 3, 4, 5];
  const roleOptions = [
    { id: 1, label: "PODADOR" },
    { id: 2, label: "GESTOR SST" },
    { id: 3, label: "AUXILIAR" },
    { id: 4, label: "EWO" },
  ];
  const directoryUsers = [
    { id: "kronos", nombre: "Kronos", email: "kronos@enecon.net.co", estado: "ACTIVO", activo: true },
    { id: "invitado", nombre: "Invitado", email: "invitado@enecon.net.co", estado: "INACTIVO", activo: false },
    { id: "web", nombre: "Web", email: "web@enecon.net.co", estado: "ACTIVO", activo: true },
  ];
  const activeDirectoryUsers = directoryUsers.filter((user) => user.activo);
  const selectedDirectoryUserData = activeDirectoryUsers.find((user) => user.id === selectedDirectoryUser);
  const getRoleLabel = (rolId) => roleOptions.find((role) => role.id === Number(rolId))?.label ?? "Sin rol";
  const userRoleCounts = [
    { role: "PODADOR", count: 0 },
    { role: "GESTOR SST", count: 2 },
    { role: "AUXILIAR", count: 1 },
    { role: "EWO", count: 1 },
  ];
  const allusersSelected = selectedusers.length === userIds.length;

  const toggleuserSelection = (userId) => {
    const nextSelection = selectedusers.includes(userId)
      ? selectedusers.filter((id) => id !== userId)
      : [...selectedusers, userId];
    setSelectedusers(nextSelection);
    if (nextSelection.length === 0) setSelectionMode(false);
  };

  const getSignaturePoint = (event) => {
    const canvas = signatureCanvas.current;
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  };

  const finishSignature = () => {
    isDrawingSignature.current = false;
  };

  const startSignature = (event) => {
    if (isViewingUser) return;
    const canvas = signatureCanvas.current;
    const point = getSignaturePoint(event);
    isDrawingSignature.current = true;
    canvas.setPointerCapture(event.pointerId);
    const context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const drawSignature = (event) => {
    if (!isDrawingSignature.current) return;
    const context = signatureCanvas.current.getContext("2d");
    const point = getSignaturePoint(event);
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#1f2937";
    context.lineTo(point.x, point.y);
    context.stroke();
    setSignature(signatureCanvas.current.toDataURL("image/png"));
  };

  const clearSignature = () => {
    const canvas = signatureCanvas.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
    finishSignature();
  };

  const openEditUser = (user) => {
    setUserToEdit(user);
    setSelectedDirectoryUser(user.directory_user_id ?? "");
    setShowCreateUser(true);
  };

  const closeUserModal = () => {
    setShowCreateUser(false);
    setUserToEdit(null);
    setIsViewingUser(false);
    setSelectedDirectoryUser("");
    setSelectedCreateRole("");
  };

  const openCreateUser = () => {
    setUserToEdit(null);
    setIsViewingUser(false);
    setSelectedDirectoryUser("");
    setSelectedCreateRole("");
    setShowCreateUser(true);
  };

  const openViewUser = (user) => {
    setUserToEdit(user);
    setIsViewingUser(true);
    setShowCreateUser(true);
  };

  return (
    <div className="space-y-5 p-1 md:p-2">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(156,163,175,0.2)] bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#d06519]">
            <HiOutlineUserGroup size={18} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">APPSIG</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Usuarios</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-[#d06519]">Enecon</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-[#c20016]"
          >
            <IoIosArrowBack size={18} />
          </button>
          <ActionButton
            icon={SquareDashedMousePointer}
            label={selectionMode ? "Cancelar selección" : "Seleccionar todo"}
            tooltip={selectionMode ? "Cancelar selección" : "Seleccionar todo"}
            onClick={() => {
              setSelectionMode((active) => !active);
              setSelectedusers([]);
            }}
          />
          {selectedusers.length > 1 && (
            <ActionButton
              icon={Trash}
              label="Eliminar seleccionados"
              tooltip={`Eliminar seleccionados (${selectedusers.length})`}
              className="text-orange-600 hover:border-orange-200 hover:bg-orange-50"
              onClick={() => {
                setSelectedusers([]);
                setSelectionMode(false);
              }}
            />
          )}
          <ActionButton
            icon={LayoutDashboard}
            label={showDashboard ? "Cerrar dashboard" : "Abrir dashboard"}
            tooltip="Dashboard"
            onClick={() => setShowDashboard((prev) => !prev)}
          />

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c20016] to-[#d06519] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all duration-200 hover:shadow-lg"
            aria-label="Añadir usuario"
            onClick={openCreateUser}
          >
            <FiPlusCircle size={18} />
            Añadir usuario
          </button>
        </div>
      </div>

      <GenericModal open={showDashboard} onClose={() => setShowDashboard(false)} labelledBy="dashboard-title" className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 id="dashboard-title" className="text-xl font-semibold text-gray-800">Dashboard de Usuarios</h2>
                <p className="mt-1 text-sm text-gray-500">Resumen general del estado del personal.</p>
              </div>
              <button type="button" aria-label="Cerrar dashboard" onClick={() => setShowDashboard(false)} className="rounded-md p-2 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">Total</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">2</span>
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#d06519]">+0%</span>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">Activos</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-800">1</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700">50%</span>
                </div>
              </div>
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-red-700">Inactivos</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-800">1</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-red-700">50%</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Usuarios por cargo</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {userRoleCounts.map(({ role, count }) => (
                  <div key={role} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{role}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                ))}
              </div>
            </div>
      </GenericModal>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Listado de Usuarios</h2>
            <p className="text-sm text-gray-500">Gestiona la información y estados de cada usuario.</p>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar usuario"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#d06519] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100"
              aria-label="Buscar usuario"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selectionMode && <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos los Usuarios"
                    checked={allusersSelected}
                    onChange={(event) => setSelectedusers(event.target.checked ? userIds : [])}
                    className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]"
                  />
                </th>}
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Usuario AD</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="transition-colors hover:bg-orange-50/40">
                {selectionMode && <td className="px-4 py-4 text-center">
                  <input type="checkbox" aria-label="Seleccionar usuario Juan Pérez" checked={selectedusers.includes(1)} onChange={() => toggleuserSelection(1)} className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]" />
                </td>}
                <td className="px-4 py-4 text-sm  text-gray-900">1</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-700">{getRoleLabel(4)}</td>
                <td className="px-4 py-4 text-sm text-gray-700">Juan Pérez</td>
                <td className="px-4 py-4 text-sm text-gray-700">juan.perez@enecon.net.co</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-sky-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-700 shadow-sm ring-1 ring-inset ring-blue-200">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm" />
                    Sin registrar
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-rose-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-700 shadow-sm ring-1 ring-inset ring-red-200">
                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-sm" />
                    Inactivo
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser({ id: 1, rol_id: 4, nombre: "Juan Pérez", email: "juan.perez@enecon.net.co", password_hash: "", usuario_da: false, estado: "INACTIVO" })} />
                    <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser({ id: 1, rol_id: 4, nombre: "Juan Pérez", email: "juan.perez@enecon.net.co", password_hash: "", usuario_da: false, estado: "INACTIVO" })} className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={16} /></button>
                    <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" />
                  </div>
                </td>
              </tr>

              <tr className="transition-colors hover:bg-orange-50/40">
                {selectionMode && <td className="px-4 py-4 text-center">
                  <input type="checkbox" aria-label="Seleccionar usuario María García" checked={selectedusers.includes(2)} onChange={() => toggleuserSelection(2)} className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]" />
                </td>}
                <td className="px-4 py-4 text-sm  text-gray-900">2</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-700">{getRoleLabel(2)}</td>
                <td className="px-4 py-4 text-sm font-boldtext-gray-700">María García</td>
                <td className="px-4 py-4 text-sm text-gray-700">maria.garcia@enecon.net.co</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-50 to-amber-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 shadow-sm ring-1 ring-inset ring-amber-200">
                    <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm" />
                    Registrado
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                    Activo
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser({ id: 2, rol_id: 2, nombre: "María García", email: "maria.garcia@enecon.net.co", password_hash: "", usuario_da: true, estado: "ACTIVO" })} />
                    <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser({ id: 2, rol_id: 2, nombre: "María García", email: "maria.garcia@enecon.net.co", password_hash: "", usuario_da: true, estado: "ACTIVO" })} className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={16} /></button>
                    <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" />
                  </div>
                </td>
              </tr>

              <tr className="transition-colors hover:bg-orange-50/40">
                {selectionMode && <td className="px-4 py-4 text-center"><input type="checkbox" aria-label="Seleccionar usuario Carlos Rodríguez" checked={selectedusers.includes(3)} onChange={() => toggleuserSelection(3)} className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]" /></td>}
                <td className="px-4 py-4 text-sm text-gray-900">3</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-700">{getRoleLabel(3)}</td>
                <td className="px-4 py-4 text-sm text-gray-700">Carlos Rodríguez</td>
                <td className="px-4 py-4 text-sm text-gray-700">carlos.rodriguez@enecon.net.co</td>
                <td className="px-4 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-sky-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-700 shadow-sm ring-1 ring-inset ring-blue-200"><span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm" />Sin registrar</span></td>
                <td className="px-4 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />Activo</span></td>
                <td className="px-4 py-4"><div className="flex items-center gap-2">
                  <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser({ id: 3, rol_id: 3, nombre: "Carlos Rodríguez", email: "carlos.rodriguez@enecon.net.co", password_hash: "", usuario_da: false, estado: "ACTIVO" })} />
                  <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser({ id: 3, rol_id: 3, nombre: "Carlos Rodríguez", email: "carlos.rodriguez@enecon.net.co", password_hash: "", usuario_da: false, estado: "ACTIVO" })} className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={16} /></button>
                  <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" />
                </div></td>
              </tr>

              <tr className="transition-colors hover:bg-orange-50/40">
                {selectionMode && <td className="px-4 py-4 text-center"><input type="checkbox" aria-label="Seleccionar usuario Laura Martínez" checked={selectedusers.includes(4)} onChange={() => toggleuserSelection(4)} className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]" /></td>}
                <td className="px-4 py-4 text-sm  text-gray-900">4</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-700">{getRoleLabel(4)}</td>
                <td className="px-4 py-4 text-sm text-gray-700">Laura Martínez</td>
                <td className="px-4 py-4 text-sm text-gray-700">laura.martinez@enecon.net.co</td>
                <td className="px-4 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-50 to-amber-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-700 shadow-sm ring-1 ring-inset ring-amber-200"><span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm" />Registrado</span></td>
                <td className="px-4 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />Activo</span></td>
                <td className="px-4 py-4"><div className="flex items-center gap-2">
                  <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser({ id: 4, rol_id: 4, nombre: "Laura Martínez", email: "laura.martinez@enecon.net.co", password_hash: "", usuario_da: true, estado: "ACTIVO" })} />
                  <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser({ id: 4, rol_id: 4, nombre: "Laura Martínez", email: "laura.martinez@enecon.net.co", password_hash: "", usuario_da: true, estado: "ACTIVO" })} className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={16} /></button>
                  <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" />
                </div></td>
              </tr>

              <tr className="transition-colors hover:bg-orange-50/40">
                {selectionMode && <td className="px-4 py-4 text-center"><input type="checkbox" aria-label="Seleccionar usuario Andrés López" checked={selectedusers.includes(5)} onChange={() => toggleuserSelection(5)} className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]" /></td>}
                <td className="px-4 py-4 text-sm  text-gray-900">5</td>
                <td className="px-4 py-4 text-sm font-bold text-gray-700">{getRoleLabel(2)}</td>
                <td className="px-4 py-4 text-sm text-gray-700">Andrés López</td>
                <td className="px-4 py-4 text-sm text-gray-700">andres.lopez@enecon.net.co</td>
                <td className="px-4 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-sky-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-700 shadow-sm ring-1 ring-inset ring-blue-200"><span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm" />Sin registrar</span></td>
                <td className="px-4 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-rose-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-700 shadow-sm ring-1 ring-inset ring-red-200"><span className="h-2 w-2 rounded-full bg-red-500 shadow-sm" />Inactivo</span></td>
                <td className="px-4 py-4"><div className="flex items-center gap-2">
                  <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser({ id: 5, rol_id: 2, nombre: "Andrés López", email: "andres.lopez@enecon.net.co", password_hash: "", usuario_da: false, estado: "INACTIVO" })} />
                  <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser({ id: 5, rol_id: 2, nombre: "Andrés López", email: "andres.lopez@enecon.net.co", password_hash: "", usuario_da: false, estado: "INACTIVO" })} className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={16} /></button>
                  <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" />
                </div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <GenericModal open={showCreateUser} onClose={closeUserModal} labelledBy="create-user-title" className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 id="create-user-title" className="text-xl font-semibold text-gray-800">{isViewingUser ? "Ver usuario" : userToEdit ? "Editar usuario" : "Crear usuario"}</h2>
                <p className="mt-1 text-sm text-gray-500">{isViewingUser ? "Consulta los datos del usuario." : userToEdit ? "Actualiza los datos del usuario." : "Completa los datos del nuevo usuario."}</p>
              </div>
              <button type="button" aria-label="Cerrar" onClick={closeUserModal} className="rounded-md p-2 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>
            <form key={userToEdit ? userToEdit.email : "create"} className="space-y-5 p-6" onSubmit={(event) => { event.preventDefault(); closeUserModal(); }}>
              {isViewingUser ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-50 bg-orange-50 p-4 md:col-span-2">
                    <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#d06519]">Nombre</h3>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-lg font-semibold text-gray-800">{userToEdit?.nombre || "—"}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-bold uppercase text-gray-700 ring-1 ring-inset ring-gray-200">{userToEdit?.estado || userToEdit?.status || "—"}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-bold uppercase text-[#d06519] ring-1 ring-inset ring-orange-200">Rol ID: {userToEdit?.rol_id ?? "—"}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Email</span>
                    <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.email || "—"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Estado</span>
                    <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.estado || userToEdit?.status || "—"}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Usuario DA</span>
                    <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.usuario_da ? "Sí" : "No"}</p>
                  </div>
                </div>
              ) : userToEdit ? <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 border-b border-gray-100 pb-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">Usuario del Directorio Activo
                    <select value={selectedDirectoryUser} onChange={(event) => setSelectedDirectoryUser(event.target.value)} disabled={isViewingUser} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500">
                      <option value="">Selecciona un usuario</option>
                      {activeDirectoryUsers.map((user) => <option key={user.id} value={user.id}>{user.nombre}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-gray-700">Rol
                    <select name="rol_id" disabled={isViewingUser} defaultValue={userToEdit?.rol_id ?? ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500">
                      <option value="" disabled>Selecciona un rol</option>
                      {roleOptions.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">Nombre<input required maxLength={100} name="nombre" disabled={isViewingUser} defaultValue={userToEdit?.nombre || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                <label className="text-sm font-medium text-gray-700">Estado<select required name="status" disabled={isViewingUser} defaultValue={userToEdit?.estado || userToEdit?.status || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"><option value="" disabled>Selecciona un estado</option><option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option></select></label>
                <label className="text-sm font-medium text-gray-700 sm:col-span-2">Email<input required type="email" maxLength={150} name="email" disabled={isViewingUser} defaultValue={userToEdit?.email || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                </div>
              </div> : <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">Usuario del Directorio Activo
                    <select required value={selectedDirectoryUser} onChange={(event) => setSelectedDirectoryUser(event.target.value)} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20">
                      <option value="">Selecciona un usuario</option>
                      {activeDirectoryUsers.map((user) => <option key={user.id} value={user.id}>{user.nombre}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-gray-700">Rol
                    <select required value={selectedCreateRole} onChange={(event) => setSelectedCreateRole(event.target.value)} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20">
                      <option value="">Selecciona un rol</option>
                      {roleOptions.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
                    </select>
                  </label>
                </div>
                {selectedDirectoryUser && <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-gray-700">Nombre
                    <input readOnly value={selectedDirectoryUserData?.nombre || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-normal text-gray-600" />
                  </label>
                  <label className="text-sm font-medium text-gray-700">Estado
                    <input readOnly value={selectedDirectoryUserData?.estado || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-normal text-gray-600" />
                  </label>
                  <label className="text-sm font-medium text-gray-700">Correo electrónico
                    <input readOnly type="email" value={selectedDirectoryUserData?.email || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-normal text-gray-600" />
                  </label>
                </div>}
              </div>}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeUserModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                {!isViewingUser && <button type="submit" className="rounded-lg bg-gradient-to-r from-[#c20016] to-[#d06519] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg">{userToEdit ? "Guardar cambios" : "Crear usuario"}</button>}
              </div>
            </form>
      </GenericModal>

      {/* Paginador Visual */}
      <div className="flex items-center py-2 justify-between border border-gray-200 p-2 rounded-md bg-white mt-4">
        <div className="pagination-info text-sm flex items-center space-x-2">
          <span>Cantidad de filas</span>
          <select className="border border-gray-200 rounded py-2 text-sm m-2" aria-label="Cantidad de filas por página">
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="pagination-controls text-xs flex items-center space-x-2">
          <span>1 de 1</span>
          <button
            type="button"
            className="mr-2 border border-gray-200 flex items-center justify-center p-1 rounded-md opacity-50 cursor-not-allowed"
            aria-label="Página anterior"
            disabled
          >
            <IoIosArrowBack size={20} />
          </button>
          <button
            type="button"
            className="border border-gray-200 flex items-center justify-center p-1 rounded-md opacity-50 cursor-not-allowed"
            aria-label="Página siguiente"
            disabled
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;