import { useState } from 'react';
import { School, Users, BarChart3, AlertTriangle, CheckCircle, Search, Download, LogOut, ArrowUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DirectorLogin } from './DirectorLogin';

type Teacher = {
  id: number;
  name: string;
  subject: string;
  performance: number; // 1.0-5.0 scale
  students: number;
  averageGrade: number;
  lastActivity: string;
};

type PerformanceData = {
  subject: string;
  averageGrade: number;
  studentCount: number;
};

export function DirectorPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teachers] = useState<Teacher[]>([
    { 
      id: 1, 
      name: 'Prof. Martínez', 
      subject: 'Matemáticas', 
      performance: 4.3, 
      students: 120, 
      averageGrade: 3.8,
      lastActivity: '2025-04-10'
    },
    { 
      id: 2, 
      name: 'Prof. Sánchez', 
      subject: 'Ciencias', 
      performance: 4.6, 
      students: 95, 
      averageGrade: 4.1,
      lastActivity: '2025-04-11'
    },
    { 
      id: 3, 
      name: 'Prof. López', 
      subject: 'Historia', 
      performance: 3.7, 
      students: 110, 
      averageGrade: 3.4,
      lastActivity: '2025-04-09'
    },
    { 
      id: 4, 
      name: 'Prof. Rodríguez', 
      subject: 'Literatura', 
      performance: 4.4, 
      students: 85, 
      averageGrade: 3.8,
      lastActivity: '2025-04-10'
    },
    { 
      id: 5, 
      name: 'Prof. Gómez', 
      subject: 'Inglés', 
      performance: 4.0, 
      students: 130, 
      averageGrade: 3.6,
      lastActivity: '2025-04-11'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);

  // Performance data for charts
  const performanceData: PerformanceData[] = [
    { subject: 'Matemáticas', averageGrade: 3.8, studentCount: 120 },
    { subject: 'Ciencias', averageGrade: 4.1, studentCount: 95 },
    { subject: 'Historia', averageGrade: 3.4, studentCount: 110 },
    { subject: 'Literatura', averageGrade: 3.8, studentCount: 85 },
    { subject: 'Inglés', averageGrade: 3.6, studentCount: 130 }
  ];

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPerformanceColor = (performance: number): string => {
    if (performance >= 4.0) return 'bg-green-500';
    if (performance >= 3.0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTeacherById = (id: number): Teacher | undefined => {
    return teachers.find(teacher => teacher.id === id);
  };

  const exportTeacherReport = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create data for teachers
    const teacherData = teachers.map(teacher => {
      const stats = getTeacherApprovalStats(teacher.id);
      return {
        'ID': teacher.id,
        'Nombre': teacher.name,
        'Materia': teacher.subject,
        'Desempeño': teacher.performance,
        'Estudiantes': teacher.students,
        'Aprobados': stats?.approvedStudents || 0,
        'Reprobados': stats?.failedStudents || 0,
        'Promedio de Calificaciones': teacher.averageGrade,
        'Última Actividad': teacher.lastActivity
      };
    });
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(teacherData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Profesores");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "reporte_profesores.xlsx");
  };

  // Calculate statistics for approved and failed students
  const calculateApprovalStats = () => {
    const totalStudents = teachers.reduce((sum, teacher) => sum + teacher.students, 0);
    
    // Calculate approved students based on average grades
    const approvedStudents = teachers.reduce((sum, teacher) => {
      // Assuming students with grade >= 3.0 are approved
      const approvalRate = teacher.averageGrade >= 3.0 ? 
        (teacher.averageGrade - 3.0) / 2.0 + 0.5 : // Scale from 50% to 100% for grades 3.0-5.0
        (teacher.averageGrade / 3.0) * 0.5; // Scale from 0% to 50% for grades 0-3.0
      
      return sum + Math.round(teacher.students * approvalRate);
    }, 0);
    
    const failedStudents = totalStudents - approvedStudents;
    const approvalPercentage = (approvedStudents / totalStudents) * 100;
    const failurePercentage = (failedStudents / totalStudents) * 100;
    
    return {
      totalStudents,
      approvedStudents,
      failedStudents,
      approvalPercentage,
      failurePercentage
    };
  };

  // Get teacher-specific approval stats
  const getTeacherApprovalStats = (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return null;
    
    // Assuming students with grade >= 3.0 are approved
    const approvalRate = teacher.averageGrade >= 3.0 ? 
      (teacher.averageGrade - 3.0) / 2.0 + 0.5 : // Scale from 50% to 100% for grades 3.0-5.0
      (teacher.averageGrade / 3.0) * 0.5; // Scale from 0% to 50% for grades 0-3.0
    
    const approvedStudents = Math.round(teacher.students * approvalRate);
    const failedStudents = teacher.students - approvedStudents;
    
    return {
      totalStudents: teacher.students,
      approvedStudents,
      failedStudents,
      approvalPercentage: (approvedStudents / teacher.students) * 100,
      failurePercentage: (failedStudents / teacher.students) * 100
    };
  };

  if (!isLoggedIn) {
    return <DirectorLogin onLogin={handleLogin} />;
  }

  // Calculate overall statistics
  const overallStats = calculateApprovalStats();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Portal del Director</h1>
            <p className="text-blue-100">Supervisión y análisis del desempeño docente</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-lg flex items-center gap-1"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm text-blue-600 font-medium">Total Estudiantes</h3>
              <p className="text-2xl font-bold">{overallStats.totalStudents}</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-sm text-green-600 font-medium">Aprobados</h3>
              <p className="text-2xl font-bold">{overallStats.approvedStudents}</p>
              <p className="text-xs text-green-600">({overallStats.approvalPercentage.toFixed(1)}%)</p>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-sm text-red-600 font-medium">Reprobados</h3>
              <p className="text-2xl font-bold">{overallStats.failedStudents}</p>
              <p className="text-xs text-red-600">({overallStats.failurePercentage.toFixed(1)}%)</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <School className="text-blue-600" />
            Desempeño por Materia
          </h2>
          
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="grid grid-cols-1 gap-4">
              {performanceData.map((data, index) => {
                const teacher = teachers.find(t => t.subject === data.subject);
                const stats = teacher ? getTeacherApprovalStats(teacher.id) : null;
                
                return (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{data.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        data.averageGrade >= 4.0 ? 'bg-green-500' : 
                        data.averageGrade >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {data.averageGrade.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          data.averageGrade >= 4.0 ? 'bg-green-500' : 
                          data.averageGrade >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(data.averageGrade / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>{data.studentCount} estudiantes</span>
                      {stats && (
                        <span>Aprobados: {stats.approvedStudents} | Reprobados: {stats.failedStudents}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="text-blue-600" />
              Profesores
            </h2>
            
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar profesor..."
                  className="p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search size={16} className="absolute left-2 top-3 text-gray-400" />
              </div>
              
              <button
                onClick={exportTeacherReport}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1"
              >
                <Download size={16} />
                Exportar
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border p-2 text-left">Profesor</th>
                  <th className="border p-2 text-left">Materia</th>
                  <th className="border p-2 text-center">Desempeño</th>
                  <th className="border p-2 text-center">Estudiantes</th>
                  <th className="border p-2 text-center">Promedio</th>
                  <th className="border p-2 text-center">Aprobados</th>
                  <th className="border p-2 text-center">Reprobados</th>
                  <th className="border p-2 text-center">Última Actividad</th>
                  <th className="border p-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map(teacher => {
                  const stats = getTeacherApprovalStats(teacher.id);
                  
                  return (
                    <tr 
                      key={teacher.id} 
                      className={`hover:bg-blue-50 cursor-pointer ${selectedTeacher === teacher.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedTeacher(teacher.id === selectedTeacher ? null : teacher.id)}
                    >
                      <td className="border p-2">{teacher.name}</td>
                      <td className="border p-2">{teacher.subject}</td>
                      <td className="border p-2 text-center">
                        <div className="flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getPerformanceColor(teacher.performance)}`}>
                            {teacher.performance.toFixed(1)}
                          </div>
                        </div>
                      </td>
                      <td className="border p-2 text-center">{teacher.students}</td>
                      <td className="border p-2 text-center">{teacher.averageGrade.toFixed(1)}</td>
                      <td className="border p-2 text-center">
                        {stats && (
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-green-600">{stats.approvedStudents}</span>
                            <span className="text-xs text-gray-500">({stats.approvalPercentage.toFixed(1)}%)</span>
                          </div>
                        )}
                      </td>
                      <td className="border p-2 text-center">
                        {stats && (
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-red-600">{stats.failedStudents}</span>
                            <span className="text-xs text-gray-500">({stats.failurePercentage.toFixed(1)}%)</span>
                          </div>
                        )}
                      </td>
                      <td className="border p-2 text-center">{teacher.lastActivity}</td>
                      <td className="border p-2 text-center">
                        {teacher.performance >= 4.0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" /> Excelente
                          </span>
                        ) : teacher.performance >= 3.0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertTriangle size={12} className="mr-1" /> Regular
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle size={12} className="mr-1" /> Atención
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {selectedTeacher !== null && (
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-3">Detalles del Profesor</h3>
            
            {(() => {
              const teacher = getTeacherById(selectedTeacher);
              if (!teacher) return null;
              
              const stats = getTeacherApprovalStats(teacher.id);
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-blue-700 mb-2">Información Personal</h4>
                    <p><span className="font-medium">Nombre:</span> {teacher.name}</p>
                    <p><span className="font-medium">Materia:</span> {teacher.subject}</p>
                    <p><span className="font-medium">Estudiantes:</span> {teacher.students}</p>
                    <p><span className="font-medium">Última actividad:</span> {teacher.lastActivity}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-blue-700 mb-2">Métricas de Desempeño</h4>
                    <div className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Desempeño General</span>
                        <span className="text-sm font-medium">{teacher.performance.toFixed(1)}/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={getPerformanceColor(teacher.performance)}
                          style={{ width: `${(teacher.performance / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Promedio de Calificaciones</span>
                        <span className="text-sm font-medium">{teacher.averageGrade.toFixed(1)}/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={teacher.averageGrade >= 4.0 ? 'bg-green-500' : teacher.averageGrade >= 3.0 ? 'bg-yellow-500' : 'bg-red-500'}
                          style={{ width: `${(teacher.averageGrade / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {stats && (
                      <div className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Tasa de Aprobación</span>
                          <span className="text-sm font-medium">{stats.approvalPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={stats.approvalPercentage >= 80 ? 'bg-green-500' : stats.approvalPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
                            style={{ width: `${stats.approvalPercentage}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600 flex justify-between">
                          <span className="text-green-600">Aprobados: {stats.approvedStudents}</span>
                          <span className="text-red-600">Reprobados: {stats.failedStudents}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="font-medium">Total: {stats.totalStudents}</span> (Aprobados + Reprobados = Total)
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-sm mb-2">Recomendaciones:</h5>
                      {teacher.performance < 4.0 ? (
                        <ul className="text-sm list-disc pl-5 text-gray-700">
                          <li>Programar una reunión de seguimiento</li>
                          <li>Revisar metodología de enseñanza</li>
                          <li>Ofrecer recursos adicionales</li>
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-700">El profesor muestra un desempeño satisfactorio. Se recomienda mantener el seguimiento regular.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Estadísticas de Aprobación</h3>
            
            {(() => {
              const stats = calculateApprovalStats();
              
              return (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Tasa de Aprobación General</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={stats.approvalPercentage >= 80 ? 'bg-green-500' : stats.approvalPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
                          style={{ width: `${stats.approvalPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{stats.approvalPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Aprobados</p>
                        <p className="text-lg font-bold text-green-600">{stats.approvedStudents}</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Reprobados</p>
                        <p className="text-lg font-bold text-red-600">{stats.failedStudents}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-center text-sm">
                      <span className="font-medium">Total: {stats.totalStudents}</span> (Aprobados + Reprobados = Total)
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Promedio General</h4>
                      <div className="flex items-center mb-4">
                        <div className="w-24 text-right pr-4">
                          <p className="text-sm text-gray-500">2024</p>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-5">
                            <div 
                              className="bg-blue-500 h-5 rounded-full flex items-center pl-2 text-xs text-white font-medium" 
                              style={{ width: '70%' }}
                            >
                              3.5
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-24 text-right pr-4">
                          <p className="text-sm text-gray-500">2025</p>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-5">
                            <div 
                              className="bg-blue-500 h-5 rounded-full flex items-center pl-2 text-xs text-white font-medium" 
                              style={{ width: '76%' }}
                            >
                              3.8
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pl-24">
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <span className="flex items-center">
                              <ArrowUp size={12} className="mr-1" />
                              0.3 puntos de incremento
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-3">Análisis de Tendencia</h4>
                    <p className="text-sm text-gray-600">
                      Se observa una mejora significativa en la tasa de aprobación y el promedio general respecto al año anterior. 
                      Las materias con mayor incremento son Ciencias y Matemáticas, mientras que Historia aún presenta desafíos.
                    </p>
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">Recomendaciones:</h5>
                      <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                        <li>Implementar plan de refuerzo para la materia de Historia</li>
                        <li>Reconocer el desempeño destacado del Prof. Sánchez</li>
                        <li>Extender las estrategias exitosas de Ciencias a otras materias</li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-3">Aprobación por Materia</h3>
            
            <div className="space-y-4">
              {performanceData.map((data, index) => {
                const teacher = teachers.find(t => t.subject === data.subject);
                if (!teacher) return null;
                
                const stats = getTeacherApprovalStats(teacher.id);
                if (!stats) return null;
                
                return (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{data.subject}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                        stats.approvalPercentage >= 80 ? 'bg-green-500' : 
                        stats.approvalPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {stats.approvalPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div 
                        className={stats.approvalPercentage >= 80 ? 'bg-green-500' : 
                                  stats.approvalPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}
                        style={{ width: `${stats.approvalPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Profesor: {teacher.name}</span>
                      <span>Total: {stats.totalStudents} estudiantes</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-green-600">Aprobados: {stats.approvedStudents}</span>
                      <span className="text-red-600">Reprobados: {stats.failedStudents}</span>
                    </div>
                  </div>
                );
              })}
              
              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <h4 className="font-medium text-blue-800 mb-2">Criterios de Aprobación:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><span className="font-medium">Excelente:</span> 80% o más de aprobación</li>
                  <li><span className="font-medium">Regular:</span> Entre 60% y 79% de aprobación</li>
                  <li><span className="font-medium">Crítico:</span> Menos del 60% de aprobación</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-3">Alertas y Notificaciones</h3>
          
          <div className="space-y-3">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Bajo rendimiento en Historia</h4>
                  <p className="text-sm text-gray-600">El promedio de calificaciones en Historia está por debajo del objetivo.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
              <div className="flex items-start">
                <CheckCircle size={20} className="text-green-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Excelente desempeño en Ciencias</h4>
                  <p className="text-sm text-gray-600">El Prof. Sánchez ha mantenido un promedio superior a 4.0 durante el último trimestre.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
              <div className="flex items-start">
                <BarChart3 size={20} className="text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Reporte mensual disponible</h4>
                  <p className="text-sm text-gray-600">El reporte de desempeño docente de abril está listo para su revisión.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}