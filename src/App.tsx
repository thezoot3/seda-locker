import React, { useMemo, useState } from 'react';
import app from './App.module.scss';
import Header from './components/navigation/Header';
import Footer from './components/navigation/Footer';
import './index.scss';
import ClassTimeTableContainer from './components/ClassTimeTableContainer';
import LocalClock from './components/LocalClock';
import LockerInfoContainer from './components/LockerInfoContainer';
import { lockerContext } from './components/LockerInfoContainer';
import { LockerData } from './types';
import LockerList from './components/LockerList';

function App() {
  const [selectedLocker, setSelectedLocker] = useState<string>('');
  return (
    <div className={app.app}>
      <Header />
      <div className={app.app_body}>
        <LockerInfoContainer uuid={selectedLocker} fetchAllInfo={false}>
          <div className={app.app_body_col_container}>
            <LockerTitle />
            <div className={app.app_body_row_container}>
              <div>
                <span className={app.text_lockState_icon}>lock</span>
                <div className={app.box_lockerState_text}>
                  <span className={app.text_lockerState_states}>문이 잠겨 있습니다</span>
                  <span className={app.text_lockerState_content}>이동 수업 시간이 끝나면 다시 열립니다.</span>
                </div>
              </div>
            </div>
            <OrderButton />
            <div className={app.app_body_row_container}>
              <div className={app.box_classTimeTable}>
                <ClassTimeTableContainer />
              </div>
            </div>
          </div>
        </LockerInfoContainer>
        <LockerInfoContainer fetchAllInfo={true}>
          <div className={app.app_body_col_container}>
            <LockerListTitle />
            <div className={app.box_lockerList}>
              <LockerList setUuid={setSelectedLocker} />
            </div>
          </div>
        </LockerInfoContainer>
      </div>
      <Footer />
    </div>
  );
}
function LockerTitle() {
  const lockerCtx = React.useContext(lockerContext);
  const lockerInfo = useMemo(() => {
    return lockerCtx.lockerInfo as LockerData;
  }, [lockerCtx]);
  const editNickname = useMemo(() => {
    return () => {
      let newNickname = prompt('변경할 이름을 입력해주세요', lockerInfo?.nickname as string);
      if (newNickname !== lockerInfo?.nickname) {
        fetch(`https://sapi.thezoot3.com/api/lockerState/${lockerInfo?.uuid}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickname: newNickname,
          }),
        })
          .then((res) => {
            if (res.status === 200) {
              lockerCtx.refreshLockerInfo?.();
            } else {
              throw new Error('Failed to fetch locker info');
            }
          })
          .catch((e) => {
            console.error(e);
          });
        alert('이름이 변경되었습니다.');
        lockerCtx.refreshLockerInfo?.();
        return;
      } else {
        alert('동일한 이름으로 변경할 수 없습니다.');
        return;
      }
    };
  }, [lockerCtx, lockerInfo]);
  return (
    <div className={app.app_body_row_container}>
      <div>
        <div className={app.box_locker_title}>
          <span className={app.text_locker_title}>{lockerInfo?.nickname}</span>
          <span className={'material-icons'} onClick={editNickname}>
            edit
          </span>
        </div>
        <LocalClock style={app.text_local_clock} />
        <span className={'material-icons'} onClick={lockerCtx.refreshLockerInfo}>
          refresh
        </span>
      </div>
      <hr className={app.horizon_line} />
    </div>
  );
}
function LockerListTitle() {
  const lockerCtx = React.useContext(lockerContext);
  return (
    <div className={app.box_lockerList_title}>
      <span className={app.text_lockerList_title}>Locker List</span>
      <span className={app.text_lockerList_title_icon} onClick={lockerCtx.refreshLockerInfo}>
        refresh
      </span>
    </div>
  );
}
function OrderButton() {
  const lockerInfo = React.useContext(lockerContext).lockerInfo as LockerData;
  const lockerCtx = React.useContext(lockerContext);
  const toggleOpen = useMemo(() => {
    return () => {
      fetch(`https://sapi.thezoot3.com/api/orderLocker/${lockerInfo?.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: lockerInfo?.isLocked ? 'open' : 'close',
        }),
      }).then(() => {
        setTimeout(() => {
          lockerCtx.refreshLockerInfo?.();
        }, 5000);
      });
    };
  }, [lockerCtx, lockerInfo?.isLocked, lockerInfo?.uuid]);
  return (
    <div className={app.app_body_row_container}>
      <div>
        <div className={app.box_lockerOrder_btn}>
          <div className={app.btn_lockerOrder}>
            <div className={app.box_lockerOrder_btn_content} onClick={toggleOpen}>
              <span className={app.text_lockerOrder_btn_icon}>{lockerInfo?.isLocked ? 'lock_open' : 'lock'}</span>
              <span className={app.text_lockerOrder_btn_content}>{lockerInfo?.isLocked ? '잠금 해제' : '잠그기'}</span>
            </div>
          </div>
          <div className={app.btn_lockerOrder}>
            <div className={app.box_lockerOrder_btn_content}>
              <span className={app.text_lockerOrder_btn_icon}>
                {lockerInfo?.onSchedule ? 'event_busy' : 'event_available'}
              </span>
              <span className={app.text_lockerOrder_btn_content}>
                {lockerInfo?.onSchedule ? '잠금 예약 해제' : '잠금 예약'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
