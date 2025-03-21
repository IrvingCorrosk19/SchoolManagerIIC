import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, Trash2, Download, Users, LogOut, Upload, Calendar, FileText, CheckCircle, XCircle, AlertTriangle, MessageSquare, ChevronDown, ChevronRight, User } from 'lucide-react';
import * as XLSX from 'xlsx';
import { AttendanceModule } from './AttendanceModule';
import { DisciplineModule } from './DisciplineModule';

type Student = {
  id: number;
  name: string;
  grade: string; // Added grade level
};

type Grade = {
  studentId: number;
  assignmentId: number;
  teacherId: number;
  trimester: '1T' | '2T' | '3T';
  value: number | null;
};

type ActivityType = 'tarea' | 'parcial' | 'examen';

type Assignment = {
  id: number;
  name: string;
  type: ActivityType;
  pdfUrl?: string;
};

type Teacher = {
  id: number;
  name: string;
  subject: string;
  groups?: string[];
};

type Group = {
  id: number;
  name: string;
  grade: string;
  students: number[];
};

export function GradingModule({ teacherId }: { teacherId: number }) {
  const [activeModule, setActiveModule] = useState<'grades' | 'attendance' | 'discipline' | 'groups'>('grades');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
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

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, name: 'Tarea 1', type: 'tarea' },
    { id: 2, name: 'Parcial 1', type: 'parcial' },
    { id: 3, name: 'Examen Trimestral', type: 'examen' }
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 1, name: 'Prof. Martínez', subject: 'Matemáticas', groups: ['7-A', '8-A', '9-B'] },
    { id: 2, name: 'Prof. Sánchez', subject: 'Ciencias', groups: ['7-A', '7-B'] },
    { id: 3, name: 'Prof. López', subject: 'Historia', groups: ['8-A', '8-B'] },
    { id: 4, name: 'Prof. Rodríguez', subject: 'Literatura', groups: ['9-A'] },
    { id: 5, name: 'Prof. Gómez', subject: 'Inglés', groups: ['7-A', '8-A', '9-A'] }
  ]);

  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: '7-A', grade: '7° Grado', students: [1, 6, 7] },
    { id: 2, name: '7-B', grade: '7° Grado', students: [2, 10] },
    { id: 3, name: '8-A', grade: '8° Grado', students: [3, 8] },
    { id: 4, name: '8-B', grade: '8° Grado', students: [4] },
    { id: 5, name: '9-A', grade: '9° Grado', students: [5] },
    { id: 6, name: '9-B', grade: '9° Grado', students: [9] },
  ]);

  const [grades, setGrades] = useState<Grade[]>([]);
  const [newAssignmentName, setNewAssignmentName] = useState('');
  const [newAssignmentType, setNewAssignmentType] = useState<ActivityType>('tarea');
  const [selectedTrimester, setSelectedTrimester] = useState<'1T' | '2T' | '3T'>('1T');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  // Initialize with some sample grades
  useEffect(() => {
    const initialGrades: Grade[] = [];
    const trimesters: ('1T' | '2T' | '3T')[] = ['1T', '2T', '3T'];
    
    students.forEach(student => {
      assignments.forEach(assignment => {
        teachers.forEach(teacher => {
          trimesters.forEach(trimester => {
            // Generate random grades between 1.0 and 5.0
            const randomGrade = (Math.random() * 4) + 1;
            initialGrades.push({
              studentId: student.id,
              assignmentId: assignment.id,
              teacherId: teacher.id,
              trimester,
              value: parseFloat(randomGrade.toFixed(1))
            });
          });
        });
      });
    });
    setGrades(initialGrades);
  }, []);

  const handleLogout = () => {
    window.location.reload();
  };

  const handleGradeChange = (studentId: number, assignmentId: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    setGrades(prevGrades => 
      prevGrades.map(grade => 
        grade.studentId === studentId && 
        grade.assignmentId === assignmentId && 
        grade.teacherId === teacherId &&
        grade.trimester === selectedTrimester
          ? { ...grade, value: numValue }
          : grade
      )
    );
  };

  const getGrade = (studentId: number, assignmentId: number): number | null => {
    const grade = grades.find(g => 
      g.studentId === studentId && 
      g.assignmentId === assignmentId && 
      g.teacherId === teacherId &&
      g.trimester === selectedTrimester
    );
    return grade ? grade.value : null;
  };

  const addAssignment = () => {
    if (newAssignmentName.trim() === '') return;
    
    const newId = Math.max(0, ...assignments.map(a => a.id)) + 1;
    const newAssignment = { 
      id: newId, 
      name: newAssignmentName,
      type: newAssignmentType,
      pdfUrl: selectedPdf ? URL.createObjectURL(selectedPdf) : undefined
    };
    
    setAssignments([...assignments, newAssignment]);
    
    // Add grades for new assignment
    const newGrades = [...grades];
    const trimesters: ('1T' | '2T' | '3T')[] = ['1T', '2T', '3T'];
    
    students.forEach(student => {
      teachers.forEach(teacher => {
        trimesters.forEach(trimester => {
          newGrades.push({
            studentId: student.id,
            assignmentId: newId,
            teacherId: teacher.id,
            trimester,
            value: null
          });
        });
      });
    });
    
    setGrades(newGrades);
    setNewAssignmentName('');
    setSelectedPdf(null);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedPdf(e.target.files[0]);
    }
  };

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
    setGrades(grades.filter(grade => grade.assignmentId !== id));
  };

  const calculateAverage = (studentId: number): number => {
    // Get all grades for this student, teacher, and trimester
    const studentGrades = grades.filter(
      g => g.studentId === studentId && 
      g.teacherId === teacherId && 
      g.trimester === selectedTrimester &&
      g.value !== null
    );
    
    if (studentGrades.length === 0) return 0;
    
    // Calculate weighted average based on assignment type
    let totalWeight = 0;
    let weightedSum = 0;
    
    studentGrades.forEach(grade => {
      const assignment = assignments.find(a => a.id === grade.assignmentId);
      if (assignment && grade.value !== null) {
        let weight = 1;
        
        // Assign weights based on assignment type
        if (assignment.type === 'tarea') weight = 1;
        else if (assignment.type === 'parcial') weight = 2;
        else if (assignment.type === 'examen') weight = 3;
        
        weightedSum += grade.value * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(1)) : 0;
  };

  const calculateTrimesterAverage = (studentId: number, trimester: '1T' | '2T' | '3T'): number => {
    // Get all grades for this student, teacher, and trimester
    const studentGrades = grades.filter(
      g => g.studentId === studentId && 
      g.teacherId === teacherId && 
      g.trimester === trimester &&
      g.value !== null
    );
    
    if (studentGrades.length === 0) return 0;
    
    // Calculate weighted average based on assignment type
    let totalWeight = 0;
    let weightedSum = 0;
    
    studentGrades.forEach(grade => {
      const assignment = assignments.find(a => a.id === grade.assignmentId);
      if (assignment && grade.value !== null) {
        let weight = 1;
        
        // Assign weights based on assignment type
        if (assignment.type === 'tarea') weight = 1;
        else if (assignment.type === 'parcial') weight = 2;
        else if (assignment.type === 'examen') weight = 3;
        
        weightedSum += grade.value * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(1)) : 0;
  };

  const calculateFinalAverage = (studentId: number): number => {
    const t1 = calculateTrimesterAverage(studentId, '1T');
    const t2 = calculateTrimesterAverage(studentId, '2T');
    const t3 = calculateTrimesterAverage(studentId, '3T');
    
    // Calculate the average of the three trimesters
    const avg = (t1 + t2 + t3) / 3;
    
    // Truncate to one decimal place (not rounding)
    return Math.floor(avg * 10) / 10;
  };

  const hasStudentPassed = (average: number): boolean => {
    return average >= 3.0;
  };

  // Calculate statistics for approved and failed students
  const calculateApprovalStats = () => {
    const totalStudents = students.length;
    const approvedStudents = students.filter(student => 
      hasStudentPassed(calculateFinalAverage(student.id))
    ).length;
    
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

  const exportToExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Create data for all students and teachers
    const allData: any[] = [];
    
    students.forEach(student => {
      teachers.forEach(teacher => {
        const row: any = {
          'ID Estudiante': student.id,
          'Nombre del Estudiante': student.name,
          'Grado': student.grade,
          'Profesor': teacher.name,
          'Materia': teacher.subject,
          'Trimestre': selectedTrimester
        };
        
        // Add grades for each assignment
        assignments.forEach(assignment => {
          const grade = grades.find(g => 
            g.studentId === student.id && 
            g.assignmentId === assignment.id &&
            g.teacherId === teacher.id &&
            g.trimester === selectedTrimester
          );
          row[`${assignment.name} (${assignment.type})`] = grade && grade.value !== null ? grade.value : '';
        });
        
        // Calculate average for this student and teacher
        const teacherGrades = grades.filter(
          g => g.studentId === student.id && 
          g.teacherId === teacher.id && 
          g.trimester === selectedTrimester &&
          g.value !== null
        );
        
        let average = 0;
        if (teacherGrades.length > 0) {
          const sum = teacherGrades.reduce((acc, curr) => acc + (curr.value || 0), 0);
          average = parseFloat((sum / teacherGrades.length).toFixed(1));
        }
        
        row['Promedio'] = average;
        allData.push(row);
      });
    });
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(allData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");
    
    // Create a second worksheet with trimester and final averages
    const averagesData = students.map(student => {
      const t1 = calculateTrimesterAverage(student.id, '1T');
      const t2 = calculateTrimesterAverage(student.id, '2T');
      const t3 = calculateTrimesterAverage(student.id, '3T');
      const final = calculateFinalAverage(student.id);
      
      return {
        'ID Estudiante': student.id,
        'Nombre del Estudiante': student.name,
        'Grado': student.grade,
        'Promedio 1er Trimestre': t1,
        'Promedio 2do Trimestre': t2,
        'Promedio 3er Trimestre': t3,
        'Promedio Final': final,
        'Estado': hasStudentPassed(final) ? 'Aprobado' : 'Reprobado'
      };
    });
    
    const averagesWs = XLSX.utils.json_to_sheet(averagesData);
    XLSX.utils.book_append_sheet(wb, averagesWs, "Promedios");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `calificaciones_${selectedTrimester}.xlsx`);
  };

  // Get teacher's assigned groups
  const getTeacherGroups = (): string[] => {
    if (!teacherId) return [];
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.groups || [];
  };

  // Get students in a specific group
  const getStudentsInGroup = (groupName: string): Student[] => {
    const group = groups.find(g => g.name === groupName);
    if (!group) return [];
    
    return students.filter(student => group.students.includes(student.id));
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupName: string) => {
    if (expandedGroups.includes(groupName)) {
      setExpandedGroups(expandedGroups.filter(g => g !== groupName));
    } else {
      setExpandedGroups([...expandedGroups, groupName]);
    }
  };

  // Filter students based on selected group
  const getFilteredStudents = (): Student[] => {
    if (!selectedGroup) return students;
    return getStudentsInGroup(selectedGroup);
  };

  // Get current teacher info
  const getCurrentTeacher = (): Teacher | undefined => {
    return teachers.find(t => t.id === teacherId);
  };

  const currentTeacher = getCurrentTeacher();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-green-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Portal del Docente</h1>
            <p className="text-green-100">
              {currentTeacher?.name} - {currentTeacher?.subject}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-lg flex items-center gap-1"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeModule === 'grades' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveModule('grades')}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <span>Calificaciones</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeModule === 'groups' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveModule('groups')}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>Mis Grupos</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeModule === 'attendance' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveModule('attendance')}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>Asistencia</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeModule === 'discipline' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveModule('discipline')}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>Disciplina</span>
            </div>
          </button>
        </div>
        
        {activeModule === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="text-green-600" />
                  Mis Grupos Asignados
                </h2>
                
                {getTeacherGroups().length > 0 ? (
                  <div className="space-y-2">
                    {getTeacherGroups().map(groupName => {
                      const group = groups.find(g => g.name === groupName);
                      const isExpanded = expandedGroups.includes(groupName);
                      const studentsInGroup = getStudentsInGroup(groupName);
                      
                      return (
                        <div key={groupName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div 
                            className={`p-3 cursor-pointer flex items-center justify-between ${
                              selectedGroup === groupName ? 'bg-green-100' : ''
                            }`}
                            onClick={() => {
                              setSelectedGroup(selectedGroup === groupName ? null : groupName);
                              if (!expandedGroups.includes(groupName)) {
                                toggleGroupExpansion(groupName);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 p-2 rounded-full">
                                <Users size={16} className="text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{groupName}</h3>
                                <p className="text-xs text-gray-600">{group?.grade} • {studentsInGroup.length} estudiantes</p>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleGroupExpansion(groupName);
                              }}
                              className="text-gray-500 hover:text-green-600"
                            >
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                          </div>
                          
                          {isExpanded && (
                            <div className="px-3 pb-3">
                              <div className="border-t border-gray-100 pt-2 mt-1">
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Estudiantes:</h4>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                  {studentsInGroup.map(student => (
                                    <div key={student.id} className="flex items-center gap-2 p-1 hover:bg-green-50 rounded">
                                      <User size={14} className="text-gray-400" />
                                      <span className="text-sm">{student.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg text-center">
                    <p className="text-gray-500">No tiene grupos asignados</p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="font-medium text-blue-800 mb-2">Información:</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Los grupos son asignados por el administrador del sistema.
                </p>
                <p className="text-sm text-blue-700">
                  Si necesita acceso a un grupo adicional, contacte al administrador.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-green-50 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="text-green-600" />
                    {selectedGroup ? `Estudiantes de ${selectedGroup}` : 'Todos los Estudiantes'}
                  </h2>
                  
                  {selectedGroup && (
                    <button
                      onClick={() => setSelectedGroup(null)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver todos
                    </button>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-green-100">
                        <th className="border p-2 text-left">ID</th>
                        <th className="border p-2 text-left">Nombre</th>
                        <th className="border p-2 text-left">Grado</th>
                        <th className="border p-2 text-center">Promedio Actual</th>
                        <th className="border p-2 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredStudents().map(student => {
                        const average = calculateAverage(student.id);
                        const passed = hasStudentPassed(average);
                        
                        return (
                          <tr key={student.id} className="hover:bg-green-50">
                            <td className="border p-2">{student.id}</td>
                            <td className="border p-2">{student.name}</td>
                            <td className="border p-2">{student.grade}</td>
                            <td className="border p-2 text-center font-bold">{average.toFixed(1)}</td>
                            <td className="border p-2 text-center">
                              {passed ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle size={12} className="mr-1" /> Aprobado
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle size={12} className="mr-1" /> Reprobado
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
              
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Estadísticas del Grupo</h3>
                
                {selectedGroup ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(() => {
                      const studentsInGroup = getStudentsInGroup(selectedGroup);
                      const totalStudents = studentsInGroup.length;
                      const approvedStudents = studentsInGroup.filter(student => 
                        hasStudentPassed(calculateAverage(student.id))
                      ).length;
                      const failedStudents = totalStudents - approvedStudents;
                      const approvalPercentage = totalStudents > 0 ? (approvedStudents / totalStudents) * 100 : 0;
                      
                      return (
                        <>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-700 mb-2">Total Estudiantes</h4>
                            <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-700 mb-2">Aprobados</h4>
                            <p className="text-3xl font-bold text-green-600">{approvedStudents}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-700 mb-2">Reprobados</h4>
                            <p className="text-3xl font-bold text-red-600">{failedStudents}</p>
                          </div>
                          
                          <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-medium text-gray-700 mb-2">Tasa de Aprobación</h4>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className="bg-green-500 h-2.5 rounded-full" 
                                  style={{ width: `${approvalPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{approvalPercentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg text-center">
                    <p className="text-gray-500">Seleccione un grupo para ver sus estadísticas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeModule === 'grades' && (
          <>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trimestre</label>
                <select
                  value={selectedTrimester}
                  onChange={(e) => setSelectedTrimester(e.target.value as '1T' | '2T' | '3T')}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="1T">Primer Trimestre</option>
                  <option value="2T">Segundo Trimestre</option>
                  <option value="3T">Tercer Trimestre</option>
                </select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Grupo</label>
                <select
                  value={selectedGroup || ''}
                  onChange={(e) => setSelectedGroup(e.target.value || null)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los estudiantes</option>
                  {getTeacherGroups().map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download size={18} />
                  Exportar a Excel
                </button>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <PlusCircle className="text-green-600" />
                Agregar Nueva Actividad
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Actividad</label>
                  <input
                    type="text"
                    value={newAssignmentName}
                    onChange={(e) => setNewAssignmentName(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej. Tarea 2, Examen Final, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={newAssignmentType}
                    onChange={(e) => setNewAssignmentType(e.target.value as ActivityType)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="tarea">Tarea</option>
                    <option value="parcial">Parcial</option>
                    <option value="examen">Examen</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF (opcional)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={addAssignment}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Agregar Actividad
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="text-green-600" />
                Registro de Calificaciones {selectedGroup ? `- Grupo ${selectedGroup}` : ''}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="border p-2 text-left">Estudiante</th>
                      <th className="border p-2 text-left">Grado</th>
                      {assignments.map(assignment => (
                        <th key={assignment.id} className="border p-2 text-center">
                          <div className="flex flex-col items-center">
                            <span>{assignment.name}</span>
                            <span className="text-xs text-gray-500">
                              ({assignment.type === 'tarea' ? 'Tarea' : 
                                assignment.type === 'parcial' ? 'Parcial' : 'Examen'})
                            </span>
                            {assignment.pdfUrl && (
                              <a 
                                href={assignment.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 text-xs hover:underline"
                              >
                                Ver PDF
                              </a>
                            )}
                            <button
                              onClick={() => removeAssignment(assignment.id)}
                              className="mt-1 text-red-500 hover:text-red-700"
                              title="Eliminar actividad"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </th>
                      ))}
                      <th className="border p-2 text-center">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredStudents().map(student => (
                      <tr key={student.id} className="hover:bg-green-50">
                        <td className="border p-2">{student.name}</td>
                        <td className="border p-2">{student.grade}</td>
                        {assignments.map(assignment => (
                          <td key={assignment.id} className="border p-2 text-center">
                            <input
                              type="number"
                              min="1"
                              max="5"
                              step="0.1"
                              value={getGrade(student.id, assignment.id) || ''}
                              onChange={(e) => handleGradeChange(student.id, assignment.id, e.target.value)}
                              className="w-16 p-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </td>
                        ))}
                        <td className="border p-2 text-center font-bold">
                          {calculateAverage(student.id).toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Promedios Finales</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-green-100">
                        <th className="border p-2 text-left">Estudiante</th>
                        <th className="border p-2 text-center">1T</th>
                        <th className="border p-2 text-center">2T</th>
                        <th className="border p-2 text-center">3T</th>
                        <th className="border p-2 text-center">Final</th>
                        <th className="border p-2 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredStudents().map(student => {
                        const t1 = calculateTrimesterAverage(student.id, '1T');
                        const t2 = calculateTrimesterAverage(student.id, '2T');
                        const t3 = calculateTrimesterAverage(student.id, '3T');
                        const final = calculateFinalAverage(student.id);
                        const passed = hasStudentPassed(final);
                        
                        return (
                          <tr key={student.id} className="hover:bg-green-50">
                            <td className="border p-2">{student.name}</td>
                            <td className="border p-2 text-center">{t1.toFixed(1)}</td>
                            <td className="border p-2 text-center">{t2.toFixed(1)}</td>
                            <td className="border p-2 text-center">{t3.toFixed(1)}</td>
                            <td className="border p-2 text-center font-bold">{final.toFixed(1)}</td>
                            <td className="border p-2 text-center">
                              {passed ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle size={12} className="mr-1" /> Aprobado
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle size={12} className="mr-1" /> Reprobado
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
              
              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Estadísticas</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {(() => {
                    const stats = calculateApprovalStats();
                    
                    return (
                      <>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="font-medium mb-2">Tasa de Aprobación</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${stats.approvalPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{stats.approvalPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {stats.approvedStudents} de {stats.totalStudents} estudiantes aprobados
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="font-medium mb-2">Tasa de Reprobación</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-red-500 h-2.5 rounded-full" 
                                style={{ width: `${stats.failurePercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{stats.failurePercentage.toFixed(1)}%</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {stats.failedStudents} de {stats.totalStudents} estudiantes reprobados
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Criterios de Aprobación:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><span className="font-medium">Aprobado:</span> Promedio igual o superior a 3.0</li>
                            <li><span className="font-medium">Reprobado:</span> Promedio inferior a 3.0</li>
                          </ul>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeModule === 'attendance' && teacherId && (
          <AttendanceModule teacherId={teacherId} />
        )}
        
        {activeModule === 'discipline' && teacherId && (
          <DisciplineModule teacherId={teacherId} />
        )}
      </div>
    </div>
  );
}