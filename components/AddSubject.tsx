import React, { useState, useEffect } from 'react';
import { Subject, View, DayOfWeek, ClassSchedule } from '../types';

interface AddSubjectProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  setActiveView: (view: View) => void;
  subjectToEdit?: Subject | null;
  onDeleteSubject: (subjectId: string) => void;
}

const daysOfWeek: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

const AddSubject: React.FC<AddSubjectProps> = ({ subjects, setSubjects, setActiveView, subjectToEdit, onDeleteSubject }) => {
  const isEditMode = !!subjectToEdit;
  
  const [subjectName, setSubjectName] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [times, setTimes] = useState<Record<string, { startTime: string; endTime: string }>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && subjectToEdit) {
      setSubjectName(subjectToEdit.name);
      
      const days = subjectToEdit.schedule.map(s => s.day);
      setSelectedDays(days);

      const scheduleTimes = subjectToEdit.schedule.reduce((acc, s) => {
        acc[s.day] = { startTime: s.startTime, endTime: s.endTime };
        return acc;
      }, {} as Record<string, { startTime: string; endTime: string }>);
      setTimes(scheduleTimes);
    }
  }, [isEditMode, subjectToEdit]);


  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays(prev => {
      const isSelected = prev.includes(day);
      if (isSelected) {
        // Remove day and its time
        const newTimes = { ...times };
        delete newTimes[day];
        setTimes(newTimes);
        return prev.filter(d => d !== day);
      } else {
        // Add day and initialize its time
        setTimes(prevTimes => ({
          ...prevTimes,
          [day]: { startTime: '', endTime: '' },
        }));
        return [...prev, day];
      }
    });
  };

  const handleTimeChange = (day: DayOfWeek, type: 'startTime' | 'endTime', value: string) => {
    setTimes(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (subjectName.trim() === '') {
      setError('Subject name cannot be empty.');
      return;
    }
    if (selectedDays.length === 0) {
      setError('Please select at least one day for the class.');
      return;
    }

    const schedule: ClassSchedule[] = [];
    for (const day of selectedDays) {
      const dayTime = times[day];
      if (!dayTime.startTime || !dayTime.endTime) {
        setError(`Please set the start and end time for ${day}.`);
        return;
      }
      if (dayTime.startTime >= dayTime.endTime) {
        setError(`End time must be after start time for ${day}.`);
        return;
      }
      schedule.push({
        day,
        startTime: dayTime.startTime,
        endTime: dayTime.endTime,
      });
    }

    if (isEditMode && subjectToEdit) {
      const updatedSubject: Subject = {
        ...subjectToEdit,
        name: subjectName.trim(),
        schedule,
      };
      setSubjects(prev => prev.map(s => s.id === subjectToEdit.id ? updatedSubject : s).sort((a,b) => a.name.localeCompare(b.name)));
    } else {
      const newSubject: Subject = {
        id: crypto.randomUUID(),
        name: subjectName.trim(),
        createdAt: Date.now(),
        schedule,
      };
      setSubjects(prev => [...prev, newSubject].sort((a,b) => a.name.localeCompare(b.name)));
    }
    
    setActiveView(View.Dashboard);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="subjectName" className="block text-sm font-medium text-slate-300 mb-2">
            1. Subject Name
          </label>
          <input
            type="text"
            id="subjectName"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="e.g., Data Structures"
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-required="true"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            2. Select Class Days
          </label>
          <div className="grid grid-cols-4 gap-2">
            {daysOfWeek.map(day => (
              <button
                type="button"
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`p-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                  selectedDays.includes(day)
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
        
        {selectedDays.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              3. Set Class Times
            </label>
            <div className="space-y-3">
              {selectedDays.map(day => (
                <div key={day} className="grid grid-cols-3 items-center gap-3 bg-slate-800 p-3 rounded-lg">
                  <span className="font-semibold text-slate-200">{day}</span>
                  <input
                    type="time"
                    aria-label={`Start time for ${day}`}
                    value={times[day]?.startTime || ''}
                    onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <input
                    type="time"
                    aria-label={`End time for ${day}`}
                    value={times[day]?.endTime || ''}
                    onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-2 text-center bg-red-900/50 p-2 rounded-md">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!subjectName || selectedDays.length === 0}
        >
          {isEditMode ? 'Update Subject' : 'Add Subject'}
        </button>
      </form>

      {subjects && subjects.length > 0 && (
        <div className="mt-12">
            <h2 className="text-lg font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">
                Manage Subjects
            </h2>
            <div className="space-y-3">
                {subjects.map(subject => (
                    <div key={subject.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-slate-200">{subject.name}</span>
                        <button
                            onClick={() => onDeleteSubject(subject.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-3 rounded-md transition-colors"
                            aria-label={`Delete ${subject.name}`}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}

    </div>
  );
};

export default AddSubject;