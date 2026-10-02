import React, { useEffect, useState } from "react";
import { Edit, Trash, Eye, Search, Users, BarChart3 } from "lucide-react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";

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

const UserList = () => {
  const [tableUsers, setTableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewingUser, setIsViewingUser] = useState(false);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const apiUrl = "http://127.0.0.1:8000/usuarios";

  
  const roleNames = { 1: "administrador", 2: "tecnico", 3: "operario" };
  const roleIds = { administrador: "1", tecnico: "2", operario: "3" };
  const toBoolean = (value) => value === true || value === 1 || value === "1" || value === "true";

  const normalizeUser = (user) => ({
    ...user,
    id: user.id ?? user.usuario_id,
    name: user.nombre ?? user.name ?? "",
    email: user.email ?? "",
    roleId: user.rol_id ?? user.roleId,
    role: roleNames[user.rol_id ?? user.roleId] ?? (user.rol_id ?? user.roleId ? `rol ${user.rol_id ?? user.roleId}` : "Sin rol"),
    activeDirectoryUser: toBoolean(user.usuario_da ?? user.activeDirectoryUser),
    active: toBoolean(user.estado ?? user.active),
  });

  const loadUsers = async () => {
    try {
      setApiError("");
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("No se pudieron cargar los usuarios.");
      const result = await response.json();
      const users = Array.isArray(result) ? result : result.usuarios ?? result.data ?? [];
      setTableUsers(users.map(normalizeUser));
    } catch (error) {
      setApiError(`${error.message} Verifica que la API esté disponible en ${apiUrl}.`);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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

  const toggleUserSelection = (userId) => {
    setSelectedUsers((selected) => selected.includes(userId)
      ? selected.filter((id) => id !== userId)
      : [...selected, userId]);
  };

  const toggleAllUsers = () => {
    setSelectedUsers((selected) => selected.length === tableUsers.length ? [] : tableUsers.map((user) => user.id));
  };

  const editSelectedUser = () => {
    const user = tableUsers.find(({ id }) => id === selectedUsers[0]);
    if (user) openEditUser(user);
  };

  const deleteSelectedUsers = () => {
    Promise.all(selectedUsers.map(async (id) => {
      const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`No se pudo eliminar el usuario ${id}.`);
    }))
      .then(() => { setSelectedUsers([]); loadUsers(); })
      .catch((error) => setApiError(error.message));
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    if (password && password !== form.get("confirmPassword")) {
      setApiError("Las contraseñas no coinciden.");
      return;
    }
    const payload = {
      rol_id: form.get("role") ? Number(form.get("role")) : null,
      nombre: form.get("name").trim(),
      email: form.get("email").trim(),
      usuario_da: form.get("usuario_da") === "on",
      estado: form.get("estado") === "on",
    };
    if (password) payload.password_hash = password;

    try {
      setApiError("");
      const response = await fetch(userToEdit ? `${apiUrl}/${userToEdit.id}` : apiUrl, {
        method: userToEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("No se pudo guardar el usuario.");
      closeUserModal();
      await loadUsers();
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="table-container containerEmporesa">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          aria-expanded={showDashboard}
          aria-controls="users-dashboard"
          onClick={() => setShowDashboard((visible) => !visible)}
          className="flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#d06519] shadow-sm transition hover:bg-orange-50"
        >
          <BarChart3 size={18} />
          {showDashboard ? "Ocultar dashboard" : "Dashboard"}
        </button>
      </div>

      {apiError && <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{apiError}</p>}

      {showDashboard && (
        <section id="users-dashboard" aria-label="Resumen de usuarios" className="mb-5 rounded-lg border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Resumen de usuarios</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm text-gray-500">Total de usuarios</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{tableUsers.length}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm text-gray-500">Administradores</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{tableUsers.filter((user) => Number(user.roleId) === 1).length}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm text-gray-500">Técnicos</p>
              <p className="mt-1 text-2xl font-bold text-[#d06519]">{tableUsers.filter((user) => Number(user.roleId) === 2).length}</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <p className="text-sm text-gray-500">Estado de usuarios</p>
              <p className="mt-1 text-sm font-semibold"><span className="text-emerald-600">{tableUsers.filter((user) => user.active).length} activos</span><span className="mx-2 text-gray-300">|</span><span className="text-red-600">{tableUsers.filter((user) => !user.active).length} inactivos</span></p>
            </div>
          </div>
        </section>
      )}

      <div className="mb-5 z-50">
        <div className="flex items-center space-x-2 text-gray-700">
          <HiOutlineUserGroup size={20} />
          <span>Usuarios</span>
          <span className="text-black font-bold"> / Enecon </span>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-5 buscadorTable">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar Usuario"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d06519] focus:border-transparent"
            aria-label="Buscar usuario"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b seccionNombreBtn">
          <h2 className="text-xl font-semibold">Usuarios</h2>
          <div className="divisor"></div>
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mr-3" aria-live="polite">
              <span className="text-sm text-gray-600">{selectedUsers.length} seleccionados</span>
              {selectedUsers.length === 1 && (
                <button type="button" onClick={editSelectedUser} className="flex items-center gap-1 rounded-lg border border-orange-200 px-3 py-2 text-sm font-medium text-[#d06519] hover:bg-orange-50">
                  <Edit size={16} /> Editar
                </button>
              )}
              <button type="button" onClick={deleteSelectedUsers} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                <Trash size={16} /> Eliminar masivo
              </button>
            </div>
          )}
          <button
            type="button"
            className="bg-gradient-to-r from-[#c20016] to-[#d06519] text-white px-6 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-shadow duration-200"
            aria-label="Añadir usuario"
            onClick={() => setShowCreateUser(true)}
          >
            <FiPlusCircle size={20} className="mr-2" />
            Añadir usuario
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" aria-label="Seleccionar todos los usuarios" checked={tableUsers.length > 0 && selectedUsers.length === tableUsers.length} onChange={toggleAllUsers} />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
				<th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Nombre 
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Correo electrónico
                </th>
               
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Usuario Registrado DA
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableUsers.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                <tr className="hover:bg-gray-50" key={user.id}>
                  <td className="px-4 py-4"><input type="checkbox" aria-label={`Seleccionar ${user.name}`} checked={selectedUsers.includes(user.id)} onChange={() => toggleUserSelection(user.id)} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 uppercase">{user.role === "tecnico" ? "Técnico" : user.role === "administrador" ? "Administrador" : user.role === "operario" ? "Operario" : user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide shadow-sm ring-1 ring-inset ${user.activeDirectoryUser ? "bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-700 ring-emerald-200" : "bg-gradient-to-r from-red-50 to-rose-100 text-red-700 ring-red-200"}`}>
                      <span className={`h-2 w-2 rounded-full shadow-sm ${user.activeDirectoryUser ? "bg-emerald-500" : "bg-red-500"}`} />
                      {user.activeDirectoryUser ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold"><span className={user.active ? "text-emerald-600" : "text-red-600"}>{user.active ? "Activo" : "Inactivo"}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <ActionButton icon={Users} label="Directorio Activo" tooltip="Directorio Activo" />
                      <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser(user)} />
                      <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser(user)} className="relative flex h-5 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={18} /></button>
                      <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" onClick={async () => { try { const response = await fetch(`${apiUrl}/${user.id}`, { method: "DELETE" }); if (!response.ok) throw new Error("No se pudo eliminar el usuario."); setSelectedUsers((selected) => selected.filter((id) => id !== user.id)); await loadUsers(); } catch (error) { setApiError(error.message); } }} />
                    </div>
                  </td>
                </tr>
              ))}
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
                <h2 id="create-user-title" className="text-xl font-semibold text-gray-800">{isViewingUser ? "Ver usuario" : userToEdit ? "Editar usuario" : "Crear usuario"}</h2>
                <p className="mt-1 text-sm text-gray-500">{isViewingUser ? "Consulta los datos del usuario." : userToEdit ? "Actualiza los datos del usuario." : "Completa los datos del nuevo usuario."}</p>
              </div>
              <button type="button" aria-label="Cerrar" onClick={closeUserModal} className="rounded-md p-2 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>
            <form key={userToEdit ? userToEdit.email : "create"} className="space-y-5 p-6" onSubmit={handleUserSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700 sm:col-span-2">Nombre Completo<input required type="text" name="name" autoComplete="name" disabled={isViewingUser} defaultValue={userToEdit?.name || ""} placeholder="Nombre y apellido" className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                <label className="text-sm font-medium text-gray-700">Rol<select required name="role" disabled={isViewingUser} defaultValue={userToEdit?.roleId ?? roleIds[userToEdit?.role] ?? ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"><option value="" disabled>Selecciona un rol</option><option value="1">Administrador</option><option value="2">Técnico</option><option value="3">Operario</option></select></label>
                <label className="text-sm font-medium text-gray-700">Correo electrónico<input required type="email" name="email" autoComplete="email" disabled={isViewingUser} defaultValue={userToEdit?.email || ""} placeholder="usuario@enecon.net.co" className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
        				{!isViewingUser && <>
        				<label className="text-sm font-medium text-gray-700 sm:col-span-2">Contraseña<input required={!userToEdit} type="password" name="password" autoComplete="new-password" minLength={8} placeholder={userToEdit ? "Dejar en blanco para conservar la contraseña" : "Mínimo 8 caracteres"} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                <label className="text-sm font-medium text-gray-700 sm:col-span-2">Confirmar contraseña<input required={!userToEdit} type="password" name="confirmPassword" autoComplete="new-password" minLength={8} placeholder="Confirmar contraseña" className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                </>}
                {!isViewingUser && <>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" name="usuario_da" defaultChecked={userToEdit?.activeDirectoryUser ?? false} className="rounded border-gray-300 text-[#d06519] focus:ring-[#d06519]" />Usuario registrado en Directorio Activo</label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" name="estado" defaultChecked={userToEdit?.active ?? false} className="rounded border-gray-300 text-[#d06519] focus:ring-[#d06519]" />Usuario activo</label>
                </>}
                {isViewingUser && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:col-span-2"><p className="text-sm text-gray-700">Usuario DA: <strong>{userToEdit?.activeDirectoryUser ? "Sí" : "No"}</strong></p><p className="text-sm text-gray-700">Estado: <strong>{userToEdit?.active ? "Activo" : "Inactivo"}</strong></p></div>}
              </div>
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button type="button" onClick={closeUserModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                {!isViewingUser && <button type="submit" className="rounded-lg bg-gradient-to-r from-[#c20016] to-[#d06519] px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg">{userToEdit ? "Guardar cambios" : "Crear usuario"}</button>}
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

export default UserList;