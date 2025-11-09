import React, { useState, useEffect } from 'react';
import { View, Subject, AttendanceRecord, AttendanceStatus } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import AddSubject from './components/AddSubject';
import CalendarView from './components/CalendarView';
import ThemeSwitcher from './components/ThemeSwitcher';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');

  // Effect to apply the theme class to the <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Effect for Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = () => {
        const swUrl = `${window.location.origin}/sw.js`;
        navigator.serviceWorker.register(swUrl).catch(err => {
          console.error('Service Worker registration failed:', err);
        });
      };
      
      // Defer registration until the page is fully loaded.
      window.addEventListener('load', registerSW);
      
      return () => {
        window.removeEventListener('load', registerSW);
      };
    }
  }, []); // Run only once

  const getHeaderTitle = (view: View): string => {
    switch (view) {
      case View.Dashboard:
        return 'Attendance Dashboard';
      case View.AddSubject:
        return 'Add a New Subject';
      case View.EditSubject:
        return 'Edit Subject';
      case View.Calendar:
        return 'Attendance Calendar';
      default:
        return 'Attendance Tracker';
    }
  };

  const handleViewChange = (view: View) => {
    if (view !== View.EditSubject) {
      setSubjectToEdit(null);
    }
    setActiveView(view);
  };
  
  const handleMarkAttendance = (subjectId: string, status: AttendanceStatus) => {
    const today = new Date().toISOString().slice(0, 10);

    setAttendanceRecords(prev => {
      const existingRecordIndex = prev.findIndex(
        record => record.subjectId === subjectId && record.date === today
      );

      if (existingRecordIndex > -1) {
        // Update existing record for the day
        const updatedRecords = [...prev];
        updatedRecords[existingRecordIndex] = {
          ...updatedRecords[existingRecordIndex],
          status,
        };
        return updatedRecords;
      } else {
        // Create a new record
        const newRecord: AttendanceRecord = {
          id: crypto.randomUUID(),
          subjectId,
          date: today,
          status,
        };
        return [...prev, newRecord];
      }
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    setAttendanceRecords(prev => prev.filter(r => r.subjectId !== subjectId));
  };

  const handleStartEdit = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      setSubjectToEdit(subject);
      setActiveView(View.EditSubject);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard 
          subjects={subjects} 
          attendanceRecords={attendanceRecords} 
          onMarkAttendance={handleMarkAttendance} 
          onEditSubject={handleStartEdit} 
        />;
      case View.AddSubject:
      case View.EditSubject:
        return <AddSubject subjects={subjects} setSubjects={setSubjects} setActiveView={handleViewChange} subjectToEdit={subjectToEdit} onDeleteSubject={handleDeleteSubject} />;
      case View.Calendar:
        return <CalendarView subjects={subjects} attendanceRecords={attendanceRecords} />;
      default:
        return <Dashboard 
          subjects={subjects} 
          attendanceRecords={attendanceRecords} 
          onMarkAttendance={handleMarkAttendance} 
          onEditSubject={handleStartEdit}
        />;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-white font-sans flex flex-col overflow-hidden">
      <header className="relative bg-white dark:bg-slate-800 p-4 shadow-md dark:shadow-slate-700/20 z-10 flex items-center justify-center">
        <h1 className="text-xl font-bold text-center text-sky-500 dark:text-sky-400">{getHeaderTitle(activeView)}</h1>
        <div className="absolute top-0 right-0 h-full flex items-center pr-4">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      <BottomNav activeView={activeView} setActiveView={handleViewChange} />
    </div>
  );
};

export default App;