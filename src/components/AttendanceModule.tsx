import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, FileText, CheckCircle, XCircle, AlertTriangle, Download, Filter, Search } from 'lucide-react';
import * as XLSX from 'xlsx';

type Student = {
  id: number;
  name: string;
  grade: string;
};

type AttendanceRecord = {
  date: string;
  studentId: number;
  status: 'present' | 'absent' | 'late';
  teacherId: number;
};

type AttendanceStats = {
  studentId: number;
  studentName: string;
  present: number;
  absent: number;
  late: number;
  percentage: number;
};

export function AttendanceModule({ teacherId }: { teacherId: number }) {
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const [students, setStudents] = useState<Student[]>([
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

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'take' | 'history' | 'stats'>('take');
  const [selectedDateRange, setSelectedDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Initialize with some sample attendance data
  useEffect(() => {
    const sampleData: AttendanceRecord[] = [];
    
    // Generate attendance for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip weekends
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      students.forEach(student => {
        // Random attendance status with 80% present, 10% absent, 10% late
        const rand = Math.random();
        let status: 'present' | 'absent' | 'late' = 'present';
        
        if (rand < 0.1) {
          status = 'absent';
        } else if (rand < 0.2) {
          status = 'late';
        }
        
        sampleData.push({
          date: dateStr,
          studentId: student.id,
          status,
          teacherId
        });
      });
    }
    
    setAttendanceRecords(sampleData);
  }, []);

  // Initialize attendance records for current day if they don't exist
  useEffect(() => {
    // Check if we already have records for today
    const hasRecordsForToday = students.every(student => 
      attendanceRecords.some(record => 
        record.date === currentDate && 
        record.studentId === student.id && 
        record.teacherId === teacherId
      )
    );

    // If not, create default records (all present)
    if (!hasRecordsForToday) {
      const newRecords = [...attendanceRecords];
      
      students.forEach(student => {
        // Only add if record doesn't exist
        const exists = attendanceRecords.some(
          r => r.date === currentDate && r.studentId === student.id && r.teacherId === teacherId
        );
        
        if (!exists) {
          newRecords.push({
            date: currentDate,
            studentId: student.id,
            status: 'present', // Default to present
            teacherId
          });
        }
      });
      
      setAttendanceRecords(newRecords);
    }
  }, [currentDate, students, teacherId]);

  const getUniqueGrades = (): string[] => {
    const grades = students.map(student => student.grade);
    return [...new Set(grades)];
  };

  const filteredStudents = students.filter(student => {
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const getAttendanceForDate = (studentId: number, date: string): 'present' | 'absent' | 'late' | null => {
    const record = attendanceRecords.find(
      r => r.studentId === studentId && r.date === date && r.teacherId === teacherId
    );
    return record ? record.status : null;
  };

  const handleAttendanceChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
    // Check if there's already a record for this student on this date
    const existingRecordIndex = attendanceRecords.findIndex(
      r => r.studentId === studentId && r.date === currentDate && r.teacherId === teacherId
    );
    
    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        status
      };
      setAttendanceRecords(updatedRecords);
    } else {
      // Create new record
      setAttendanceRecords([
        ...attendanceRecords,
        {
          date: currentDate,
          studentId,
          status,
          teacherId
        }
      ]);
    }
  };

  const getAttendanceHistory = () => {
    // Get all unique dates in the selected range
    const dates = attendanceRecords
      .filter(record => 
        record.date >= selectedDateRange.start && 
        record.date <= selectedDateRange.end &&
        record.teacherId === teacherId
      )
      .map(record => record.date);
    
    const uniqueDates = [...new Set(dates)].sort().reverse();
    
    return uniqueDates.map(date => {
      const dayRecords = attendanceRecords.filter(
        r => r.date === date && r.teacherId === teacherId
      );
      
      const presentCount = dayRecords.filter(r => r.status === 'present').length;
      const absentCount = dayRecords.filter(r => r.status === 'absent').length;
      const lateCount = dayRecords.filter(r => r.status === 'late').length;
      const total = dayRecords.length;
      
      return {
        date,
        presentCount,
        absentCount,
        lateCount,
        total,
        presentPercentage: total > 0 ? (presentCount / total) * 100 : 0
      };
    });
  };

  const calculateAttendanceStats = (): AttendanceStats[] => {
    return filteredStudents.map(student => {
      const studentRecords = attendanceRecords.filter(
        r => r.studentId === student.id && 
        r.teacherId === teacherId &&
        r.date >= selectedDateRange.start && 
        r.date <= selectedDateRange.end
      );
      
      const present = studentRecords.filter(r => r.status === 'present').length;
      const absent = studentRecords.filter(r => r.status === 'absent').length;
      const late = studentRecords.filter(r => r.status === 'late').length;
      const total = studentRecords.length;
      
      return {
        studentId: student.id,
        studentName: student.name,
        present,
        absent,
        late,
        percentage: total > 0 ? (present / total) * 100 : 0
      };
    });
  };

  const exportAttendanceToExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create data for attendance
    const attendanceData = attendanceRecords
      .filter(record => 
        record.teacherId === teacherId &&
        record.date >= selectedDateRange.start && 
        record.date <= selectedDateRange.end
      )
      .map(record => {
        const student = students.find(s => s.id === record.studentId);
        return {
          'Fecha': record.date,
          'ID Estudiante': record.studentId,
          'Nombre': student ? student.name : '',
          'Grado': student ? student.grade : '',
          'Estado': record.status === 'present' ? 'Presente' : 
                   record.status === 'absent' ? 'Ausente' : 'Tardanza'
        };
      });
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(attendanceData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    
    // Create a second worksheet with statistics
    const statsData = calculateAttendanceStats().map(stat => ({
      'ID Estudiante': stat.studentId,
      'Nombre': stat.studentName,
      'Presentes': stat.present,
      'Ausencias': stat.absent,
      'Tardanzas': stat.late,
      'Porcentaje de Asistencia': `${stat.percentage.toFixed(1)}%`
    }));
    
    const statsWs = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWs, "Estadísticas");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `asistencia_${selectedDateRange.start}_a_${selectedDateRange.end}.xlsx`);
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Function to handle date change and initialize records
  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-green-600 text-white">
        <h1 className="text-2xl font-bold">Módulo de Asistencia</h1>
        <p className="text-green-100">Registro y seguimiento de asistencia de estudiantes</p>
      </div>
      
      <div className="p-4">
        {/* Tabs Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'take' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('take')}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>Tomar Asistencia</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('history')}
          >
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>Historial</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('stats')}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <span>Estadísticas</span>
            </div>
          </button>
        </div>
        
        {/* Take Attendance Tab */}
        {activeTab === 'take' && (
          <>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[300px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex-1 min-w-[300px]">
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
              
              <div className="flex-1 min-w-[300px]">
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
            
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <h3 className="font-semibold text-green-800 flex items-center gap-2">
                <Calendar className="text-green-600" size={18} />
                Asistencia para: {formatDate(currentDate)}
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Todos los estudiantes están marcados como presentes por defecto. Solo marque ausencias o tardanzas.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border p-2 text-left">Estudiante</th>
                    <th className="border p-2 text-left">Grado</th>
                    <th className="border p-2 text-center">Estado</th>
                    <th className="border p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const attendanceStatus = getAttendanceForDate(student.id, currentDate) || 'present';
                    
                    return (
                      <tr key={student.id} className="hover:bg-green-50">
                        <td className="border p-2">{student.name}</td>
                        <td className="border p-2">{student.grade}</td>
                        <td className="border p-2 text-center">
                          {attendanceStatus === 'present' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" /> Presente
                            </span>
                          )}
                          {attendanceStatus === 'absent' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" /> Ausente
                            </span>
                          )}
                          {attendanceStatus === 'late' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertTriangle size={12} className="mr-1" /> Tardanza
                            </span>
                          )}
                        </td>
                        <td className="border p-2">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'present')}
                              className={`p-2 rounded-lg ${
                                attendanceStatus === 'present' 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                              }`}
                              title="Presente"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'absent')}
                              className={`p-2 rounded-lg ${
                                attendanceStatus === 'absent' 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                              }`}
                              title="Ausente"
                            >
                              <XCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student.id, 'late')}
                              className={`p-2 rounded-lg ${
                                attendanceStatus === 'late' 
                                  ? 'bg-yellow-500 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                              }`}
                              title="Tardanza"
                            >
                              <AlertTriangle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Leyenda:</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <div className="p-1 bg-green-500 text-white rounded-full">
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-sm">Presente (por defecto)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="p-1 bg-red-500 text-white rounded-full">
                    <XCircle size={14} />
                  </div>
                  <span className="text-sm">Ausente (A)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="p-1 bg-yellow-500 text-white rounded-full">
                    <AlertTriangle size={14} />
                  </div>
                  <span className="text-sm">Tardanza (T)</span>
                </div>
              </div>
            </div>
          </>
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
              
              <div className="flex items-end">
                <button
                  onClick={exportAttendanceToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download size={18} />
                  Exportar
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border p-2 text-left">Fecha</th>
                    <th className="border p-2 text-center">Presentes</th>
                    <th className="border p-2 text-center">Ausentes</th>
                    <th className="border p-2 text-center">Tardanzas</th>
                    <th className="border p-2 text-center">Total</th>
                    <th className="border p-2 text-center">% Asistencia</th>
                  </tr>
                </thead>
                <tbody>
                  {getAttendanceHistory().map((day, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="border p-2">{formatDate(day.date)}</td>
                      <td className="border p-2 text-center">
                        <span className="text-green-600 font-medium">{day.presentCount}</span>
                      </td>
                      <td className="border p-2 text-center">
                        <span className="text-red-600 font-medium">{day.absentCount}</span>
                      </td>
                      <td className="border p-2 text-center">
                        <span className="text-yellow-600 font-medium">{day.lateCount}</span>
                      </td>
                      <td className="border p-2 text-center">{day.total}</td>
                      <td className="border p-2 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                day.presentPercentage >= 90 ? 'bg-green-500' : 
                                day.presentPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${day.presentPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{day.presentPercentage.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
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
                  onClick={exportAttendanceToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download size={18} />
                  Exportar Estadísticas
                </button>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="text-green-600" />
                Estadísticas de Asistencia
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Asistencia Promedio</h4>
                    <p className="text-2xl font-bold">
                      {calculateAttendanceStats().reduce((sum, stat) => sum + stat.percentage, 0) / 
                       (calculateAttendanceStats().length || 1)}%
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <XCircle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Total Ausencias</h4>
                    <p className="text-2xl font-bold">
                      {calculateAttendanceStats().reduce((sum, stat) => sum + stat.absent, 0)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <AlertTriangle size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Total Tardanzas</h4>
                    <p className="text-2xl font-bold">
                      {calculateAttendanceStats().reduce((sum, stat) => sum + stat.late, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border p-2 text-left">Estudiante</th>
                    <th className="border p-2 text-center">Presentes</th>
                    <th className="border p-2 text-center">Ausentes</th>
                    <th className="border p-2 text-center">Tardanzas</th>
                    <th className="border p-2 text-center">% Asistencia</th>
                    <th className="border p-2 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateAttendanceStats().map((stat, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="border p-2">{stat.studentName}</td>
                      <td className="border p-2 text-center">
                        <span className="text-green-600 font-medium">{stat.present}</span>
                      </td>
                      <td className="border p-2 text-center">
                        <span className="text-red-600 font-medium">{stat.absent}</span>
                      </td>
                      <td className="border p-2 text-center">
                        <span className="text-yellow-600 font-medium">{stat.late}</span>
                      </td>
                      <td className="border p-2 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                stat.percentage >= 90 ? 'bg-green-500' : 
                                stat.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${stat.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stat.percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="border p-2 text-center">
                        {stat.percentage >= 90 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" /> Excelente
                          </span>
                        ) : stat.percentage >= 75 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertTriangle size={12} className="mr-1" /> Regular
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle size={12} className="mr-1" /> Crítico
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Criterios de Evaluación:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><span className="font-medium text-green-600">Excelente:</span> 90% o más de asistencia</li>
                <li><span className="font-medium text-yellow-600">Regular:</span> Entre 75% y 89% de asistencia</li>
                <li><span className="font-medium text-red-600">Crítico:</span> Menos del 75% de asistencia</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}