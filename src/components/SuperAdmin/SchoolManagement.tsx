import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, CheckCircle, XCircle, Save, X, Download, Upload } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { School } from '../../types/school';
import { generateSecurePassword } from '../../utils/security';

export function SchoolManagement() {
  const { documents: schools, loading, addDoc, updateDoc, deleteDoc } = useFirestore<School>('schools');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<School, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    status: 'active',
    modules: {
      grades: true,
      parents: true,
      admin: true,
      director: true
    }
  });

  // Reset form when closing
  useEffect(() => {
    if (!isAddingSchool && !isEditingSchool) {
      setFormData({
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        status: 'active',
        modules: {
          grades: true,
          parents: true,
          admin: true,
          director: true
        }
      });
    }
  }, [isAddingSchool, isEditingSchool]);

  // Load school data when editing
  useEffect(() => {
    if (isEditingSchool) {
      const schoolToEdit = schools.find(school => school.id === isEditingSchool);
      if (schoolToEdit) {
        setFormData({
          name: schoolToEdit.name,
          code: schoolToEdit.code,
          address: schoolToEdit.address,
          phone: schoolToEdit.phone,
          email: schoolToEdit.email,
          status: schoolToEdit.status,
          modules: { ...schoolToEdit.modules },
          logo: schoolToEdit.logo
        });
      }
    }
  }, [isEditingSchool, schools]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleToggle = (moduleName: keyof School['modules']) => {
    setFormData(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleName]: !prev.modules[moduleName]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const timestamp = new Date();
      
      if (isEditingSchool) {
        // Update existing school
        await updateDoc(isEditingSchool, {
          ...formData,
          updatedAt: timestamp
        });
        setIsEditingSchool(null);
      } else {
        // Add new school
        await addDoc({
          ...formData,
          createdAt: timestamp,
          updatedAt: timestamp
        });
        setIsAddingSchool(false);
      }
    } catch (error) {
      console.error('Error saving school:', error);
      alert('Error al guardar la institución. Por favor intente nuevamente.');
    }
  };

  const handleDeleteSchool = async (id: string) => {
    try {
      await deleteDoc(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting school:', error);
      alert('Error al eliminar la institución. Por favor intente nuevamente.');
    }
  };

  const generateSchoolCode = () => {
    // Generate a unique code based on school name
    const namePrefix = formData.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);
    
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${namePrefix}-${randomNum}`;
    
    setFormData(prev => ({
      ...prev,
      code
    }));
  };

  const createInitialAdmin = async (schoolId: string, schoolName: string) => {
    try {
      const adminEmail = `admin@${schoolId.toLowerCase()}.edu`;
      const tempPassword = generateSecurePassword();
      
      // In a real app, you would create a user in Firebase Auth
      // and then store the admin details in Firestore
      
      alert(`Administrador creado exitosamente:\nEmail: ${adminEmail}\nContraseña temporal: ${tempPassword}`);
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error al crear el administrador. Por favor intente nuevamente.');
    }
  };

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-indigo-700 text-white">
        <h1 className="text-2xl font-bold">Gestión de Escuelas</h1>
        <p className="text-indigo-200">Administración de instituciones educativas</p>
      </div>
      
      <div className="p-6">
        {/* Search and Add Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, código o correo..."
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={() => setIsAddingSchool(true)}
            className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 flex items-center gap-2"
          >
            <Plus size={20} />
            Nueva Institución
          </button>
        </div>
        
        {/* Schools List */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredSchools.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="border p-2 text-left">Nombre</th>
                  <th className="border p-2 text-left">Código</th>
                  <th className="border p-2 text-left">Correo</th>
                  <th className="border p-2 text-left">Dirección</th>
                  <th className="border p-2 text-center">Módulos</th>
                  <th className="border p-2 text-center">Estado</th>
                  <th className="border p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchools.map(school => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="border p-2">{school.name}</td>
                    <td className="border p-2">{school.code}</td>
                    <td className="border p-2">{school.email}</td>
                    <td className="border p-2">{school.address}</td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {school.modules.grades && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Calificaciones
                          </span>
                        )}
                        {school.modules.parents && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Padres
                          </span>
                        )}
                        {school.modules.admin && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        )}
                        {school.modules.director && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Director
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border p-2 text-center">
                      {school.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" /> Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle size={12} className="mr-1" /> Inactiva
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setIsEditingSchool(school.id)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(school.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-100"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => createInitialAdmin(school.id, school.name)}
                          className="p-1 rounded text-green-600 hover:bg-green-100"
                          title="Crear Administrador"
                        >
                          <Plus size={18} />
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
            <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron instituciones educativas</p>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
              <p className="mb-6">
                ¿Está seguro que desea eliminar esta institución? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteSchool(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add/Edit School Form */}
        {(isAddingSchool || isEditingSchool) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {isAddingSchool ? 'Agregar Nueva Institución' : 'Editar Institución'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddingSchool(false);
                    setIsEditingSchool(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Institución*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nombre completo de la institución"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de Identificación*
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Código único"
                        required
                      />
                      <button
                        type="button"
                        onClick={generateSchoolCode}
                        className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        Generar
                      </button>
                    </div>
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
                      placeholder="correo@institucion.edu"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono*
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Número de teléfono"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección*
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Dirección completa"
                      rows={2}
                      required
                    ></textarea>
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
                      <option value="active">Activa</option>
                      <option value="inactive">Inactiva</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo de la Institución
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm flex items-center gap-1"
                      >
                        <Upload size={16} />
                        Subir Logo
                      </button>
                      <span className="text-sm text-gray-500">
                        {formData.logo ? 'Logo cargado' : 'Ningún archivo seleccionado'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Módulos Habilitados</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Todos los módulos son obligatorios para el funcionamiento del sistema.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={formData.modules.grades}
                          onChange={() => handleModuleToggle('grades')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          disabled
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">
                          Módulo de Calificaciones
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Gestión de notas y evaluaciones</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={formData.modules.parents}
                          onChange={() => handleModuleToggle('parents')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          disabled
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">
                          Portal para Padres
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Acceso para padres y tutores</p>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={formData.modules.admin}
                          onChange={() => handleModuleToggle('admin')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          disabled
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">
                          Panel de Administrador
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Gestión administrativa</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-200">
                      <div className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          checked={formData.modules.director}
                          onChange={() => handleModuleToggle('director')}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          disabled
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">
                          Panel de Director
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Supervisión y análisis</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSchool(false);
                      setIsEditingSchool(null);
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
                    {isAddingSchool ? 'Crear Institución' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Export/Import Controls */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"
          >
            <Upload size={18} />
            Importar
          </button>
          <button
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}