import React from 'react';
import { Subject, AttendanceRecord, AttendanceStatus, DayOfWeek } from '../types';
import CheckIcon from './icons/CheckIcon';
import CrossIcon from './icons/CrossIcon';
import EditIcon from './icons/EditIcon';
import NotificationPermissionBanner from './NotificationPermissionBanner';

interface DashboardProps {
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  onMarkAttendance: (subjectId: string, status: AttendanceStatus) => void;
  onEditSubject: (subjectId: string) => void;
  notificationPermission: NotificationPermission;
  onGrantNotificationPermission: () => void;
}

const formatTime = (time: string) => {
  if (!time) return '';
  const [hour, minute] = time.split(':');
  const hourNum = parseInt(hour, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const formattedHour = hourNum % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

const AttendanceActions: React.FC<{
  subject: Subject;
  records: AttendanceRecord[];
  onMarkAttendance: (subjectId: string, status: AttendanceStatus) => void;
}> = ({ subject, records, onMarkAttendance }) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysRecord = records.find(r => r.subjectId === subject.id && r.date === todayStr);

  if (todaysRecord) {
    return (
      <div
        className={`text-center font-bold text-sm py-2 rounded-lg col-span-2 ${
          todaysRecord.status === AttendanceStatus.Present ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
        }`}
      >
        {todaysRecord.status}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => onMarkAttendance(subject.id, AttendanceStatus.Present)}
        className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded-lg flex items-center justify-center transition duration-200"
        aria-label={`Mark ${subject.name} as present`}
      >
        <CheckIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onMarkAttendance(subject.id, AttendanceStatus.Absent)}
        className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-lg flex items-center justify-center transition duration-200"
        aria-label={`Mark ${subject.name} as absent`}
      >
        <CrossIcon className="w-5 h-5" />
      </button>
    </>
  );
};

const SubjectCard: React.FC<{
  subject: Subject;
  records: AttendanceRecord[];
  onMarkAttendance: (subjectId: string, status: AttendanceStatus) => void;
  onEdit: (subjectId: string) => void;
}> = ({ subject, records, onMarkAttendance, onEdit }) => {
  const totalClasses = records.filter(r => r.subjectId === subject.id && r.status !== AttendanceStatus.Cancelled).length;
  const attendedClasses = records.filter(r => r.subjectId === subject.id && r.status === AttendanceStatus.Present).length;

  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const scheduleString = subject.schedule
    .map(s => `${s.day.substring(0,3)} ${formatTime(s.startTime)} - ${formatTime(s.endTime)}`)
    .join(' | ');

  const today = new Date();
  const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' }) as DayOfWeek;
  const isClassToday = subject.schedule.some(s => s.day === dayOfWeek);

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-md flex flex-col gap-3">
      <div className="grid grid-cols-3 items-start gap-4">
        <div className="col-span-2">
            <h3 className="text-lg font-bold text-sky-300">{subject.name}</h3>
            {isClassToday && <span className="mt-1 inline-block text-xs bg-cyan-800 text-cyan-200 px-2 py-0.5 rounded-full font-semibold">Today</span>}
        </div>
        <div className="col-span-1 flex flex-col items-end">
            <div className={`text-2xl font-bold ${getPercentageColor(attendancePercentage)}`}>
            {attendancePercentage}%
            </div>
            <div className="flex items-center gap-2 mt-1">
                <button onClick={() => onEdit(subject.id)} className="text-slate-400 hover:text-sky-400 transition-colors" aria-label={`Edit ${subject.name}`}>
                    <EditIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
      </div>
       <p className="text-xs text-slate-400 break-words w-full -mt-2">
          {scheduleString || 'No schedule set'}
       </p>
      <div className="grid grid-cols-3 gap-4 items-center mt-2">
         <p className="text-sm text-slate-300 col-span-1">
          {attendedClasses} / {totalClasses}
        </p>
        <div className="col-span-2 grid grid-cols-2 gap-2">
          <AttendanceActions subject={subject} records={records} onMarkAttendance={onMarkAttendance} />
        </div>
      </div>
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ subjects, attendanceRecords, onMarkAttendance, onEditSubject, notificationPermission, onGrantNotificationPermission }) => {
  const totalAttended = attendanceRecords.filter(r => r.status === AttendanceStatus.Present).length;
  const totalConducted = attendanceRecords.filter(r => r.status !== AttendanceStatus.Cancelled).length;
  const overallPercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 100;

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="p-4 space-y-4">
      {notificationPermission === 'default' && (
        <NotificationPermissionBanner onGrant={onGrantNotificationPermission} />
      )}

       <div className="bg-slate-800 rounded-lg p-4 shadow-md text-center">
        <p className="text-sm font-medium text-slate-400">Overall Attendance</p>
        <p className={`text-5xl font-bold mt-1 ${getPercentageColor(overallPercentage)}`}>
          {overallPercentage}%
        </p>
        <p className="text-sm text-slate-300 mt-2">
          {totalAttended} / {totalConducted} classes attended
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center text-slate-400 mt-12">
          <p className="text-lg">No subjects added yet.</p>
          <p className="mt-2">Tap on the "Add Subject" tab to get started!</p>
        </div>
      ) : (
        subjects.map(subject => (
          <SubjectCard key={subject.id} subject={subject} records={attendanceRecords} onMarkAttendance={onMarkAttendance} onEdit={onEditSubject} />
        ))
      )}
    </div>
  );
};

export default Dashboard;
