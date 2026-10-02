import React, { useEffect, useRef, useState } from "react";
import { Edit, Trash, Eye, Search, Users, Upload, FolderDown, ClipboardList, FileUp, Percent,SquareDashedMousePointer   } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi"
const users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    phone: "+57 300 123 4567",
    date: "2026-03-15",
    role: "SUPER-ADMINISTRADOR",
    roleClass: "text-sky-500 bg-cyan-100",
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
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`relative group inline-flex h-5 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 py-4 hover:shadow-sm ${className}`}
  >
    <Icon size={18} />

    <span
      className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1"
    >
      {tooltip}
      <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
    </span>
  </button>
);

const WorkOrder = () => {
  const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/work-orders`;
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const signatureCanvas = useRef(null);
  const bulkUploadInput = useRef(null);
  const isDrawingSignature = useRef(false);
  const [signature, setSignature] = useState("");
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [filesToChange, setFilesToChange] = useState([]);
  const [selectedFileIndexes, setSelectedFileIndexes] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const request = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Error de API (${response.status})`);
    }
    if (response.status === 204) return null;
    return response.json();
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    setApiError("");
    try {
      const result = await request(API_URL);
      setOrders(Array.isArray(result) ? result : result?.data || result?.items || []);
    } catch (error) {
      setApiError(`No se pudieron cargar las órdenes: ${error.message}`);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const toggleOrderSelection = (orderId) => {
    setSelectedOrderIds((selected) => selected.includes(orderId)
      ? selected.filter((id) => id !== orderId)
      : [...selected, orderId]);
  };

  const deleteOrder = async (order) => {
    if (!window.confirm(`¿Eliminar la orden ${order.otNumber || order.document || "seleccionada"}?`)) return;
    try {
      await request(`${API_URL}/${encodeURIComponent(order.id ?? order._id)}`, { method: "DELETE" });
      setOrders((current) => current.filter((item) => (item.id ?? item._id) !== (order.id ?? order._id)));
      setSelectedOrderIds((current) => current.filter((id) => id !== (order.id ?? order._id)));
      setApiError("");
    } catch (error) { setApiError(`No se pudo eliminar la orden: ${error.message}`); }
  };

  const deleteSelectedOrders = async () => {
    const selected = orders.filter((order) => selectedOrderIds.includes(order.id ?? order._id));
    for (const order of selected) {
      try { await request(`${API_URL}/${encodeURIComponent(order.id ?? order._id)}`, { method: "DELETE" }); }
      catch (error) { setApiError(`No se pudieron eliminar todas las órdenes: ${error.message}`); await loadOrders(); return; }
    }
    setOrders((current) => current.filter((order) => !selectedOrderIds.includes(order.id ?? order._id)));
    setSelectedOrderIds([]);
  };

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
    <div className="table-container containerEmporesa">
      
      <div className="mb-5 z-50">
        <div className="flex items-center space-x-2 text-gray-700">
          <ClipboardList size={20} />
          <span>Ordenes de Trabajo</span>
          <span className="text-black font-bold"> / Enecon </span>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-5 buscadorTable">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar Orden de Trabajo"
            className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d06519] focus:border-transparent"
            aria-label="Buscar Orden de Trabajo"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b seccionNombreBtn">
          <h2 className="text-xl font-semibold">Ordenes de Trabajo</h2>
          <div className="divisor"></div>
          <div className="flex items-center gap-3">
             <button
              type="button"
              className="relative group bg-white text-orange-500 px-2 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
              aria-label="Carga masiva de órdenes de trabajo"
              onClick={() => {
                setIsSelectionMode((enabled) => !enabled);
                setSelectedOrderIds([]);
              }}
            >
              <SquareDashedMousePointer size={20} className="mr-" />
             
              <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1">
                {isSelectionMode ? "Cancelar selección" : "Seleccionar"}
                <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
              </span>
            </button>

            {selectedOrderIds.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Editar ordenes seleccionadas"
                  className="relative group bg-white text-orange-500 px-2 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
                  onClick={() => openEditUser(orders.find((order) => (order.id ?? order._id) === selectedOrderIds[0]))}
                >
                  <Edit size={20} />
                  <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1">
                    Editar
                    <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Eliminar ordenes seleccionadas"
                  className="relative group bg-white text-orange-500 px-2 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
                  onClick={deleteSelectedOrders}
                >
                  <Trash size={20} />
                  <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1">
                    Eliminar
                    <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
                  </span>
                </button>
              </>
            )}
			 <button
              type="button"
              className="relative group bg-white text-orange-500 px-2 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
              aria-label="Carga masiva de órdenes de trabajo"
              onClick={() => bulkUploadInput.current?.click()}
            >
              <FileUp size={20} className="mr-" />
             
              <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1">
                Carga masiva
                <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
              </span>
            </button>

            
			 <button
              type="button"
              className="relative group bg-white text-orange-500 px-2 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
              aria-label="Carga masiva de órdenes de trabajo"
              onClick={() => bulkUploadInput.current?.click()}
            >
              <FolderDown size={20} className="mr-" />
             
              <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1">
                Descarga ordenes ejecutadas
                <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
              </span>
            </button>
            <button
              type="button"
              className="relative group bg-white text-orange-500 px-2 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
              aria-label="Carga masiva de órdenes de trabajo"
              onClick={() => bulkUploadInput.current?.click()}
            >
              <Percent  size={20} className="m" />
             
              <span className="pointer-events-none absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xl bg-orange-700 px-2.5 py-1.5 text-[10px] font-semibold tracking-wide text-white shadow-lg opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:-translate-y-1">
               Porcentaje de ejecución
                <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-sm bg-orange-700" />
              </span>
            </button>
            <button
              type="button"
              className="bg-gradient-to-r from-[#c20016] to-[#d06519] text-white px-6 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
              aria-label="Añadir Orden de Trabajo"
              onClick={() => setShowCreateUser(true)}
            >
              <FiPlusCircle size={20} className="mr-2" />
              Añadir Orden de Trabajo
            </button>
            <input
              ref={bulkUploadInput}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              aria-label="Seleccionar archivo de órdenes de trabajo"
            />
           
          </div>
        </div>

        {showFileSelector && (
          <div className="border-b border-gray-200 bg-gray-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex-1 text-sm font-medium text-gray-700">
                Selecciona los archivos que quieres cambiar
                <input
                  type="file"
                  multiple
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
                  aria-label="Seleccionar archivos para cambiar"
                  onChange={(event) => {
                    setFilesToChange(Array.from(event.target.files || []));
                    setSelectedFileIndexes([]);
                  }}
                />
              </label>
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-[#c20016] to-[#d06519] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                onClick={() => setSelectedFileIndexes(filesToChange.map((_, index) => index))}
                disabled={filesToChange.length === 0}
              >
                Todos
              </button>
            </div>
            {filesToChange.length > 0 && (
              <div className="mt-4 space-y-2">
                {filesToChange.map((file, index) => (
                  <label key={`${file.name}-${index}`} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedFileIndexes.includes(index)}
                      onChange={(event) => setSelectedFileIndexes((current) => event.target.checked
                        ? [...current, index]
                        : current.filter((selectedIndex) => selectedIndex !== index))}
                    />
                    {file.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {isSelectionMode && <th className="px-4 py-3" aria-label="Seleccionar órdenes" />}
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
				<th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">

                  Número OT
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
	                  Actividad
                </th>
				  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingOrders ? <tr><td colSpan={isSelectionMode ? 8 : 7} className="p-6 text-center text-gray-500">Cargando órdenes...</td></tr> :
                orders.filter((order) => Object.values(order).some((value) => String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase()))).map((order) => {
                  const id = order.id ?? order._id;
                  return <tr key={id} className="hover:bg-gray-50">
                    {isSelectionMode && <td className="px-4 py-4 text-center"><input type="checkbox" aria-label={`Seleccionar ${order.otNumber || "orden"}`} checked={selectedOrderIds.includes(id)} onChange={() => toggleOrderSelection(id)} className="h-4 w-4 accent-[#d06519]" /></td>}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 uppercase">{order.otNumber || order.document}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.activity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.responsible}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                      <ActionButton icon={Eye} label="Ver Orden de Trabajo" tooltip="Ver Orden de Trabajo" onClick={() => openViewUser(order)} />
                      <ActionButton icon={Edit} label="Editar Orden de Trabajo" tooltip="Editar Orden de Trabajo" onClick={() => openEditUser(order)} />
                      <ActionButton icon={Trash} label="Eliminar Orden de Trabajo" tooltip="Eliminar Orden de Trabajo" onClick={() => deleteOrder(order)} />
                    </td>
                  </tr>;
                })}
              {!loadingOrders && orders.length === 0 && <tr><td colSpan={isSelectionMode ? 8 : 7} className="p-6 text-center text-gray-500">No hay órdenes de trabajo.</td></tr>}
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
                <h2 id="create-user-title" className="text-xl font-semibold text-gray-800">{isViewingUser ? "Ver Orden de Trabajo" : userToEdit ? "Editar Orden de Trabajo" : "Crear Orden de Trabajo"}</h2>
                <p className="mt-1 text-sm text-gray-500">{isViewingUser ? "Consulta los datos del Orden de Trabajo." : userToEdit ? "Actualiza los datos del Orden de Trabajo." : "Completa los datos del nuevo Orden de Trabajo."}</p>
              </div>
              <button type="button" aria-label="Cerrar" onClick={closeUserModal} className="rounded-md p-2 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>
            <form key={userToEdit ? userToEdit.id ?? userToEdit._id ?? userToEdit.otNumber : "create"} className="space-y-5 p-6" onSubmit={async (event) => {
              event.preventDefault();
              const values = Object.fromEntries(new FormData(event.currentTarget).entries());
              setSavingOrder(true);
              setApiError("");
              try {
                const editing = Boolean(userToEdit);
                const saved = await request(editing ? `${API_URL}/${encodeURIComponent(userToEdit.id ?? userToEdit._id)}` : API_URL, {
                  method: editing ? "PUT" : "POST",
                  body: JSON.stringify(values),
                });
                if (editing) setOrders((current) => current.map((order) => (order.id ?? order._id) === (userToEdit.id ?? userToEdit._id) ? { ...order, ...values, ...(saved?.data || saved || {}) } : order));
                else setOrders((current) => [...current, saved?.data || saved || values]);
                closeUserModal();
              } catch (error) { setApiError(`No se pudo guardar la orden: ${error.message}`); }
              finally { setSavingOrder(false); }
            }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {isViewingUser ? (
                  <div className="w-full md:col-span-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 border-b border-dashed border-gray-300 pb-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d06519]">Documento</p>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-2xl font-bold text-gray-800">{userToEdit?.otNumber || userToEdit?.document || "OT sin número"}</h3>
                          <span className="inline-flex items-center rounded-full bg-[#d06519]/10 px-3 py-1 text-xs font-semibold text-[#d06519]">
                            {userToEdit?.status || "Sin estado"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Prioridad</span>
                          <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.priority || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Actividad</span>
                          <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.activity || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 md:col-span-2">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Dirección</span>
                          <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.address || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Responsable</span>
                          <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.responsible || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Gestor SST</span>
                          <p className="mt-2 text-base font-medium text-gray-800">{userToEdit?.sstManager || "—"}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 md:col-span-2">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Observaciones</span>
                          <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-gray-700">
                            {userToEdit?.observations || "No se registraron observaciones."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <label className="text-sm font-medium text-gray-700">Prioridad<select required name="priority" defaultValue={userToEdit?.priority || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20"><option value="" disabled>Selecciona una prioridad</option><option value="ALTA">ALTA</option><option value="MEDIA">MEDIA</option><option value="BAJA">BAJA</option></select></label>
                    <label className="text-sm font-medium text-gray-700">Número OT<input required name="otNumber" defaultValue={userToEdit?.otNumber || userToEdit?.document || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                    <label className="text-sm font-medium text-gray-700">Actividad<input required name="activity" defaultValue={userToEdit?.activity || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                    <label className="text-sm font-medium text-gray-700">Dirección<input required name="address" defaultValue={userToEdit?.address || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                    <label className="text-sm font-medium text-gray-700">Estado<select required name="status" defaultValue={userToEdit?.status || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20"><option value="" disabled>Selecciona un estado</option><option value="EJECUTADO">EJECUTADO</option><option value="SUSPENDIDO">SUSPENDIDO</option><option value="CANCELADO">CANCELADO</option><option value="REASIGNADO">REASIGNADO</option><option value="INACTIVO">INACTIVO</option><option value="ACTIVO">ACTIVO</option></select></label>
                    <label className="text-sm font-medium text-gray-700">Responsable<input required name="responsible" defaultValue={userToEdit?.responsible || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">Gestor SST<input required name="sstManager" defaultValue={userToEdit?.sstManager || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                    <label className="text-sm font-medium text-gray-700 sm:col-span-2">Observaciones<textarea required name="observations" rows={4} defaultValue={userToEdit?.observations || ""} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeUserModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                {!isViewingUser && <button type="submit" disabled={savingOrder} className="rounded-lg bg-gradient-to-r from-[#c20016] to-[#d06519] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-60">{savingOrder ? "Guardando..." : userToEdit ? "Guardar cambios" : "Crear Orden de Trabajo"}</button>}
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

export default WorkOrder;