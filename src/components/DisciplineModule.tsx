import React, { useState } from 'react';
import { Calendar, AlertCircle, MessageSquare, Clock, Search, Download, Filter, User, Save, Trash2, PlusCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

type Student = {
  id: number;
  name: string;
  grade: string;
};

type DisciplineRecord = {
  id: number;
  studentId: number;
  teacherId: number;
  date: string;
  time: string;
  type: 'citation' | 'comment';
  description: string;
  status: 'pending' | 'resolved' | 'escalated';
};

export function DisciplineModule({ teacherId }: { teacherId: number }) {
  const [students] = useState<Student[]>([
    { id: 1, name: 'Ana García', grade: '1° Primaria' },
    { id: 2, name: 'Carlos Rodríguez', grade: '2° Primaria' },
    { id: 3, name: 'María López', grade: '3° Primaria' },
    { id: 4, name: 'Juan Martínez', grade: '4° Primaria' },
    { id: 5, name: 'Sofía Hernández', grade: '5° Primaria' },
    { id: 6, name: 'Pedro Gómez', grade: '1° Primaria' },
    { id: 7, name: 'Laura Torres', grade: '2° Primaria' },
    { id: 8, name: 'Diego Ramírez', grade: '3° Primaria' },
    { id: 9, name: 'Valentina Díaz', grade: '4° Primaria' },
    { id: 10, name: 'Mateo Sánchez', grade: '5° Primaria' }
  ]);

  const [disciplineRecords, setDisciplineRecords] = useState<DisciplineRecord[]>([
    {
      id: 1,
      studentId: 3,
      teacherId: 1,
      date: '2025-04-10',
      time: '09:15',
      type: 'comment',
      description: 'Interrumpió la clase varias veces durante la explicación.',
      status: 'resolved'
    },
    {
      id: 2,
      studentId: 5,
      teacherId: 1,
      date: '2025-04-08',
      time: '11:30',
      type: 'citation',
      description: 'Se negó a participar en la actividad grupal y mostró actitud desafiante.',
      status: 'pending'
    },
    {
      id: 3,
      studentId: 2,
      teacherId: 2,
      date: '2025-04-09',
      time: '10:45',
      type: 'comment',
      description: 'Llegó tarde a clase sin justificación.',
      status: 'resolved'
    }
  ]);

  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

  // New record form state
  const [newRecord, setNewRecord] = useState<Omit<DisciplineRecord, 'id'>>({
    studentId: 0,
    teacherId,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'comment',
    description: '',
    status: 'pending'
  });

  // Get unique grades
  const getUniqueGrades = (): string[] => {
    const grades = students.map(student => student.grade);
    return [...new Set(grades)];
  };

  // Filter students based on search and grade
  const filteredStudents = students.filter(student => {
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  // Filter discipline records based on date range and teacher
  const filteredRecords = disciplineRecords.filter(record => 
    record.teacherId === teacherId &&
    record.date >= selectedDateRange.start && 
    record.date <= selectedDateRange.end
  );

  // Get student records
  const getStudentRecords = (studentId: number) => {
    return disciplineRecords.filter(record => 
      record.studentId === studentId && 
      record.teacherId === teacherId
    );
  };

  // Get student name by ID
  const getStudentName = (studentId: number): string => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Estudiante desconocido';
  };

  // Get student grade by ID
  const getStudentGrade = (studentId: number): string => {
    const student = students.find(s => s.id === studentId);
    return student ? student.grade : '';
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value
    });
  };

  // Handle student selection
  const handleStudentSelect = (studentId: number) => {
    setSelectedStudent(studentId);
    setNewRecord({
      ...newRecord,
      studentId
    });
  };

  // Handle record selection for editing
  const handleRecordSelect = (recordId: number) => {
    const record = disciplineRecords.find(r => r.id === recordId);
    if (record) {
      setSelectedRecordId(recordId);
      setNewRecord({
        studentId: record.studentId,
        teacherId: record.teacherId,
        date: record.date,
        time: record.time,
        type: record.type,
        description: record.description,
        status: record.status
      });
      setSelectedStudent(record.studentId);
    }
  };

  // Save new record
  const saveRecord = () => {
    if (newRecord.studentId === 0 || !newRecord.description.trim()) {
      alert('Por favor seleccione un estudiante y escriba una descripción');
      return;
    }

    if (selectedRecordId) {
      // Update existing record
      setDisciplineRecords(
        disciplineRecords.map(record => 
          record.id === selectedRecordId 
            ? { ...newRecord, id: selectedRecordId } 
            : record
        )
      );
      setSelectedRecordId(null);
    } else {
      // Create new record
      const newId = Math.max(0, ...disciplineRecords.map(r => r.id)) + 1;
      setDisciplineRecords([
        ...disciplineRecords,
        {
          id: newId,
          ...newRecord
        }
      ]);
    }

    // Reset form
    setNewRecord({
      studentId: 0,
      teacherId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      type: 'comment',
      description: '',
      status: 'pending'
    });
    setSelectedStudent(null);
  };

  // Delete record
  const deleteRecord = (id: number) => {
    setDisciplineRecords(disciplineRecords.filter(record => record.id !== id));
    if (selectedRecordId === id) {
      setSelectedRecordId(null);
      setNewRecord({
        studentId: 0,
        teacherId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        type: 'comment',
        description: '',
        status: 'pending'
      });
      setSelectedStudent(null);
    }
  };

  // Update record status
  const updateRecordStatus = (id: number, status: 'pending' | 'resolved' | 'escalated') => {
    setDisciplineRecords(
      disciplineRecords.map(record => 
        record.id === id 
          ? { ...record, status } 
          : record
      )
    );
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create data for discipline records
    const recordsData = filteredRecords.map(record => {
      const student = students.find(s => s.id === record.studentId);
      return {
        'Fecha': record.date,
        'Hora': record.time,
        'ID Estudiante': record.studentId,
        'Nombre': student ? student.name : '',
        'Grado': student ? student.grade : '',
        'Tipo': record.type === 'citation' ? 'Citación' : 'Comentario',
        'Descripción': record.description,
        'Estado': record.status === 'pending' ? 'Pendiente' : 
                 record.status === 'resolved' ? 'Resuelto' : 'Escalado'
      };
    });
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(recordsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Disciplina");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `registros_disciplina_${selectedDateRange.start}_a_${selectedDateRange.end}.xlsx`);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: 'pending' | 'resolved' | 'escalated'): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: 'pending' | 'resolved' | 'escalated') => {
    switch (status) {
      case 'pending':
        return <Clock size={12} className="mr-1" />;
      case 'resolved':
        return <CheckCircle size={12} className="mr-1" />;
      case 'escalated':
        return <AlertCircle size={12} className="mr-1" />;
    }
  };

  // Get type badge class
  const getTypeBadgeClass = (type: 'citation' | 'comment'): string => {
    return type === 'citation' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  // Cancel editing
  const cancelEditing = () => {
    setSelectedRecordId(null);
    setNewRecord({
      studentId: 0,
      teacherId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      type: 'comment',
      description: '',
      status: 'pending'
    });
    setSelectedStudent(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-green-600 text-white">
        <h1 className="text-2xl font-bold">Módulo de Disciplina</h1>
        <p className="text-green-100">Registro y seguimiento de citaciones y comentarios disciplinarios</p>
      </div>
      
      <div className="p-4">
        {/* Tabs Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'new' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('new')}
          >
            <div className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>Nuevo Registro</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>Historial</span>
            </div>
          </button>
        </div>
        
        {/* New Record Tab */}
        {activeTab === 'new' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Selection */}
            <div className="md:col-span-1">
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="text-green-600" />
                  Seleccionar Estudiante
                </h2>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Grado</label>
                      <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="all">Todos los grados</option>
                        {getUniqueGrades().map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Estudiante</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Nombre del estudiante"
                          className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <Search size={16} className="absolute left-2 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredStudents.map(student => (
                    <div 
                      key={student.id}
                      onClick={() => handleStudentSelect(student.id)}
                      className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                        selectedStudent === student.id 
                          ? 'bg-green-200 border-2 border-green-400' 
                          : 'bg-white hover:bg-green-100'
                      }`}
                    >
                      <div className="bg-green-100 p-2 rounded-full">
                        <User size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Record Form */}
            <div className="md:col-span-2">
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  {selectedRecordId ? (
                    <>
                      <MessageSquare className="text-green-600" />
                      Editar Registro
                    </>
                  ) : (
                    <>
                      <PlusCircle className="text-green-600" />
                      Nuevo Registro
                    </>
                  )}
                </h2>
                
                {selectedStudent ? (
                  <div>
                    <div className="bg-white p-3 rounded-lg mb-4">
                      <h3 className="font-medium">Estudiante seleccionado:</h3>
                      <p>{getStudentName(selectedStudent)} - {getStudentGrade(selectedStudent)}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                          type="date"
                          name="date"
                          value={newRecord.date}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                        <input
                          type="time"
                          name="time"
                          value={newRecord.time}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                          name="type"
                          value={newRecord.type}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="comment">Comentario</option>
                          <option value="citation">Citación</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                          name="status"
                          value={newRecord.status}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="resolved">Resuelto</option>
                          <option value="escalated">Escalado</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                          name="description"
                          value={newRecord.description}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={4}
                          placeholder="Describa el comportamiento o incidente..."
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      {selectedRecordId && (
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={saveRecord}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Save size={20} />
                        {selectedRecordId ? 'Actualizar' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg text-center">
                    <User size={48} className="text-green-300 mx-auto mb-3" />
                    <p className="text-gray-500">Seleccione un estudiante para crear un registro</p>
                  </div>
                )}
              </div>
              
              {selectedStudent && (
                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="text-green-600" />
                    Historial del Estudiante
                  </h3>
                  
                  {getStudentRecords(selectedStudent).length > 0 ? (
                    <div className="space-y-3">
                      {getStudentRecords(selectedStudent).map(record => (
                        <div 
                          key={record.id} 
                          className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500 hover:bg-green-50 cursor-pointer"
                          onClick={() => handleRecordSelect(record.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500">
                                  {formatDate(record.date)} - {record.time}
                                </span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(record.type)}`}>
                                  {record.type === 'citation' ? 'Citación' : 'Comentario'}
                                </span>
                              </div>
                              <p className="text-gray-700">{record.description}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                                {getStatusIcon(record.status)}
                                {record.status === 'pending' ? 'Pendiente' : 
                                 record.status === 'resolved' ? 'Resuelto' : 'Escalado'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRecord(record.id);
                                }}
                                className="p-1 rounded text-red-500 hover:bg-red-100"
                                title="Eliminar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-lg text-center">
                      <p className="text-gray-500">No hay registros para este estudiante</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input
                  type="date"
                  value={selectedDateRange.start}
                  onChange={(e) => setSelectedDateRange({...selectedDateRange, start: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input
                  type="date"
                  value={selectedDateRange.end}
                  onChange={(e) => setSelectedDateRange({...selectedDateRange, end: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Grado</label>
                <div className="flex">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Todos los grados</option>
                    {getUniqueGrades().map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <div className="bg-green-500 text-white p-2 rounded-r-lg flex items-center">
                    <Filter size={20} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download size={18} />
                  Exportar
                </button>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="text-green-600" />
                Registros Disciplinarios
              </h3>
              
              {filteredRecords.length > 0 ? (
                <div className="space-y-3">
                  {filteredRecords.map(record => (
                    <div 
                      key={record.id} 
                      className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{getStudentName(record.studentId)}</span>
                            <span className="text-sm text-gray-500">{getStudentGrade(record.studentId)}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500">
                              {formatDate(record.date)} - {record.time}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeClass(record.type)}`}>
                              {record.type === 'citation' ? 'Citación' : 'Comentario'}
                            </span>
                          </div>
                          <p className="text-gray-700">{record.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1">
                            <select
                              value={record.status}
                              onChange={(e) => updateRecordStatus(record.id, e.target.value as 'pending' | 'resolved' | 'escalated')}
                              className={`text-xs p-1 rounded-lg border ${
                                record.status === 'pending' ? 'border-yellow-300' : 
                                record.status === 'resolved' ? 'border-green-300' : 'border-red-300'
                              }`}
                            >
                              <option value="pending">Pendiente</option>
                              <option value="resolved">Resuelto</option>
                              <option value="escalated">Escalado</option>
                            </select>
                            <button
                              onClick={() => deleteRecord(record.id)}
                              className="p-1 rounded text-red-500 hover:bg-red-100"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRecordSelect(record.id)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-gray-500">No hay registros para el período seleccionado</p>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Leyenda:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-1">Tipos de Registro:</h5>
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Comentario
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Citación
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Estados:</h5>
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock size={12} className="mr-1" />
                      Pendiente
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={12} className="mr-1" />
                      Resuelto
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle size={12} className="mr-1" />
                      Escalado
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}