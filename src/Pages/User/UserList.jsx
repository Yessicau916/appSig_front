import React, { useState } from "react";
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

const UserList = () => {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isViewingUser, setIsViewingUser] = useState(false);

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
            className="w-full border border-gray-300 p-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d06519] focus:border-transparent"
            aria-label="Buscar usuario"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b seccionNombreBtn">
          <h2 className="text-xl font-semibold">Usuarios</h2>
          <div className="divisor"></div>
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
                  Usuario DA
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
             
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 uppercase">
                  Administrador
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Juan Perez
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Juan.Perez@enecon.net.co
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50 to-rose-100 px-3 py-1.5 text-xs font-bold tracking-wide text-red-700 shadow-sm ring-1 ring-inset ring-red-200">
                    <span className="h-2 w-2 rounded-full bg-red-500 shadow-sm" />
                    INACTIVO
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                  <ActionButton icon={Users} label="Directorio Activo" tooltip="Directorio Activo" />
                  <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser({ name: "Juan Perez", role: "administrador", email: "Juan.Perez@enecon.net.co", activeDirectoryUser: "INACTIVO" })} />
                  <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser({ name: "Juan Perez", role: "administrador", email: "Juan.Perez@enecon.net.co", password: "", activeDirectoryUser: "ACTIVO" })} className="relative flex h-5 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={18} /></button>
                  <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" />
                </td>
              </tr>
			 <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  2
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 uppercase">
                  Técnico
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Maria Garcia
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Maria.Garcia@enecon.net.co
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-100 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                    ACTIVO
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                  <ActionButton icon={Users} label="Directorio Activo" tooltip="Directorio Activo" />
                  <ActionButton icon={Eye} label="Ver usuario" tooltip="Ver usuario" onClick={() => openViewUser({ name: "Maria Garcia", role: "tecnico", email: "Maria.Garcia@enecon.net.co", activeDirectoryUser: "ACTIVO" })} />
                  <button type="button" aria-label="Editar usuario" title="Editar usuario" onClick={() => openEditUser({ name: "Maria Garcia", role: "tecnico", email: "Maria.Garcia@enecon.net.co", password: "", activeDirectoryUser: "ACTIVO" })} className="relative flex h-5 w-9 items-center justify-center rounded-lg border border-transparent text-[#d06519] transition-all duration-200 hover:border-[#f7d7c2] hover:bg-orange-100 hover:shadow-sm"><Edit size={18} /></button>
                  <ActionButton icon={Trash} label="Eliminar usuario" tooltip="Eliminar usuario" />
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
                <h2 id="create-user-title" className="text-xl font-semibold text-gray-800">{isViewingUser ? "Ver usuario" : userToEdit ? "Editar usuario" : "Crear usuario"}</h2>
                <p className="mt-1 text-sm text-gray-500">{isViewingUser ? "Consulta los datos del usuario." : userToEdit ? "Actualiza los datos del usuario." : "Completa los datos del nuevo usuario."}</p>
              </div>
              <button type="button" aria-label="Cerrar" onClick={closeUserModal} className="rounded-md p-2 text-xl text-gray-500 hover:bg-gray-100">×</button>
            </div>
            <form key={userToEdit ? userToEdit.email : "create"} className="space-y-5 p-6" onSubmit={(event) => { event.preventDefault(); closeUserModal(); }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700 sm:col-span-2">Nombre Completo<input required type="text" name="name" autoComplete="name" disabled={isViewingUser} defaultValue={userToEdit?.name || ""} placeholder="Nombre y apellido" className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
                <label className="text-sm font-medium text-gray-700">Rol<select required name="role" disabled={isViewingUser} defaultValue={userToEdit?.role || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"><option value="" disabled>Selecciona un rol</option><option value="administrador">Administrador</option><option value="tecnico">Técnico</option><option value="operario">Operario</option></select></label>
                <label className="text-sm font-medium text-gray-700">Correo electrónico<input required type="email" name="email" autoComplete="email" disabled={isViewingUser} defaultValue={userToEdit?.email || ""} placeholder="usuario@enecon.net.co" className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500" /></label>
        				{!isViewingUser && <>
        				<label className="text-sm font-medium text-gray-700 sm:col-span-2">Contraseña<input required={!userToEdit} type="password" name="password" autoComplete="new-password" minLength={8} placeholder={userToEdit ? "Dejar en blanco para conservar la contraseña" : "Mínimo 8 caracteres"} className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                <label className="text-sm font-medium text-gray-700 sm:col-span-2">Confirmar contraseña<input required={!userToEdit} type="password" name="confirmPassword" autoComplete="new-password" minLength={8} placeholder="Confirmar contraseña" className="mt-1.5 w-full rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20" /></label>
                </>}
                <label className="text-sm font-medium text-gray-700 sm:col-span-2">Usuario Directorio Activo<select required name="activeDirectoryUser" disabled={isViewingUser} defaultValue={userToEdit?.activeDirectoryUser || ""} className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-normal focus:border-[#d06519] focus:outline-none focus:ring-2 focus:ring-[#d06519]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"><option value="" disabled>Selecciona un estado</option><option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option></select></label>
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