import React, { useState, useEffect } from 'react';
import { Shield, Save, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { SuperAdminSettings, PasswordPolicy } from '../../types/school';

export function SecuritySettings() {
  const { documents: settings, loading, addDoc, updateDoc } = useFirestore<SuperAdminSettings>('superAdminSettings');
  
  const [formData, setFormData] = useState<PasswordPolicy>({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
    preventReuse: 5
  });
  
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Load settings from Firestore
  useEffect(() => {
    if (settings.length > 0) {
      const currentSettings = settings[0];
      setFormData(currentSettings.passwordPolicy);
      setMaxLoginAttempts(currentSettings.maxLoginAttempts);
      setSessionTimeout(currentSettings.sessionTimeoutMinutes);
    }
  }, [settings]);
  
  const handlePasswordPolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value)
    }));
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const timestamp = new Date();
      
      if (settings.length > 0) {
        // Update existing settings
        await updateDoc(settings[0].id, {
          passwordPolicy: formData,
          maxLoginAttempts,
          sessionTimeoutMinutes: sessionTimeout,
          updatedAt: timestamp
        });
      } else {
        // Create new settings
        await addDoc({
          id: 'global',
          passwordPolicy: formData,
          maxLoginAttempts,
          sessionTimeoutMinutes: sessionTimeout,
          updatedAt: timestamp
        }, 'global');
      }
      
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración. Por favor intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const calculatePasswordStrength = (): { score: number; label: string; color: string } => {
    let score = 0;
    
    // Add points for each enabled policy
    if (formData.minLength >= 8) score += 1;
    if (formData.minLength >= 12) score += 1;
    if (formData.requireUppercase) score += 1;
    if (formData.requireLowercase) score += 1;
    if (formData.requireNumbers) score += 1;
    if (formData.requireSpecialChars) score += 1;
    
    // Determine strength label and color
    if (score <= 2) {
      return { score, label: 'Débil', color: 'bg-red-500' };
    } else if (score <= 4) {
      return { score, label: 'Moderada', color: 'bg-yellow-500' };
    } else {
      return { score, label: 'Fuerte', color: 'bg-green-500' };
    }
  };
  
  const passwordStrength = calculatePasswordStrength();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-4 bg-indigo-700 text-white">
        <h1 className="text-2xl font-bold">Configuración de Seguridad</h1>
        <p className="text-indigo-200">Políticas de seguridad y acceso al sistema</p>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="text-indigo-600" />
                Política de Contraseñas
              </h2>
              
              <div className="bg-indigo-50 p-4 rounded-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud Mínima
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        name="minLength"
                        min="6"
                        max="16"
                        value={formData.minLength}
                        onChange={handlePasswordPolicyChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 w-8 text-center">{formData.minLength}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fortaleza de Contraseña
                    </label>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Nivel: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="requireUppercase"
                          checked={formData.requireUppercase}
                          onChange={handlePasswordPolicyChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Requerir mayúsculas (A-Z)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="requireLowercase"
                          checked={formData.requireLowercase}
                          onChange={handlePasswordPolicyChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Requerir minúsculas (a-z)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="requireNumbers"
                          checked={formData.requireNumbers}
                          onChange={handlePasswordPolicyChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Requerir números (0-9)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="requireSpecialChars"
                          checked={formData.requireSpecialChars}
                          onChange={handlePasswordPolicyChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Requerir caracteres especiales (!@#$%^&*)
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiración de Contraseña (días)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        name="expiryDays"
                        min="30"
                        max="180"
                        step="30"
                        value={formData.expiryDays}
                        onChange={handlePasswordPolicyChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 w-12 text-center">{formData.expiryDays}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prevenir Reutilización (últimas contraseñas)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        name="preventReuse"
                        min="1"
                        max="10"
                        value={formData.preventReuse}
                        onChange={handlePasswordPolicyChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 w-8 text-center">{formData.preventReuse}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="text-indigo-600" />
                Configuración de Acceso
              </h2>
              
              <div className="bg-indigo-50 p-4 rounded-xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intentos Máximos de Inicio de Sesión
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="3"
                        max="10"
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 w-8 text-center">{maxLoginAttempts}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      La cuenta se bloqueará después de {maxLoginAttempts} intentos fallidos.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiempo de Inactividad de Sesión (minutos)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-2 w-8 text-center">{sessionTimeout}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      La sesión se cerrará automáticamente después de {sessionTimeout} minutos de inactividad.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Autenticación de Dos Factores (2FA)</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      La autenticación de dos factores está habilitada por defecto para todos los administradores del sistema.
                      Se recomienda mantener esta configuración para garantizar la máxima seguridad.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className={`px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 flex items-center gap-2 ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Guardar Configuración
                    </>
                  )}
                </button>
              </div>
              
              {saveSuccess && (
                <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 flex items-start">
                  <CheckCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                  <p>Configuración guardada exitosamente.</p>
                </div>
              )}
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-xl">
              <h3 className="font-medium text-indigo-800 mb-2">Registro de Auditoría</h3>
              <p className="text-sm text-indigo-700 mb-4">
                El sistema mantiene un registro detallado de todas las acciones realizadas por los usuarios.
                Esto incluye inicios de sesión, cambios en la configuración, y modificaciones a los datos.
              </p>
              
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                >
                  Ver Registros de Auditoría
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}