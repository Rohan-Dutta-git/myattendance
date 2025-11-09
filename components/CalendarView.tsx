import React, { useState } from 'react';
import { Subject, AttendanceRecord, AttendanceStatus } from '../types';

const DailyDetailModal: React.FC<{
  date: string;
  records: AttendanceRecord[];
  subjects: Subject[];
  onClose: () => void;
}> = ({ date, records, subjects, onClose }) => {
  
  const recordsForDate = records.filter(r => r.date === date);

  const getStatusPill = (status: AttendanceStatus) => {
    switch(status) {
      case AttendanceStatus.Present:
        return <span className="text-xs font-semibold px-2 py-1 bg-green-600 text-white rounded-full">Present</span>;
      case AttendanceStatus.Absent:
        return <span className="text-xs font-semibold px-2 py-1 bg-red-600 text-white rounded-full">Absent</span>;
      case AttendanceStatus.Cancelled:
        return <span className="text-xs font-semibold px-2 py-1 bg-yellow-600 text-white rounded-full">Cancelled</span>;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-sky-600 dark:text-sky-300">
            Attendance for {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h3>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">&times;</button>
        </div>
        
        {recordsForDate.length > 0 ? (
          <ul className="space-y-3">
            {recordsForDate.map(record => {
              const subject = subjects.find(s => s.id === record.subjectId);
              if (!subject) return null;
              return (
                <li key={record.id} className="flex justify-between items-center bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{subject.name}</span>
                  {getStatusPill(record.status)}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">No attendance recorded for this day.</p>
        )}
      </div>
    </div>
  );
};


const CalendarView: React.FC<{ subjects: Subject[], attendanceRecords: AttendanceRecord[] }> = ({ subjects, attendanceRecords }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getMonthName = (monthIndex: number) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthIndex];
  };

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const renderCalendar = () => {
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const recordsForDay = attendanceRecords.filter(r => r.date === dateStr);
      
      let dayClass = "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer text-slate-700 dark:text-slate-200";
      if (recordsForDay.length > 0) {
        const wasPresent = recordsForDay.some(r => r.status === AttendanceStatus.Present);
        const wasAbsent = recordsForDay.some(r => r.status === AttendanceStatus.Absent);

        if (wasPresent && !wasAbsent) dayClass = "bg-green-500 hover:bg-green-600 cursor-pointer text-white";
        else if (wasAbsent && !wasPresent) dayClass = "bg-red-500 hover:bg-red-600 cursor-pointer text-white";
        else if (wasPresent && wasAbsent) dayClass = "bg-gradient-to-br from-green-500 to-red-500 hover:opacity-80 cursor-pointer text-white";
        else dayClass = "bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white";
      }

      calendarDays.push(
        <button key={day} onClick={() => setSelectedDate(dateStr)} className={`flex items-center justify-center h-10 rounded-full text-sm transition-all duration-200 ${dayClass}`}>
          {day}
        </button>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-center mb-4 text-slate-800 dark:text-white">{getMonthName(currentMonth)} {currentYear}</h2>
      
      <div className="flex justify-center items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span>Present</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span>Absent</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-red-500"></span>Mixed</div>
      </div>

      {subjects.length > 0 ? renderCalendar() : <p className="text-center text-slate-500 dark:text-slate-400 mt-10">Add a subject to start tracking attendance.</p>}
      
      {selectedDate && (
        <DailyDetailModal
          date={selectedDate}
          records={attendanceRecords}
          subjects={subjects}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;