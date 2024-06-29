import ClassTimeTable from './ClassTimeTable';
import { useContext, useEffect, useMemo, useState } from 'react';
import { LockerData, TimetableByWeekday } from '../types';
import LoadingBox from './loading/LoadingBox';
import { lockerContext } from './LockerInfoContainer';
function ClassTimeTableContainer() {
  const [timeTable, setTimeTable] = useState<TimetableByWeekday>([]);
  const [cache, setCache] = useState<Map<String, TimetableByWeekday>>(new Map());
  const lockerCtx = useContext(lockerContext);
  const uuid = useMemo(() => {
    return (lockerCtx.lockerInfo as LockerData).uuid as string;
  }, [lockerCtx]);
  const refresh = useMemo(() => {
    return () => {
      const cached = cache.get(uuid);
      if (cached !== undefined) {
        setTimeTable(cached);
        return;
      }
      getTimeTable()
        .then((tt) => {
          setTimeTable(tt);
          setCache(cache.set(uuid, tt));
        })
        .catch((err) => {
          console.error(err);
        });
      async function getTimeTable() {
        const response = await fetch(`https://sapi.thezoot3.com/api/timetable/${uuid}`);
        if (response.status === 200) {
          return (await response.json()) as TimetableByWeekday;
        } else {
          throw new Error('Failed to fetch timetable');
        }
      }
    };
  }, [cache, uuid]);
  useEffect(() => {
    if (uuid) {
      refresh();
    }
  }, [cache, refresh, uuid]);
  return (
    <LoadingBox isReady={timeTable.length > 0}>
      <ClassTimeTable timeTable={timeTable} />
    </LoadingBox>
  );
}
export default ClassTimeTableContainer;
