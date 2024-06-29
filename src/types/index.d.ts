import React from 'react';

interface ClassTimeData {
  isMobile: boolean;
  teacher: string;
  subject: string;
}
interface LoadingProps {
  isReady: boolean;
  children: React.ReactNode;
  message?: string;
}
interface LockerData {
  uuid?: string;
  nickname?: string | null;
  isLocked?: boolean;
  grade?: number;
  classNumber?: number;
  lastSync?: number;
  onSchedule?: boolean;
}
type TimetableByWeekday = Array<Array<ClassTimeData>>;
