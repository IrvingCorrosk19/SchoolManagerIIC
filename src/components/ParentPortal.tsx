import React, { useState } from 'react';
import { ParentLogin } from './ParentLogin';
import { Calendar, Book, AlertCircle, FileText, User, Clock, Download, ExternalLink, File } from 'lucide-react';

export function ParentPortal() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [activeTrimester, setActiveTrimester] = useState<'1T' | '2T' | '3T'>('1T');

  const handleLogin = (id: number) => {
    setStudentId(id);
  };

  if (!studentId) {
    return <ParentLogin onLogin={handleLogin} />;
  }

  // Mock data for student information
  const studentInfo = {
    id: studentId,
    name: studentId === 1 ? 'Ana García' : studentId === 2 ? 'Carlos Rodríguez' : 'María López',
    grade: studentId === 1 ? '1° Primaria' : studentId === 2 ? '2° Primaria' : '3° Primaria'
  };

  // Mock data for teachers
  const teachers = [
    { id: 1, name: 'Prof. Martínez', subject: 'Matemáticas' },
    { id: 2, name: 'Prof. Sánchez', subject: 'Ciencias' },
    { id: 3, name: 'Prof. López', subject: 'Historia' },
    { id: 4, name: 'Prof. Rodríguez', subject: 'Literatura' },
    { id: 5, name: 'Prof. Gómez', subject: 'Inglés' }
  ];

  // Mock data for grades by trimester
  const gradesByTrimester = {
    '1T': [
      { subject: 'Matemáticas', teacher: 'Prof. Martínez', grade: 4.2, status: 'Aprobado' },
      { subject: 'Ciencias', teacher: 'Prof. Sánchez', grade: 3.8, status: 'Aprobado' },
      { subject: 'Historia', teacher: 'Prof. López', grade: 3.5, status: 'Aprobado' },
      { subject: 'Literatura', teacher: 'Prof. Rodríguez', grade: 4.0, status: 'Aprobado' },
      { subject: 'Inglés', teacher: 'Prof. Gómez', grade: 2.8, status: 'Reprobado' }
    ],
    '2T': [
      { subject: 'Matemáticas', teacher: 'Prof. Martínez', grade: 4.0, status: 'Aprobado' },
      { subject: 'Ciencias', teacher: 'Prof. Sánchez', grade: 4.2, status: 'Aprobado' },
      { subject: 'Historia', teacher: 'Prof. López', grade: 3.7, status: 'Aprobado' },
      { subject: 'Literatura', teacher: 'Prof. Rodríguez', grade: 3.8, status: 'Aprobado' },
      { subject: 'Inglés', teacher: 'Prof. Gómez', grade: 3.2, status: 'Aprobado' }
    ],
    '3T': [
      { subject: 'Matemáticas', teacher: 'Prof. Martínez', grade: 4.5, status: 'Aprobado' },
      { subject: 'Ciencias', teacher: 'Prof. Sánchez', grade: 4.0, status: 'Aprobado' },
      { subject: 'Historia', teacher: 'Prof. López', grade: 3.8, status: 'Aprobado' },
      { subject: 'Literatura', teacher: 'Prof. Rodríguez', grade: 4.2, status: 'Aprobado' },
      { subject: 'Inglés', teacher: 'Prof. Gómez', grade: 3.5, status: 'Aprobado' }
    ]
  };

  // Mock data for activities by trimester with attachments
  const activitiesByTrimester = {
    '1T': [
      { 
        id: 1, 
        name: 'Tarea 1 - Ecuaciones', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'tarea', 
        date: '2025-02-10', 
        grade: 4.0,
        attachments: [
          { name: 'Instrucciones_Ecuaciones.pdf', url: 'https://example.com/files/instrucciones_ecuaciones.pdf', type: 'pdf' },
          { name: 'Ejemplos_Resueltos.pdf', url: 'https://example.com/files/ejemplos_resueltos.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 2, 
        name: 'Parcial 1', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'parcial', 
        date: '2025-02-25', 
        grade: 4.3,
        attachments: [
          { name: 'Guia_Estudio_Parcial1.pdf', url: 'https://example.com/files/guia_estudio_parcial1.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 3, 
        name: 'Experimento de Ciencias', 
        subject: 'Ciencias', 
        teacher: 'Prof. Sánchez', 
        type: 'tarea', 
        date: '2025-02-15', 
        grade: 3.8,
        attachments: [
          { name: 'Instrucciones_Experimento.pdf', url: 'https://example.com/files/instrucciones_experimento.pdf', type: 'pdf' },
          { name: 'Material_Requerido.docx', url: 'https://example.com/files/material_requerido.docx', type: 'doc' }
        ]
      },
      { 
        id: 4, 
        name: 'Ensayo Histórico', 
        subject: 'Historia', 
        teacher: 'Prof. López', 
        type: 'tarea', 
        date: '2025-03-05', 
        grade: 3.5,
        attachments: [
          { name: 'Guia_Ensayo.pdf', url: 'https://example.com/files/guia_ensayo.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 5, 
        name: 'Examen Trimestral', 
        subject: 'Inglés', 
        teacher: 'Prof. Gómez', 
        type: 'examen', 
        date: '2025-03-20', 
        grade: 2.8,
        attachments: [
          { name: 'Temario_Examen.pdf', url: 'https://example.com/files/temario_examen.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 16, 
        name: 'Tarea 2 - Fracciones', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'tarea', 
        date: '2025-03-15', 
        grade: 4.2,
        attachments: [
          { name: 'Ejercicios_Fracciones.pdf', url: 'https://example.com/files/ejercicios_fracciones.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 17, 
        name: 'Examen Final', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'examen', 
        date: '2025-03-30', 
        grade: 4.1,
        attachments: [
          { name: 'Guia_Estudio_Final.pdf', url: 'https://example.com/files/guia_estudio_final.pdf', type: 'pdf' },
          { name: 'Formulario.pdf', url: 'https://example.com/files/formulario.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 18, 
        name: 'Parcial Ciencias', 
        subject: 'Ciencias', 
        teacher: 'Prof. Sánchez', 
        type: 'parcial', 
        date: '2025-03-12', 
        grade: 3.9,
        attachments: []
      },
      { 
        id: 19, 
        name: 'Examen Final Ciencias', 
        subject: 'Ciencias', 
        teacher: 'Prof. Sánchez', 
        type: 'examen', 
        date: '2025-03-28', 
        grade: 3.7,
        attachments: [
          { name: 'Temario_Final_Ciencias.pdf', url: 'https://example.com/files/temario_final_ciencias.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 20, 
        name: 'Parcial Historia', 
        subject: 'Historia', 
        teacher: 'Prof. López', 
        type: 'parcial', 
        date: '2025-03-18', 
        grade: 3.6,
        attachments: []
      }
    ],
    '2T': [
      { 
        id: 6, 
        name: 'Tarea 2 - Geometría', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'tarea', 
        date: '2025-04-12', 
        grade: 3.8,
        attachments: [
          { name: 'Ejercicios_Geometria.pdf', url: 'https://example.com/files/ejercicios_geometria.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 7, 
        name: 'Proyecto de Ciencias', 
        subject: 'Ciencias', 
        teacher: 'Prof. Sánchez', 
        type: 'tarea', 
        date: '2025-04-20', 
        grade: 4.5,
        attachments: [
          { name: 'Guia_Proyecto.pdf', url: 'https://example.com/files/guia_proyecto.pdf', type: 'pdf' },
          { name: 'Rubrica_Evaluacion.pdf', url: 'https://example.com/files/rubrica_evaluacion.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 8, 
        name: 'Parcial 2', 
        subject: 'Historia', 
        teacher: 'Prof. López', 
        type: 'parcial', 
        date: '2025-05-05', 
        grade: 3.7,
        attachments: []
      },
      { 
        id: 9, 
        name: 'Análisis Literario', 
        subject: 'Literatura', 
        teacher: 'Prof. Rodríguez', 
        type: 'tarea', 
        date: '2025-05-15', 
        grade: 3.8,
        attachments: [
          { name: 'Guia_Analisis.pdf', url: 'https://example.com/files/guia_analisis.pdf', type: 'pdf' },
          { name: 'Texto_Analizar.pdf', url: 'https://example.com/files/texto_analizar.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 10, 
        name: 'Examen Oral', 
        subject: 'Inglés', 
        teacher: 'Prof. Gómez', 
        type: 'examen', 
        date: '2025-05-25', 
        grade: 3.2,
        attachments: [
          { name: 'Temas_Examen_Oral.pdf', url: 'https://example.com/files/temas_examen_oral.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 21, 
        name: 'Tarea 3 - Álgebra', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'tarea', 
        date: '2025-05-10', 
        grade: 4.0,
        attachments: [
          { name: 'Ejercicios_Algebra.pdf', url: 'https://example.com/files/ejercicios_algebra.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 22, 
        name: 'Parcial Matemáticas', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'parcial', 
        date: '2025-05-20', 
        grade: 4.1,
        attachments: []
      },
      { 
        id: 23, 
        name: 'Examen Final 2T', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'examen', 
        date: '2025-06-01', 
        grade: 4.0,
        attachments: [
          { name: 'Guia_Estudio_Final_2T.pdf', url: 'https://example.com/files/guia_estudio_final_2t.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 24, 
        name: 'Parcial Literatura', 
        subject: 'Literatura', 
        teacher: 'Prof. Rodríguez', 
        type: 'parcial', 
        date: '2025-05-22', 
        grade: 3.9,
        attachments: []
      },
      { 
        id: 25, 
        name: 'Examen Final Literatura', 
        subject: 'Literatura', 
        teacher: 'Prof. Rodríguez', 
        type: 'examen', 
        date: '2025-06-02', 
        grade: 3.7,
        attachments: [
          { name: 'Temario_Final_Literatura.pdf', url: 'https://example.com/files/temario_final_literatura.pdf', type: 'pdf' }
        ]
      }
    ],
    '3T': [
      { 
        id: 11, 
        name: 'Proyecto Final', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'tarea', 
        date: '2025-06-10', 
        grade: 4.7,
        attachments: [
          { name: 'Instrucciones_Proyecto_Final.pdf', url: 'https://example.com/files/instrucciones_proyecto_final.pdf', type: 'pdf' },
          { name: 'Plantilla_Proyecto.docx', url: 'https://example.com/files/plantilla_proyecto.docx', type: 'doc' }
        ]
      },
      { 
        id: 12, 
        name: 'Exposición Científica', 
        subject: 'Ciencias', 
        teacher: 'Prof. Sánchez', 
        type: 'tarea', 
        date: '2025-06-20', 
        grade: 4.0,
        attachments: [
          { name: 'Guia_Exposicion.pdf', url: 'https://example.com/files/guia_exposicion.pdf', type: 'pdf' },
          { name: 'Rubrica_Evaluacion.pdf', url: 'https://example.com/files/rubrica_evaluacion_expo.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 13, 
        name: 'Examen Final', 
        subject: 'Historia', 
        teacher: 'Prof. López', 
        type: 'examen', 
        date: '2025-07-05', 
        grade: 3.8,
        attachments: [
          { name: 'Temario_Final_Historia.pdf', url: 'https://example.com/files/temario_final_historia.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 14, 
        name: 'Ensayo Final', 
        subject: 'Literatura', 
        teacher: 'Prof. Rodríguez', 
        type: 'tarea', 
        date: '2025-07-10', 
        grade: 4.2,
        attachments: [
          { name: 'Instrucciones_Ensayo_Final.pdf', url: 'https://example.com/files/instrucciones_ensayo_final.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 15, 
        name: 'Presentación', 
        subject: 'Inglés', 
        teacher: 'Prof. Gómez', 
        type: 'examen', 
        date: '2025-07-15', 
        grade: 3.5,
        attachments: [
          { name: 'Temas_Presentacion.pdf', url: 'https://example.com/files/temas_presentacion.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 26, 
        name: 'Tarea Final', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'tarea', 
        date: '2025-07-01', 
        grade: 4.5,
        attachments: [
          { name: 'Ejercicios_Finales.pdf', url: 'https://example.com/files/ejercicios_finales.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 27, 
        name: 'Parcial Final', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'parcial', 
        date: '2025-07-12', 
        grade: 4.4,
        attachments: []
      },
      { 
        id: 28, 
        name: 'Examen Final 3T', 
        subject: 'Matemáticas', 
        teacher: 'Prof. Martínez', 
        type: 'examen', 
        date: '2025-07-25', 
        grade: 4.5,
        attachments: [
          { name: 'Guia_Estudio_Final_3T.pdf', url: 'https://example.com/files/guia_estudio_final_3t.pdf', type: 'pdf' },
          { name: 'Formulario_Final.pdf', url: 'https://example.com/files/formulario_final.pdf', type: 'pdf' }
        ]
      },
      { 
        id: 29, 
        name: 'Parcial Final Historia', 
        subject: 'Historia', 
        teacher: 'Prof. López', 
        type: 'parcial', 
        date: '2025-07-14', 
        grade: 3.9,
        attachments: []
      },
      { 
        id: 30, 
        name: 'Tarea Final Historia', 
        subject: 'Historia', 
        teacher: 'Prof. López', 
        type: 'tarea', 
        date: '2025-07-05', 
        grade: 3.7,
        attachments: [
          { name: 'Instrucciones_Tarea_Final.pdf', url: 'https://example.com/files/instrucciones_tarea_final.pdf', type: 'pdf' }
        ]
      }
    ]
  };

  // Mock data for discipline records
  const disciplineRecords = [
    { 
      id: 1, 
      date: '2025-02-15', 
      teacher: 'Prof. Martínez', 
      subject: 'Matemáticas',
      type: 'comment', 
      description: 'No completó la tarea asignada para hoy.', 
      status: 'resolved' 
    },
    { 
      id: 2, 
      date: '2025-03-10', 
      teacher: 'Prof. López', 
      subject: 'Historia',
      type: 'citation', 
      description: 'Comportamiento disruptivo durante la clase. Se solicita reunión con los padres.', 
      status: 'pending' 
    },
    { 
      id: 3, 
      date: '2025-04-05', 
      teacher: 'Prof. Gómez', 
      subject: 'Inglés',
      type: 'comment', 
      description: 'Mejoró significativamente su participación en clase.', 
      status: 'resolved' 
    },
    { 
      id: 4, 
      date: '2025-05-20', 
      teacher: 'Prof. Sánchez', 
      subject: 'Ciencias',
      type: 'comment', 
      description: 'No trajo los materiales solicitados para el experimento.', 
      status: 'resolved' 
    }
  ];

  // Mock data for attendance
  const attendanceData = [
    { month: 'Enero', present: 18, absent: 2, late: 1 },
    { month: 'Febrero', present: 16, absent: 3, late: 2 },
    { month: 'Marzo', present: 20, absent: 0, late: 1 },
    { month: 'Abril', present: 19, absent: 1, late: 0 }
  ];

  // Calculate average grade for current trimester
  const calculateAverage = (grades) => {
    const sum = grades.reduce((total, grade) => total + grade.grade, 0);
    // Truncate to one decimal place (not rounding)
    return Math.floor((sum / grades.length) * 10) / 10;
  };

  // Calculate final grade (average of all trimesters) for a subject
  const calculateFinalGrade = (subject) => {
    const t1Grade = gradesByTrimester['1T'].find(g => g.subject === subject)?.grade || 0;
    const t2Grade = gradesByTrimester['2T'].find(g => g.subject === subject)?.grade || 0;
    const t3Grade = gradesByTrimester['3T'].find(g => g.subject === subject)?.grade || 0;
    
    // Calculate average and truncate to one decimal place
    return Math.floor(((t1Grade + t2Grade + t3Grade) / 3) * 10) / 10;
  };

  // Calculate average by activity type for a subject in the current trimester
  const calculateAverageByType = (subject, type) => {
    const activities = activitiesByTrimester[activeTrimester].filter(
      a => a.subject === subject && a.type === type
    );
    
    if (activities.length === 0) return 0;
    
    const sum = activities.reduce((total, activity) => total + activity.grade, 0);
    // Truncate to one decimal place
    return Math.floor((sum / activities.length) * 10) / 10;
  };

  // Get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText size={16} className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText size={16} className="text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText size={16} className="text-orange-500" />;
      default:
        return <File size={16} className="text-gray-500" />;
    }
  };

  const currentGrades = gradesByTrimester[activeTrimester];
  const averageGrade = calculateAverage(currentGrades);
  const passStatus = parseFloat(averageGrade) >= 3.0 ? 'Aprobado' : 'Reprobado';

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-green-600 text-white">
        <h1 className="text-2xl font-bold">Portal para Padres</h1>
        <p className="text-green-100">Consulta de calificaciones y asistencia</p>
      </div>
      
      <div className="p-6">
        <div className="bg-green-50 p-4 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <User className="text-green-600" />
            Información del Estudiante
          </h2>
          <p><strong>ID:</strong> {studentInfo.id}</p>
          <p><strong>Nombre:</strong> {studentInfo.name}</p>
          <p><strong>Grado:</strong> {studentInfo.grade}</p>
        </div>
        
        {/* Trimester Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Calendar className="text-green-600" />
            Período Académico
          </h2>
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${activeTrimester === '1T' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
              onClick={() => setActiveTrimester('1T')}
            >
              Primer Trimestre
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTrimester === '2T' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
              onClick={() => setActiveTrimester('2T')}
            >
              Segundo Trimestre
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTrimester === '3T' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-green-500'}`}
              onClick={() => setActiveTrimester('3T')}
            >
              Tercer Trimestre
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-green-600" />
              Calificaciones
            </h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left">Materia</th>
                    <th className="py-2 px-4 text-left">Docente</th>
                    <th className="py-2 px-4 text-center">Calificación</th>
                    <th className="py-2 px-4 text-center">Final</th>
                    <th className="py-2 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGrades.map((grade, index) => {
                    const finalGrade = calculateFinalGrade(grade.subject);
                    const finalStatus = finalGrade >= 3.0 ? 'Aprobado' : 'Reprobado';
                    
                    return (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{grade.subject}</td>
                        <td className="py-2 px-4">{grade.teacher}</td>
                        <td className="py-2 px-4 text-center">{grade.grade.toFixed(1)}</td>
                        <td className="py-2 px-4 text-center font-bold">{finalGrade.toFixed(1)}</td>
                        <td className="py-2 px-4 text-center">
                          <span className={`inline-block ${finalStatus === 'Aprobado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded`}>
                            {finalStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t">
                    <td className="py-2 px-4 font-bold" colSpan={2}>Promedio General</td>
                    <td className="py-2 px-4 text-center font-bold">{averageGrade.toFixed(1)}</td>
                    <td className="py-2 px-4 text-center font-bold">
                      {calculateAverage(currentGrades.map(grade => ({ grade: calculateFinalGrade(grade.subject) }))).toFixed(1)}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block ${passStatus === 'Aprobado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded`}>
                        {passStatus}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="text-green-600" />
              Asistencia
            </h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-4 text-left">Mes</th>
                    <th className="py-2 px-4 text-center">Asistencias</th>
                    <th className="py-2 px-4 text-center">Ausencias</th>
                    <th className="py-2 px-4 text-center">Tardanzas</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((month, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4">{month.month}</td>
                      <td className="py-2 px-4 text-center">{month.present}</td>
                      <td className="py-2 px-4 text-center">{month.absent}</td>
                      <td className="py-2 px-4 text-center">{month.late}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t">
                    <td className="py-2 px-4 font-bold">Total</td>
                    <td className="py-2 px-4 text-center font-bold">
                      {attendanceData.reduce((sum, month) => sum + month.present, 0)}
                    </td>
                    <td className="py-2 px-4 text-center font-bold">
                      {attendanceData.reduce((sum, month) => sum + month.absent, 0)}
                    </td>
                    <td className="py-2 px-4 text-center font-bold">
                      {attendanceData.reduce((sum, month) => sum + month.late, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Detailed Subject Performance */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Book className="text-green-600" />
            Desempeño por Materia - {activeTrimester === '1T' ? 'Primer Trimestre' : activeTrimester === '2T' ? 'Segundo Trimestre' : 'Tercer Trimestre'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGrades.map((grade, index) => {
              const homeworkAvg = calculateAverageByType(grade.subject, 'tarea');
              const partialAvg = calculateAverageByType(grade.subject, 'parcial');
              const examAvg = calculateAverageByType(grade.subject, 'examen');
              
              return (
                <div key={index} className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 py-2 px-4 border-b">
                    <h3 className="font-medium">{grade.subject}</h3>
                    <p className="text-sm text-gray-500">Docente: {grade.teacher}</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Promedio Tareas:</p>
                        <p className="font-bold text-lg">{homeworkAvg.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Promedio Parciales:</p>
                        <p className="font-bold text-lg">{partialAvg.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Promedio Exámenes:</p>
                        <p className="font-bold text-lg">{examAvg.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nota Trimestre:</p>
                        <p className="font-bold text-lg">{grade.grade.toFixed(1)}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Nota Final:</p>
                        <p className="font-bold text-lg">{calculateFinalGrade(grade.subject).toFixed(1)}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className={`h-2.5 rounded-full ${calculateFinalGrade(grade.subject) >= 3.0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${(calculateFinalGrade(grade.subject) / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Activities Section with Attachments */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Book className="text-green-600" />
            Actividades y Evaluaciones
          </h2>
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left">Fecha</th>
                  <th className="py-2 px-4 text-left">Actividad</th>
                  <th className="py-2 px-4 text-left">Materia</th>
                  <th className="py-2 px-4 text-left">Docente</th>
                  <th className="py-2 px-4 text-center">Tipo</th>
                  <th className="py-2 px-4 text-center">Calificación</th>
                  <th className="py-2 px-4 text-center">Adjuntos</th>
                </tr>
              </thead>
              <tbody>
                {activitiesByTrimester[activeTrimester].map((activity) => (
                  <tr key={activity.id} className="border-t">
                    <td className="py-2 px-4">{activity.date}</td>
                    <td className="py-2 px-4">{activity.name}</td>
                    <td className="py-2 px-4">{activity.subject}</td>
                    <td className="py-2 px-4">{activity.teacher}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block text-xs px-2 py-1 rounded ${
                        activity.type === 'tarea' ? 'bg-blue-100 text-blue-800' : 
                        activity.type === 'parcial' ? 'bg-purple-100 text-purple-800' : 
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {activity.type === 'tarea' ? 'Tarea' : 
                         activity.type === 'parcial' ? 'Parcial' : 'Examen'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">{activity.grade.toFixed(1)}</td>
                    <td className="py-2 px-4">
                      {activity.attachments && activity.attachments.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {activity.attachments.map((attachment, idx) => (
                            <a 
                              key={idx}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {getFileIcon(attachment.type)}
                              <span className="ml-1">{attachment.name}</span>
                              <ExternalLink size={12} className="ml-1" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Sin adjuntos</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Discipline Records Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="text-green-600" />
            Registros de Disciplina
          </h2>
          {disciplineRecords.length > 0 ? (
            <div className="space-y-4">
              {disciplineRecords.map((record) => (
                <div key={record.id} className={`bg-white p-4 rounded-lg border-l-4 ${
                  record.type === 'comment' ? 'border-blue-500' : 'border-red-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-500">{record.date}</span>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                          record.type === 'comment' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.type === 'comment' ? 'Comentario' : 'Citación'}
                        </span>
                      </div>
                      <p className="font-medium mb-1">{record.teacher} - {record.subject}</p>
                      <p className="text-gray-700">{record.description}</p>
                    </div>
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      record.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status === 'resolved' ? 'Resuelto' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500">No hay registros de disciplina para este estudiante.</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Próximos Eventos
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mr-2 mt-0.5">15 Mayo</span>
              <span>Entrega de calificaciones del primer trimestre</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mr-2 mt-0.5">20 Mayo</span>
              <span>Reunión de padres de familia</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mr-2 mt-0.5">1 Junio</span>
              <span>Inicio de exámenes del segundo trimestre</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}