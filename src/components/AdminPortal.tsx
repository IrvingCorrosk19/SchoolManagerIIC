import React, { useState, useRef } from 'react';
import { UserPlus, Users, School, GraduationCap, Trash2, Save, Search, CheckCircle, XCircle, Upload, BookOpen, Grid, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'teacher' | 'parent' | 'director' | 'admin';
  status: 'active' | 'inactive';
  subject?: string[];
  grade?: string;
  studentId?: number;
  groups?: string[];
};

type Subject = {
  id: number;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
};

type Group = {
  id: number;
  name: string;
  grade: string;
  students: number;
};

export function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'users' | 'import' | 'subjects' | 'groups'>('users');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Users state
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Prof. Martínez', email: 'martinez@escuela.edu', role: 'teacher', status: 'active', subject: ['Matemáticas'], groups: ['8-A', '9-B'] },
    { id: 2, name: 'Prof. Sánchez', email: 'sanchez@escuela.edu', role: 'teacher', status: 'active', subject: ['Ciencias'], groups: ['7-A', '7-B'] },
    { id: 3, name: 'Prof. López', email: 'lopez@escuela.edu', role: 'teacher', status: 'active', subject: ['Historia'], groups: ['8-A', '8-B'] },
    { id: 4, name: 'Prof. Rodríguez', email: 'rodriguez@escuela.edu', role: 'teacher', status: 'active', subject: ['Literatura'], groups: ['9-A'] },
    { id: 5, name: 'Prof. Gómez', email: 'gomez@escuela.edu', role: 'teacher', status: 'active', subject: ['Inglés'], groups: ['7-A', '8-A', '9-A'] },
    { id: 6, name: 'Juan Pérez', email: 'jperez@mail.com', role: 'parent', status: 'active', studentId: 1 },
    { id: 7, name: 'María González', email: 'mgonzalez@mail.com', role: 'parent', status: 'active', studentId: 2 },
    { id: 8, name: 'Carlos Ramírez', email: 'cramirez@mail.com', role: 'parent', status: 'active', studentId: 3 },
    { id: 9, name: 'Laura Díaz', email: 'ldiaz@escuela.edu', role: 'director', status: 'active' },
    { id: 10, name: 'Admin Principal', email: 'admin@escuela.edu', role: 'admin', status: 'active' }
  ]);

  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    role: 'teacher',
    status: 'active',
    subject: [],
    grade: '',
    studentId: undefined,
    groups: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'teacher' | 'parent' | 'director' | 'admin'>('all');

  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Matemáticas', code: 'MAT', description: 'Álgebra, geometría y cálculo', status: 'active' },
    { id: 2, name: 'Ciencias', code: 'CIE', description: 'Biología, química y física', status: 'active' },
    { id: 3, name: 'Historia', code: 'HIS', description: 'Historia nacional y mundial', status: 'active' },
    { id: 4, name: 'Literatura', code: 'LIT', description: 'Comprensión y análisis de textos', status: 'active' },
    { id: 5, name: 'Inglés', code: 'ING', description: 'Idioma inglés', status: 'active' },
  ]);

  const [newSubject, setNewSubject] = useState<Omit<Subject, 'id'>>({
    name: '',
    code: '',
    description: '',
    status: 'active'
  });

  // Groups state
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: '7-A', grade: '7° Grado', students: 28 },
    { id: 2, name: '7-B', grade: '7° Grado', students: 26 },
    { id: 3, name: '8-A', grade: '8° Grado', students: 30 },
    { id: 4, name: '8-B', grade: '8° Grado', students: 29 },
    { id: 5, name: '9-A', grade: '9° Grado', students: 27 },
    { id: 6, name: '9-B', grade: '9° Grado', students: 25 },
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // User management functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'studentId') {
      setNewUser({
        ...newUser,
        [name]: value ? parseInt(value) : undefined
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value
      });
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setNewUser({
      ...newUser,
      subject: selectedOptions
    });
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setNewUser({
      ...newUser,
      groups: selectedOptions
    });
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const newId = Math.max(0, ...users.map(u => u.id)) + 1;
    
    setUsers([
      ...users,
      {
        id: newId,
        ...newUser
      }
    ]);
    
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'teacher',
      status: 'active',
      subject: [],
      grade: '',
      studentId: undefined,
      groups: []
    });
  };

  const toggleUserStatus = (id: number) => {
    setUsers(
      users.map(user => 
        user.id === id 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
          : user
      )
    );
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  // Subject management functions
  const handleSubjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSubject({
      ...newSubject,
      [name]: value
    });
  };

  const addSubject = () => {
    if (!newSubject.name || !newSubject.code) return;
    
    const newId = Math.max(0, ...subjects.map(s => s.id)) + 1;
    
    setSubjects([
      ...subjects,
      {
        id: newId,
        ...newSubject
      }
    ]);
    
    // Reset form
    setNewSubject({
      name: '',
      code: '',
      description: '',
      status: 'active'
    });
  };

  const toggleSubjectStatus = (id: number) => {
    setSubjects(
      subjects.map(subject => 
        subject.id === id 
          ? { ...subject, status: subject.status === 'active' ? 'inactive' : 'active' } 
          : subject
      )
    );
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  // Group assignment functions
  const handleTeacherSelection = (teacherId: number) => {
    setSelectedTeacher(teacherId);
    
    const teacher = users.find(user => user.id === teacherId);
    setSelectedGroups(teacher?.groups || []);
  };

  const handleGroupSelection = (groupName: string) => {
    if (selectedGroups.includes(groupName)) {
      setSelectedGroups(selectedGroups.filter(g => g !== groupName));
    } else {
      setSelectedGroups([...selectedGroups, groupName]);
    }
  };

  const saveGroupAssignments = () => {
    if (selectedTeacher === null) return;
    
    setUsers(
      users.map(user => 
        user.id === selectedTeacher 
          ? { ...user, groups: selectedGroups } 
          : user
      )
    );
  };

  // Import data functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const binaryStr = evt.target?.result;
        const wb = XLSX.read(binaryStr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Process the data based on the structure
        // This is a simplified example - in a real app, you'd validate the data
        const newUsers = data.map((row: any, index) => ({
          id: users.length + index + 1,
          name: row.Nombre || '',
          email: row.Email || `user${index}@example.com`,
          role: row.Rol?.toLowerCase() || 'teacher',
          status: 'active',
          subject: row.Materia ? [row.Materia] : [],
          grade: row.Grado || '',
          studentId: row.EstudianteID ? parseInt(row.EstudianteID) : undefined,
          groups: row.Grupos ? row.Grupos.split(',') : []
        }));
        
        setUsers([...users, ...newUsers]);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        alert(`Se importaron ${newUsers.length} usuarios correctamente.`);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al procesar el archivo. Verifique el formato.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const exportUsersToExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create data for users
    const userData = users.map(user => ({
      'ID': user.id,
      'Nombre': user.name,
      'Email': user.email,
      'Rol': user.role === 'teacher' ? 'Profesor' : 
             user.role === 'parent' ? 'Padre/Madre' : 
             user.role === 'director' ? 'Director' : 'Administrador',
      'Estado': user.status === 'active' ? 'Activo' : 'Inactivo',
      'Materias': user.subject ? user.subject.join(', ') : '',
      'Grado': user.grade || '',
      'ID Estudiante': user.studentId || '',
      'Grupos': user.groups ? user.groups.join(', ') : ''
    }));
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(userData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "usuarios_sistema.xlsx");
  };

  // Calculate group statistics
  const calculateGroupStats = () => {
    const totalGroups = groups.length;
    
    // Get all assigned groups (may contain duplicates)
    const allAssignedGroups = users
      .filter(user => user.role === 'teacher')
      .flatMap(teacher => teacher.groups || []);
    
    // Get unique assigned groups
    const uniqueAssignedGroups = new Set(allAssignedGroups);
    const assignedGroupsCount = uniqueAssignedGroups.size;
    
    // Calculate percentage
    const assignmentPercentage = (assignedGroupsCount / totalGroups) * 100;
    
    return {
      totalGroups,
      assignedGroupsCount,
      unassignedGroupsCount: totalGroups - assignedGroupsCount,
      assignmentPercentage
    };
  };

  // Get teacher group assignment stats
  const getTeacherGroupStats = () => {
    return users
      .filter(user => user.role === 'teacher')
      .map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        assignedGroups: teacher.groups?.length || 0,
        groups: teacher.groups || []
      }))
      .sort((a, b) => b.assignedGroups - a.assignedGroups);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Portal del Administrador</h1>
        <p className="text-blue-100">Gestión de usuarios del sistema escolar</p>
      </div>
      
      <div className="p-6">
        {/* Tabs Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>Usuarios</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'import' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('import')}
          >
            <div className="flex items-center gap-2">
              <Upload size={18} />
              <span>Importar Datos</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'subjects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('subjects')}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>Materias</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
            onClick={() => setActiveTab('groups')}
          >
            <div className="flex items-center gap-2">
              <Grid size={18} />
              <span>Asignación de Grupos</span>
            </div>
          </button>
        </div>
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="text-blue-600" />
                Crear Nuevo Usuario
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre y apellidos"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="teacher">Profesor</option>
                    <option value="parent">Padre/Madre</option>
                    <option value="director">Director</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="status"
                    value={newUser.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
                
                {newUser.role === 'teacher' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Materias</label>
                      <select
                        multiple
                        name="subject"
                        value={newUser.subject}
                        onChange={handleSubjectChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      >
                        {subjects.filter(s => s.status === 'active').map(subject => (
                          <option key={subject.id} value={subject.name}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Mantenga presionado Ctrl para seleccionar múltiples materias</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grupos</label>
                      <select
                        multiple
                        name="groups"
                        value={newUser.groups}
                        onChange={handleGroupChange}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      >
                        {groups.map(group => (
                          <option key={group.id} value={group.name}>
                            {group.name} ({group.grade})
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Mantenga presionado Ctrl para seleccionar múltiples grupos</p>
                    </div>
                  </>
                )}
                
                {newUser.role === 'parent' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID del Estudiante</label>
                    <input
                      type="number"
                      name="studentId"
                      value={newUser.studentId || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ID del estudiante asociado"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={addUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Crear Usuario
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="text-blue-600" />
                Gestión de Usuarios
              </h2>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre o correo"
                      className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="bg-blue-500 text-white p-2 rounded-r-lg flex items-center">
                      <Search size={20} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="teacher">Profesores</option>
                    <option value="parent">Padres</option>
                    <option value="director">Directores</option>
                    <option value="admin">Administradores</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Nombre</th>
                      <th className="border p-2 text-left">Correo</th>
                      <th className="border p-2 text-left">Rol</th>
                      <th className="border p-2 text-center">Estado</th>
                      <th className="border p-2 text-left">Detalles</th>
                      <th className="border p-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-blue-50">
                        <td className="border p-2">{user.id}</td>
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">
                          <div className="flex items-center gap-2">
                            {user.role === 'teacher' && <GraduationCap size={16} className="text-blue-600" />}
                            {user.role === 'parent' && <Users size={16} className="text-green-600" />}
                            {user.role === 'director' && <School size={16} className="text-purple-600" />}
                            {user.role === 'admin' && <UserPlus size={16} className="text-red-600" />}
                            {user.role === 'teacher' && 'Profesor'}
                            {user.role === 'parent' && 'Padre/Madre'}
                            {user.role === 'director' && 'Director'}
                            {user.role === 'admin' && 'Administrador'}
                          </div>
                        </td>
                        <td className="border p-2 text-center">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" /> Inactivo
                            </span>
                          )}
                        </td>
                        <td className="border p-2">
                          {user.role === 'teacher' && user.subject && (
                            <div>
                              <div><span className="font-medium">Materias:</span> {user.subject.join(', ')}</div>
                              {user.groups && user.groups.length > 0 && (
                                <div><span className="font-medium">Grupos:</span> {user.groups.join(', ')}</div>
                              )}
                            </div>
                          )}
                          {user.role === 'parent' && user.studentId && (
                            <span>ID Estudiante: {user.studentId}</span>
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-1 rounded ${user.status === 'active' ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100'}`}
                              title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                            >
                              {user.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-1 rounded text-red-500 hover:bg-red-100"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* Import Data Tab */}
        {activeTab === 'import' && (
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="text-blue-600" />
              Importar Datos
            </h2>
            
            <div className="mb-6">
              <p className="mb-4">Importe datos de usuarios desde un archivo Excel. El archivo debe contener las siguientes columnas:</p>
              
              <div className="bg-white p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Formato del archivo:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-medium">Nombre</span> - Nombre completo del usuario</li>
                  <li><span className="font-medium">Email</span> - Correo electrónico</li>
                  <li><span className="font-medium">Rol</span> - Profesor, Padre, Director o Administrador</li>
                  <li><span className="font-medium">Materia</span> - Para profesores</li>
                  <li><span className="font-medium">Grado</span> - Nivel educativo</li>
                  <li><span className="font-medium">EstudianteID</span> - Para padres</li>
                  <li><span className="font-medium">Grupos</span> - Lista de grupos separados por comas (ej: "7-A,8-B")</li>
                </ul>
              </div>
              
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload size={48} className="text-blue-500 mb-2" />
                    <p className="text-lg font-medium text-blue-600 mb-1">Haga clic para seleccionar un archivo</p>
                    <p className="text-sm text-gray-500">o arrastre y suelte un archivo Excel aquí</p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium mb-1">Descargar plantilla</h3>
                <p className="text-sm text-gray-600 mb-2">Utilice esta plantilla para preparar sus datos</p>
                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download size={18} />
                    Plantilla Usuarios
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download size={18} />
                    Plantilla Estudiantes
                  </button>
                </div>
              </div>
              
              <button 
                onClick={exportUsersToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                Exportar Usuarios Actuales
              </button>
            </div>
          </div>
        )}
        
        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <>
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-600" />
                Agregar Nueva Materia
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Materia</label>
                  <input
                    type="text"
                    name="name"
                    value={newSubject.name}
                    onChange={handleSubjectInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. Matemáticas"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input
                    type="text"
                    name="code"
                    value={newSubject.code}
                    onChange={handleSubjectInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. MAT"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="description"
                    value={newSubject.description}
                    onChange={handleSubjectInputChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción de la materia"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={addSubject}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  Agregar Materia
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-600" />
                Catálogo de Materias
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Nombre</th>
                      <th className="border p-2 text-left">Código</th>
                      <th className="border p-2 text-left">Descripción</th>
                      <th className="border p-2 text-center">Estado</th>
                      <th className="border p-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map(subject => (
                      <tr key={subject.id} className="hover:bg-blue-50">
                        <td className="border p-2">{subject.id}</td>
                        <td className="border p-2">{subject.name}</td>
                        <td className="border p-2">{subject.code}</td>
                        <td className="border p-2">{subject.description}</td>
                        <td className="border p-2 text-center">
                          {subject.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" /> Activa
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" /> Inactiva
                            </span>
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => toggleSubjectStatus(subject.id)}
                              className={`p-1 rounded ${subject.status === 'active' ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100'}`}
                              title={subject.status === 'active' ? 'Desactivar' : 'Activar'}
                            >
                              {subject.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                            </button>
                            <button
                              onClick={() => deleteSubject(subject.id)}
                              className="p-1 rounded text-red-500 hover:bg-red-100"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <>
            {/* Group Statistics */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Grid className="text-blue-600" />
                Estadísticas de Grupos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {(() => {
                  const stats = calculateGroupStats();
                  
                  return (
                    <>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium text-gray-700 mb-2">Total de Grupos</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalGroups}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium text-gray-700 mb-2">Grupos Asignados</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.assignedGroupsCount}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-medium text-gray-700 mb-2">Grupos Sin Asignar</h3>
                        <p className="text-3xl font-bold text-red-600">{stats.unassignedGroupsCount}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-gray-700 mb-2">Porcentaje de Asignación</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${calculateGroupStats().assignmentPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{calculateGroupStats().assignmentPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            {/* Teacher Group Assignment Stats */}
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="text-blue-600" />
                Asignación de Grupos por Profesor
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border p-2 text-left">Profesor</th>
                      <th className="border p-2 text-center">Grupos Asignados</th>
                      <th className="border p-2 text-left">Detalle de Grupos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getTeacherGroupStats().map(teacher => (
                      <tr key={teacher.id} className="hover:bg-blue-50">
                        <td className="border p-2">{teacher.name}</td>
                        <td className="border p-2 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            teacher.assignedGroups > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {teacher.assignedGroups}
                          </span>
                        </td>
                        <td className="border p-2">
                          {teacher.groups.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {teacher.groups.map(group => (
                                <span 
                                  key={group} 
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {group}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm italic">Sin grupos asignados</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="text-blue-600" />
                    Seleccionar Profesor
                  </h2>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {users
                      .filter(user => user.role === 'teacher')
                      .map(teacher => (
                        <div 
                          key={teacher.id}
                          onClick={() => handleTeacherSelection(teacher.id)}
                          className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                            selectedTeacher === teacher.id 
                              ? 'bg-blue-200 border-2 border-blue-400' 
                              : 'bg-white hover:bg-blue-100'
                          }`}
                        >
                          <div className="bg-blue-100 p-2 rounded-full">
                            <GraduationCap size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{teacher.name}</h3>
                            <p className="text-sm text-gray-600">
                              {teacher.subject ? teacher.subject.join(', ') : 'Sin materias asignadas'}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Grid className="text-blue-600" />
                    Asignar Grupos
                  </h2>
                  
                  {selectedTeacher === null ? (
                    <div className="bg-white p-8 rounded-lg text-center">
                      <Grid size={48} className="text-blue-300 mx-auto mb-3" />
                      <p className="text-gray-500">Seleccione un profesor para asignar grupos</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <h3 className="font-medium mb-2">
                          {users.find(u => u.id === selectedTeacher)?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Materias: {users.find(u => u.id === selectedTeacher)?.subject?. join(', ') || 'Ninguna'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Grupos actuales: {users.find(u => u.id === selectedTeacher)?.groups?.join(', ') || 'Ninguno'}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {groups.map(group => (
                          <div 
                            key={group.id}
                            onClick={() => handleGroupSelection(group.name)}
                            className={`p-3 rounded-lg cursor-pointer border-2 ${
                              selectedGroups.includes(group.name)
                                ? 'bg-blue-100 border-blue-400'
                                : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium">{group.name}</h4>
                              {selectedGroups.includes(group.name) && (
                                <CheckCircle size={16} className="text-blue-600" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{group.grade}</p>
                            <p className="text-xs text-gray-600">{group.students} estudiantes</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={saveGroupAssignments}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Save size={20} />
                          Guardar Asignaciones
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="mt-6 flex justify-end">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={20} />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}