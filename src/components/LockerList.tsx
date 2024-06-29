import app from '../App.module.scss';
import { lockerContext } from './LockerInfoContainer';
import React, { Fragment, useMemo, useRef } from 'react';
import { LockerData } from '../types';

function LockerList({ setUuid }: { setUuid: (uuid: string) => void }) {
  const lockerCtx = React.useContext(lockerContext);
  const lockerList = useMemo(() => {
    return lockerCtx.lockerInfo as Array<LockerData>;
  }, [lockerCtx.lockerInfo]);
  const editRef = useRef<HTMLDivElement>(null);
  const selectlocker = () => {
    const index = Number(editRef.current?.dataset.index);
    const lockerInfo = lockerList[index];
    if (lockerInfo?.uuid) {
      const child = editRef.current?.parentElement?.children;
      // @ts-ignore
      for (let i = 0; child.length > i; i++) {
        // @ts-ignore
        child[i].setAttribute('data-selected', 'false');
      }
      editRef.current?.setAttribute('data-selected', 'true');

      setUuid(lockerInfo.uuid);
    } else {
      alert('내부 문제가 발생했습니다.');
    }
  };
  const editGradeClass = () => {
    const index = Number(editRef.current?.dataset.index);
    const lockerInfo = lockerList[index];
    async function patchNewInfo(infoName: 'grade' | 'classNumber', infoKRName: string, lockerInfo: LockerData) {
      let newData = Number(prompt(`변경할 ${infoKRName}을 입력해주세요`, String(lockerInfo?.[infoName])));
      if (newData !== lockerInfo?.[infoName]) {
        fetch(`https://sapi.thezoot3.com/api/lockerState/${lockerInfo?.uuid}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [infoName]: newData,
          }),
        })
          .then((res) => {
            if (res.status !== 200) {
              throw new Error('Failed to fetch locker info');
            }
          })
          .catch((e) => {
            console.error(e);
            alert('내부 문제가 발생하였습니다.');
            return;
          });
        alert(`${infoKRName}이 변경되었습니다.`);
      }
    }
    patchNewInfo('grade', '학년', lockerInfo).then(() => {
      patchNewInfo('classNumber', '반', lockerInfo).then(() => {
        lockerCtx.refreshLockerInfo?.();
      });
    });
  };
  return (
    <Fragment>
      {lockerList.map((locker, index) => {
        return (
          <div
            className={app.box_lockerList_item}
            key={index}
            ref={editRef}
            data-index={index}
            data-selected={false}
            onClick={selectlocker}
          >
            <div className={app.box_lockerList_item_text}>
              <span className={app.text_lockerList_item_title_icon}>{locker.isLocked ? 'lock' : 'lock_open'}</span>
              <span className={app.text_lockerList_item_title}>{locker.nickname}</span>
              <span className={app.text_lockerList_item_icon} onClick={editGradeClass}>
                edit
              </span>
            </div>
            <span className={app.text_lockerList_item_class}>
              {locker.grade}-{locker.classNumber}
            </span>
          </div>
        );
      })}
    </Fragment>
  );
}
export default LockerList;
