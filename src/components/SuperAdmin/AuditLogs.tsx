import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, Filter, Calendar, User, Clock } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { AuditLog, School } from '../../types/school';

export function AuditLogs() {
  const { documents: logs, loading } = useFirestore<AuditLog>('auditLogs');
  const { documents: schools } = useFirestore<School>('schools');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const getSchoolName = (schoolId: string): string => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Sistema Central';
  };
  
  const getActionLabel = (action: string): string => {
    switch (action) {
      case 'create': return 'Creación';
      case 'update': return 'Actualización';
      case 'delete': return 'Eliminación';
      case 'login': return 'Inicio de Sesión';
      case 'logout': return 'Cierre de Sesión';
      case 'password_change': return 'Cambio de Contraseña';
      case 'enable_2fa': return 'Activación 2FA';
      default: return action;
    }
  };
  
  const getActionColor = (action: string): string => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'login': return 'bg-purple-100 text-purple-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'password_change': return 'bg-yellow-100 text-yellow-800';
      case 'enable_2fa': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = selectedSchool === 'all' || log.schoolId === selectedSchool;
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    
    const logDate = new Date(log.timestamp);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Set to end of day
    
    const matchesDate = logDate >= startDate && logDate <= endDate;
    
    return matchesSearch && matchesSchool && matchesAction && matchesDate;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Fecha', 'Usuario', 'Rol', 'Institución', 'Acción', 'Recurso', 'Detalles', 'IP'];
    
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        formatDate(log.timestamp),
        log.userName,
        log.userRole,
        getSchoolName(log.schoolId),
        getActionLabel(log.action),
        log.resource,
        `"${log.details.replace(/"/g, '""')}"`, // Escape quotes in CSV
        log.ipAddress || ''
      ].join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${dateRange.start}_to_${dateRange.end}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-indigo-700 text-white">
        <h1 className="text-2xl font-bold">Registros de Auditoría</h1>
        <p className="text-indigo-200">Historial de actividades y cambios en el sistema</p>
      </div>
      
      <div className="p-6">
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por usuario, recurso o detalles..."
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todas las instituciones</option>
              <option value="system">Sistema Central</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Todas las acciones</option>
              <option value="create">Creación</option>
              <option value="update">Actualización</option>
              <option value="delete">Eliminación</option>
              <option value="login">Inicio de Sesión</option>
              <option value="logout">Cierre de Sesión</option>
              <option value="password_change">Cambio de Contraseña</option>
              <option value="enable_2fa">Activación 2FA</option>
            </select>
          </div>
          
          <div className="flex gap-2 lg:col-span-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={exportToCSV}
              className="w-full bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Exportar CSV
            </button>
          </div>
        </div>
        
        {/* Logs Table */}
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="border p-2 text-left">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Fecha y Hora</span>
                    </div>
                  </th>
                  <th className="border p-2 text-left">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>Usuario</span>
                    </div>
                  </th>
                  <th className="border p-2 text-left">Institución</th>
                  <th className="border p-2 text-center">Acción</th>
                  <th className="border p-2 text-left">Recurso</th>
                  <th className="border p-2 text-left">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={log.id || index} className="hover:bg-gray-50">
                    <td className="border p-2 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={14} />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </td>
                    <td className="border p-2">
                      <div>
                        <span className="font-medium">{log.userName}</span>
                        <div className="text-xs text-gray-500">{log.userRole}</div>
                      </div>
                    </td>
                    <td className="border p-2">{getSchoolName(log.schoolId)}</td>
                    <td className="border p-2 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="border p-2">{log.resource}</td>
                    <td className="border p-2">
                      <div className="max-w-md truncate" title={log.details}>
                        {log.details}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron registros de auditoría</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {filteredLogs.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Mostrando {filteredLogs.length} de {logs.length} registros
            </div>
            
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}