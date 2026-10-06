import React, { useRef, useState } from "react";
import { Edit, Trash, Eye, Search, Users, LayoutDashboard, SquareDashedMousePointer, Folder, FileSignature } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import exampleSignature from "../../assets/images/firma.png";

const users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    phone: "+57 300 123 4567",
    date: "2026-03-15",
    role: "SUPER-ADMINISTRADOR",
    roleClass: "text-blue-500 bg-cyan-100",
  },
  {
    id: 2,
    name: "Maria Gómez",
    email: "maria.gomez@ejemplo.com",
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

const Contract = () => {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const signatureCanvas = useRef(null);
  const isDrawingSignature = useRef(false);
  const [signature, setSignature] = useState("");
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const contracts = [
    {
      id: 1,
      name: "Contrato de Seguridad y Salud Ocupacional",
      description: "Monitoreo, prevención y control de riesgos laborales para el personal de la empresa.",
      createdAt: "2026-03-15",
      status: "INACTIVO",
    },
    {
      id: 2,
      name: "Contrato de Mantenimiento General",
      description: "Servicio técnico de mantenimiento preventivo y correctivo de infraestructura y equipos.",
      createdAt: "2026-03-20",
      status: "ACTIVO",
    },
    {
      id: 3,
      name: "Contrato de Operaciones y Logística",
      description: "Gestión operativa, coordinación y control de procesos logísticos del negocio.",
      createdAt: "2026-03-21",
      status: "ACTIVO",
    },
    {
      id: 4,
      name: "Contrato de Recursos Humanos",
      description: "Administración del personal, contratación, capacitación y bienestar laboral.",
      createdAt: "2026-03-22",
      status: "ACTIVO",
    },
    {
      id: 5,
      name: "Contrato de Calidad y Procesos",
      description: "Aseguramiento de calidad, auditoría y mejora continua de procesos institucionales.",
      createdAt: "2026-03-23",
      status: "INACTIVO",
    },
  ];
  const contractIds = contracts.map((contract) => contract.id);
  const contractRoleCounts = [
    { role: "SEGURIDAD", count: 1 },
    { role: "MANTENIMIENTO", count: 1 },
    { role: "OPERACIONES", count: 1 },
    { role: "RRHH", count: 1 },
    { role: "CALIDAD", count: 1 },
  ];
  const allContractsSelected = selectedContracts.length === contractIds.length;

  const toggleContractSelection = (contractId) => {
    const nextSelection = selectedContracts.includes(contractId)
      ? selectedContracts.filter((id) => id !== contractId)
      : [...selectedContracts, contractId];
    setSelectedContracts(nextSelection);
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
    setShowCreateUser(true);
  };

  const closeUserModal = () => {
    setShowCreateUser(false);
    setUserToEdit(null);
    setIsViewingUser(false);
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
            <FileSignature size={18} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">APPSIG</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Contratos</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-[#d06519]">Enecon</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ActionButton
            icon={SquareDashedMousePointer}
            label={selectionMode ? "Cancelar selección" : "Seleccionar todo"}
            tooltip={selectionMode ? "Cancelar selección" : "Seleccionar todo"}
            onClick={() => {
              setSelectionMode((active) => !active);
              setSelectedContracts([]);
            }}
          />
          {selectedContracts.length > 1 && (
            <ActionButton
              icon={Trash}
              label="Eliminar seleccionados"
              tooltip={`Eliminar seleccionados (${selectedContracts.length})`}
              className="text-[#d06519] hover:border-orange-200 hover:bg-orange-50"
              onClick={() => {
                setSelectedContracts([]);
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
            aria-label="Añadir contrato"
            onClick={() => setShowCreateUser(true)}
          >
            <FiPlusCircle size={18} />
            Añadir contrato
          </button>
        </div>
      </div>

      <GenericModal open={showDashboard} onClose={() => setShowDashboard(false)} labelledBy="dashboard-title" className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 id="dashboard-title" className="text-xl font-semibold text-gray-800">Dashboard de contratos</h2>
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
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Contratos por cargo</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {contractRoleCounts.map(({ role, count }) => (
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
            <h2 className="text-xl font-bold text-gray-900">Listado de contratos</h2>
            <p className="text-sm text-gray-500">Gestiona la información y estados de cada contrato.</p>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar contrato"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#d06519] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100"
              aria-label="Buscar contrato"
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
                    aria-label="Seleccionar todos los contratos"
                    checked={allContractsSelected}
                    onChange={(event) => setSelectedContracts(event.target.checked ? contractIds : [])}
                    className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]"
                  />
                </th>}
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Descripción</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Fecha de creación</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {contracts.map((contract) => {
                const isActive = contract.status === "ACTIVO";

                return (
                  <tr key={contract.id} className="transition-colors hover:bg-orange-50/40">
                    {selectionMode && (
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Seleccionar contrato ${contract.name}`}
                          checked={selectedContracts.includes(contract.id)}
                          onChange={() => toggleContractSelection(contract.id)}
                          className="h-4 w-4 rounded border-gray-300 accent-[#d06519] focus:ring-[#d06519]"
                        />
                      </td>
                    )}
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{contract.id}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">{contract.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{contract.description}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{new Date(`${contract.createdAt}T00:00:00`).toLocaleDateString("es-CO")}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide shadow-sm ring-1 ring-inset ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-700 ring-emerald-200"
                            : "bg-gradient-to-r from-red-50 to-rose-100 text-red-700 ring-red-200"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"} shadow-sm`} />
                        {isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon={Eye}
                          label="Ver contrato"
                          tooltip="Ver contrato"
                          onClick={() => openViewUser(contract)}
                        />
                        <button
                          type="button"
                          aria-label="Editar contrato"
                          title="Editar contrato"
                          onClick={() => openEditUser(contract)}
                          className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"
                        >
                          <Edit size={16} />
                        </button>
                        <ActionButton icon={Trash} label="Eliminar contrato" tooltip="Eliminar contrato" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <GenericModal open={showCreateUser} onClose={closeUserModal} labelledBy="create-user-title" className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 id="create-user-title" className="text-xl font-semibold text-gray-800">{isViewingUser ? "Ver contrato" : userToEdit ? "Editar contrato" : "Crear contrato"}</h2>
                <p className="mt-1 text-sm text-gray-500">{isViewingUser ? "Consulta los datos del contrato." : userToEdit ? "Actualiza los datos del contrato." : "Completa los datos del nuevo contrato."}</p>
              </div>
              <button type="button" aria-label="Cerrar" onClick={closeUserModal} className="rounded-md p-2 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>
            <form key={userToEdit ? userToEdit.id : "create"} className="space-y-5 p-6" onSubmit={(event) => { event.preventDefault(); closeUserModal(); }}>
              {isViewingUser ? (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 rounded-2xl bg-orange-50/60 p-4 ring-1 ring-inset ring-orange-100 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Nombre</p>
                      <h3 className="mt-2 text-2xl font-bold text-[#d06519]">{userToEdit?.name}</h3>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Estado</p>
                      <span className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide shadow-sm ring-1 ring-inset ${userToEdit?.status === "ACTIVO" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"}`}>
                        <span className={`h-2 w-2 rounded-full ${userToEdit?.status === "ACTIVO" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {userToEdit?.status}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Descripción</p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{userToEdit?.description}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-2">
                      <label className="text-sm font-medium text-gray-700">Nombre<input required name="name" disabled={isViewingUser} defaultValue={userToEdit?.name || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                      <label className="text-sm font-medium text-gray-700">Estado<select required name="status" disabled={isViewingUser} defaultValue={userToEdit?.status || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"><option value="" disabled>Selecciona un estado</option><option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option></select></label>
                    </div>
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">Descripción<textarea required name="description" rows={3} disabled={isViewingUser} defaultValue={userToEdit?.description || ""} className="mt-1.5 w-full resize-y rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeUserModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                {!isViewingUser && <button type="submit" className="rounded-lg bg-gradient-to-r from-[#c20016] to-[#d06519] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg">{userToEdit ? "Guardar cambios" : "Crear contrato"}</button>}
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

export default Contract;