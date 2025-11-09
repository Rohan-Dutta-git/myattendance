import React, { useState, useEffect } from 'react';
import { View, Subject, AttendanceRecord, AttendanceStatus, DayOfWeek } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import AddSubject from './components/AddSubject';
import CalendarView from './components/CalendarView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendanceRecords', []);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof Notification !== 'undefined' ? Notification.permission : 'denied';
  });

  // Effect for Service Worker registration and message listening
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

      const handleServiceWorkerMessage = (event: MessageEvent) => {
        const { subjectId, status } = event.data;
        if (subjectId && status) {
          handleMarkAttendance(subjectId, status as AttendanceStatus);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      return () => {
        window.removeEventListener('load', registerSW);
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, []); // Run only once

  // Effect for scheduling notifications
  useEffect(() => {
    if (notificationPermission !== 'granted' || subjects.length === 0) {
      return;
    }

    const checkSchedules = () => {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      subjects.forEach(subject => {
        subject.schedule.forEach(slot => {
          if (slot.day === dayOfWeek && slot.endTime === currentTime) {
            const isAlreadyMarked = attendanceRecords.some(
              r => r.subjectId === subject.id && r.date === todayStr
            );

            if (!isAlreadyMarked) {
              showNotification(subject);
            }
          }
        });
      });
    };
    
    const intervalId = setInterval(checkSchedules, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [subjects, attendanceRecords, notificationPermission]);

  const showNotification = async (subject: Subject) => {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      // FIX: The 'actions' property on NotificationOptions is not recognized by the default
      // TypeScript lib definition, causing a type error. Casting to 'any' bypasses this
      // check. The property is supported by browsers for service worker notifications.
      registration.showNotification('Attendance Check', {
        body: `Did you attend today's ${subject.name} class?`,
        icon: '/vite.svg',
        actions: [
            { action: 'present', title: '✔️ Attended' },
            { action: 'absent', title: '✖️ Missed' }
        ],
        data: { subjectId: subject.id },
        tag: `attendance-${subject.id}-${new Date().toISOString().slice(0, 10)}`,
        renotify: false,
      } as any);
    } catch (e) {
      console.error('Error showing notification:', e);
    }
  };

  const handleGrantNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

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
          notificationPermission={notificationPermission}
          onGrantNotificationPermission={handleGrantNotificationPermission}
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
          notificationPermission={notificationPermission}
          onGrantNotificationPermission={handleGrantNotificationPermission}
        />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-white font-sans flex flex-col overflow-hidden">
      <header className="bg-slate-800 p-4 shadow-md z-10">
        <h1 className="text-xl font-bold text-center text-sky-400">{getHeaderTitle(activeView)}</h1>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>

      <BottomNav activeView={activeView} setActiveView={handleViewChange} />
    </div>
  );
};

export default App;