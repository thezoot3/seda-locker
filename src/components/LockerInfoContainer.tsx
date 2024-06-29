import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { LockerData } from '../types';
import LoadingBox from './loading/LoadingBox';

interface LockerInfoContainerProps {
  uuid?: string | null;
  children: React.ReactNode;
  fetchAllInfo?: boolean;
}
export interface LockerContext {
  lockerInfo?: LockerData | LockerData[];
  fetchAllInfo?: boolean;
  refreshLockerInfo?: () => void;
}
export const lockerContext = React.createContext<LockerContext>({});
function LockerInfoContainer({ uuid, fetchAllInfo, children }: LockerInfoContainerProps) {
  const [lockerInfo, setLockerInfo] = useState<LockerData | LockerData[]>();
  // Function to fetch locker info
  const fetchLockerInfo = useMemo(() => {
    return () => {
      const fetchData = async () => {
        try {
          if (fetchAllInfo) {
            const url = 'https://sapi.thezoot3.com/api/lockerState';
            const res = await fetch(url);
            if (res.status === 200) {
              return await res.json();
            } else {
              console.error('Failed to fetch locker info');
              return undefined;
            }
          } else if (uuid) {
            const url = `https://sapi.thezoot3.com/api/lockerState/${uuid}`;
            const res = await fetch(url);
            if (res.status === 200) {
              return await res.json();
            } else {
              console.error('Failed to fetch locker info');
              return undefined;
            }
          }
          return undefined;
        } catch (error) {
          console.error(error);
        }
      };
      fetchData()
        .then((data) => {
          setLockerInfo(data);
        })
        .catch((e) => {
          console.error(e);
        });
    };
  }, [fetchAllInfo, uuid]);

  // Fetch locker info on component mount or when fetchAllInfo changes
  useEffect(() => {
    fetchLockerInfo();
  }, [fetchLockerInfo]);

  const prValue = useMemo(() => {
    return {
      lockerInfo: lockerInfo,
      refreshLockerInfo: () => {
        fetchLockerInfo();
      },
      fetchAllInfo: fetchAllInfo || false,
    };
  }, [fetchAllInfo, fetchLockerInfo, lockerInfo]);

  return (
    //@ts-ignore
    <LoadingBox isReady={lockerInfo !== undefined} message={uuid ? undefined : '자물쇠를 선택해주십시오'}>
      <lockerContext.Provider value={prValue}>
        <Fragment>{children}</Fragment>
      </lockerContext.Provider>
    </LoadingBox>
  );
}

export default LockerInfoContainer;
