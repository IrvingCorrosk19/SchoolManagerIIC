import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, CheckCircle, XCircle, Save, X, Shield, Key } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { SchoolAdmin, School } from '../../types/school';
import { generateSecurePassword } from '../../utils/security';

export function AccessManagement() {
  const { documents: admins, loading: loadingAdmins, addDoc, updateDoc, deleteDoc } = useFirestore<SchoolAdmin>('schoolAdmins');
  const { documents: schools, loading: loadingSchools } = useFirestore<School>('schools');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState<Omit<SchoolAdmin, 'id' | 'createdAt' | 'updatedAt'>>({
    schoolId: '',
    name: '',
    email: '',
    role: 'admin',
    tempPassword: '',
    passwordChanged: false,
    twoFactorEnabled: false,
    status: 'active'
  });

  // Reset form when closing
  useEffect(() => {
    if (!isAddingAdmin && !isEditingAdmin) {
      setFormData({
        schoolId: '',
        name: '',
        email: '',
        role: 'admin',
        tempPassword: '',
        passwordChanged: false,
        twoFactorEnabled: false,
        status: 'active'
      });
    }
  }, [isAddingAdmin, isEditingAdmin]);

  // Load admin data when editing
  useEffect(() => {
    if (isEditingAdmin) {
      const adminToEdit = admins.find(admin => admin.id === isEditingAdmin);
      if (adminToEdit) {
        setFormData({
          schoolId: adminToEdit.schoolId,
          name: adminToEdit.name,
          email: adminToEdit.email,
          role: adminToEdit.role,
          tempPassword: adminToEdit.tempPassword,
          passwordChanged: adminToEdit.passwordChanged,
          twoFactorEnabled: adminToEdit.twoFactorEnabled,
          status: adminToEdit.status
        });
      }
    }
  }, [isEditingAdmin, admins]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const timestamp = new Date();
      
      if (isEditingAdmin) {
        // Update existing admin
        await updateDoc(isEditingAdmin, {
          ...formData,
          updatedAt: timestamp
        });
        setIsEditingAdmin(null);
      } else {
        // Generate temporary password for new admin
        const tempPassword = generateSecurePassword();
        
        // Add new admin
        await addDoc({
          ...formData,
          tempPassword,
          createdAt: timestamp,
          updatedAt: timestamp
        });
        
        alert(`Administrador creado exitosamente.\nContraseña temporal: ${tempPassword}`);
        setIsAddingAdmin(false);
      }
    } catch (error) {
      console.error('Error saving admin:', error);
      alert('Error al guardar el administrador. Por favor intente nuevamente.');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await deleteDoc(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error al eliminar el administrador. Por favor intente nuevamente.');
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const newPassword = generateSecurePassword();
      
      await updateDoc(id, {
        tempPassword: newPassword,
        passwordChanged: false,
        updatedAt: new Date()
      });
      
      alert(`Contraseña restablecida exitosamente.\nNueva contraseña temporal: ${newPassword}`);
      setShowResetPassword(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error al restablecer la contraseña. Por favor intente nuevamente.');
    }
  };

  const getSchoolName = (schoolId: string): string => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Escuela no encontrada';
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSchoolName(admin.schoolId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = selectedSchool === 'all' || admin.schoolId === selectedSchool;
    
    return matchesSearch && matchesSchool;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-indigo-700 text-white">
        <h1 className="text-2xl font-bold">Gestión de Accesos</h1>
        <p className="text-indigo-200">Administración de usuarios y permisos por institución</p>
      </div>
      
      <div className="p-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, correo o institución..."
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px] max-w-xs">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todas las instituciones</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setIsAddingAdmin(true)}
            className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Administrador
          </button>
        </div>
        
        {/* Admins List */}
        {loadingAdmins || loadingSchools ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredAdmins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="border p-2 text-left">Nombre</th>
                  <th className="border p-2 text-left">Correo</th>
                  <th className="border p-2 text-left">Institución</th>
                  <th className="border p-2 text-center">Rol</th>
                  <th className="border p-2 text-center">2FA</th>
                  <th className="border p-2 text-center">Estado</th>
                  <th className="border p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="border p-2">{admin.name}</td>
                    <td className="border p-2">{admin.email}</td>
                    <td className="border p-2">{getSchoolName(admin.schoolId)}</td>
                    <td className="border p-2 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {admin.role === 'admin' ? 'Administrador' : 'Director'}
                      </span>
                    </td>
                    <td className="border p-2 text-center">
                      {admin.twoFactorEnabled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" /> Activado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <XCircle size={12} className="mr-1" /> Desactivado
                        </span>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      {admin.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red- 100 text-red-800">
                          <XCircle size={12} className="mr-1" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsEditingAdmin(admin.id)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(admin.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-100"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => setShowResetPassword(admin.id)}
                          className="p-1 rounded text-yellow-600 hover:bg-yellow-100"
                          title="Restablecer Contraseña"
                        >
                          <Key size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron administradores</p>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
              <p className="mb-6">
                ¿Está seguro que desea eliminar este administrador? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteAdmin(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Reset Password Confirmation Modal */}
        {showResetPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Restablecer Contraseña</h3>
              <p className="mb-6">
                ¿Está seguro que desea restablecer la contraseña de este administrador? Se generará una nueva contraseña temporal.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResetPassword(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleResetPassword(showResetPassword)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Restablecer
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add/Edit Admin Form */}
        {(isAddingAdmin || isEditingAdmin) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {isAddingAdmin ? 'Agregar Nuevo Administrador' : 'Editar Administrador'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingAdmin(false);
                    setIsEditingAdmin(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institución*
                    </label>
                    <select
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      disabled={isEditingAdmin}
                    >
                      <option value="" disabled>Seleccione una institución</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nombre y apellidos"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol*
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="admin">Administrador</option>
                      <option value="director">Director</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  
                  {isEditingAdmin && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Autenticación de Dos Factores
                        </label>
                        <select
                          name="twoFactorEnabled"
                          value={formData.twoFactorEnabled ? 'true' : 'false'}
                          onChange={(e) => setFormData({
                            ...formData,
                            twoFactorEnabled: e.target.value === 'true'
                          })}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="true">Activada</option>
                          <option value="false">Desactivada</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado de Contraseña
                        </label>
                        <div className="p-2 border rounded-lg bg-gray-50">
                          {formData.passwordChanged ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle size={16} className="mr-1" /> Contraseña cambiada
                            </span>
                          ) : (
                            <span className="text-yellow-600 flex items-center">
                              <XCircle size={16} className="mr-1" /> Usando contraseña temporal
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {isAddingAdmin && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-sm">
                    <p className="flex items-center text-yellow-700">
                      <Shield size={16} className="mr-1" />
                      Se generará una contraseña temporal segura al crear el administrador.
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingAdmin(false);
                      setIsEditingAdmin(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 flex items-center gap-2"
                  >
                    <Save size={20} />
                    {isAddingAdmin ? 'Crear Administrador' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}