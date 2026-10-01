import React, { useRef, useState } from "react";
import { Edit, Trash, Eye, Search,Users } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";

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
      className={`relative flex h-5 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm ${className}`}
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

const Employee = () => {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const signatureCanvas = useRef(null);
  const isDrawingSignature = useRef(false);
  const [signature, setSignature] = useState("");

  const getSignaturePoint = (event) => {
    const canvas = signatureCanvas.current;
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
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
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
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
            <HiOutlineUserGroup size={18} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">Recursos Humanos</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">Empleados</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-[#d06519]">Enecon</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c20016] to-[#d06519] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all duration-200 hover:shadow-lg"
          aria-label="Añadir empleado"
          onClick={() => setShowCreateUser(true)}
        >
          <FiPlusCircle size={18} />
          Añadir empleado
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Listado de empleados</h2>
            <p className="text-sm text-gray-500">Gestiona la información y estados de cada empleado.</p>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar empleado"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#d06519] focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100"
              aria-label="Buscar empleado"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Cargo</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Nombres</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Apellidos</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Documento</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Fecha ingreso</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Firma</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em] text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="transition-colors hover:bg-orange-50/40">
                <td className="px-4 py-4 text-sm font-bold text-gray-900">1</td>
                <td className="px-4 py-4 text-sm font-semibold uppercase text-gray-900">SST</td>
                <td className="px-4 py-4 text-sm text-gray-700">Juan</td>
                <td className="px-4 py-4 text-sm text-gray-700">Pérez</td>
                <td className="px-4 py-4 text-sm text-gray-700">1234567890</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-rose-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-700 shadow-sm ring-1 ring-inset ring-red-200">
                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-sm" />
                    Inactivo
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">15/03/2026</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-700">JP</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ActionButton icon={Eye} label="Ver empleado" tooltip="Ver empleado" onClick={() => openViewUser({ firstName: "Juan", lastName: "Pérez", document: "1234567890", role: "SST", status: "INACTIVO", hireDate: "2026-03-15", signature: "" })} />
                    <button type="button" aria-label="Editar empleado" title="Editar empleado" onClick={() => openEditUser({ firstName: "Juan", lastName: "Pérez", document: "1234567890", role: "SST", status: "INACTIVO", hireDate: "2026-03-15", signature: "" })} className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={16} /></button>
                    <ActionButton icon={Trash} label="Eliminar empleado" tooltip="Eliminar empleado" />
                  </div>
                </td>
              </tr>

              <tr className="transition-colors hover:bg-orange-50/40">
                <td className="px-4 py-4 text-sm font-bold text-gray-900">2</td>
                <td className="px-4 py-4 text-sm font-semibold uppercase text-gray-900">ENCARGADO</td>
                <td className="px-4 py-4 text-sm text-gray-700">María</td>
                <td className="px-4 py-4 text-sm text-gray-700">García</td>
                <td className="px-4 py-4 text-sm text-gray-700">9876543210</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                    Activo
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">20/03/2026</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-700">MG</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ActionButton icon={Eye} label="Ver empleado" tooltip="Ver empleado" onClick={() => openViewUser({ firstName: "María", lastName: "García", document: "9876543210", role: "ENCARGADO", status: "ACTIVO", hireDate: "2026-03-20", signature: "" })} />
                    <button type="button" aria-label="Editar empleado" title="Editar empleado" onClick={() => openEditUser({ firstName: "María", lastName: "García", document: "9876543210", role: "ENCARGADO", status: "ACTIVO", hireDate: "2026-03-20", signature: "" })} className="relative flex h-8 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={16} /></button>
                    <ActionButton icon={Trash} label="Eliminar empleado" tooltip="Eliminar empleado" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showCreateUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeUserModal();
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="create-user-title" className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 id="create-user-title" className="text-xl font-semibold text-gray-800">{isViewingUser ? "Ver empleado" : userToEdit ? "Editar empleado" : "Crear empleado"}</h2>
                <p className="mt-1 text-sm text-gray-500">{isViewingUser ? "Consulta los datos del empleado." : userToEdit ? "Actualiza los datos del empleado." : "Completa los datos del nuevo empleado."}</p>
              </div>
              <button type="button" aria-label="Cerrar" onClick={closeUserModal} className="rounded-md p-2 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>
            <form key={userToEdit ? userToEdit.email : "create"} className="space-y-5 p-6" onSubmit={(event) => { event.preventDefault(); closeUserModal(); }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                
                <label className="text-sm font-medium text-gray-700">Cargo<select required name="role" disabled={isViewingUser} defaultValue={userToEdit?.role || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"><option value="" disabled>Selecciona un cargo</option><option value="SUPER-ADMINISTRADOR">SUPER-ADMINISTRADOR</option><option value="ENCARGADO">ENCARGADO</option><option value="OPERARIO">OPERARIO</option><option value="SST">SST</option></select></label>
                <label className="text-sm font-medium text-gray-700">Nombres<input required name="firstName" disabled={isViewingUser} defaultValue={userToEdit?.firstName || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                <label className="text-sm font-medium text-gray-700">Apellidos<input required name="lastName" disabled={isViewingUser} defaultValue={userToEdit?.lastName || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                <label className="text-sm font-medium text-gray-700">Documento<input required name="document" disabled={isViewingUser} defaultValue={userToEdit?.document || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                <label className="text-sm font-medium text-gray-700">Estado<select required name="status" disabled={isViewingUser} defaultValue={userToEdit?.status || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"><option value="" disabled>Selecciona un estado</option><option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option></select></label>
                <label className="text-sm font-medium text-gray-700">Fecha de ingreso<input required type="date" name="hireDate" disabled={isViewingUser} defaultValue={userToEdit?.hireDate || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                <div className="text-sm font-medium text-gray-700 sm:col-span-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="employee-signature">Firma</label>
                    {!isViewingUser && <button type="button" onClick={clearSignature} className="text-xs font-semibold text-[#d06519] hover:underline">Borrar firma</button>}
                  </div>
                  <canvas id="employee-signature" ref={signatureCanvas} width={600} height={150} aria-label="Dibuje su firma aquí" className={`w-full rounded-md border border-dashed border-gray-400 bg-white ${isViewingUser ? "cursor-not-allowed" : "touch-none cursor-crosshair"}`} style={{ height: "120px", touchAction: "none" }} onPointerDown={startSignature} onPointerMove={drawSignature} onPointerUp={() => { isDrawingSignature.current = false; }} onPointerCancel={() => { isDrawingSignature.current = false; }} />
                  <input type="hidden" name="signature" value={signature || userToEdit?.signature || ""} />
                  <p className="mt-1 text-xs font-normal text-gray-500">Dibuje su firma dentro del recuadro.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeUserModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                {!isViewingUser && <button type="submit" className="rounded-lg bg-gradient-to-r from-[#c20016] to-[#d06519] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg">{userToEdit ? "Guardar cambios" : "Crear empleado"}</button>}
              </div>
            </form>
          </section>
        </div>
      )}

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

export default Employee;