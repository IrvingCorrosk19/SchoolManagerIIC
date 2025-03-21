import React, { useState } from 'react';
import { GradingModule } from './GradingModule';
import { TeacherLogin } from './TeacherLogin';

export function TeacherPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState<number | null>(null);

  const handleLogin = (teacherId: number) => {
    setIsLoggedIn(true);
    setCurrentTeacherId(teacherId);
  };

  if (!isLoggedIn) {
    return <TeacherLogin onLogin={handleLogin} />;
  }

  return <GradingModule teacherId={currentTeacherId!} />;
}