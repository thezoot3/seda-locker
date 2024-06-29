import ctable from '@styles/classTimeTable.module.scss';
import { useMemo } from 'react';
import { TimetableByWeekday } from '../types';

interface ClassTimeTableProps {
  timeTable: TimetableByWeekday;
}
function ClassTimeTable({ timeTable }: ClassTimeTableProps) {
  const tranposedTT = useMemo(() => {
    return timeTable[0].map((_, i) => timeTable.map((row) => row[i]));
  }, [timeTable]);
  const weekDay = ['월', '화', '수', '목', '금'];
  return (
    <table className={ctable.classTimeTable}>
      <thead>
        <tr className={ctable.table_header}>
          <td />
          {weekDay.map((wd, index) => {
            return (
              <td key={index}>
                <div className={ctable.table_content_container}>
                  <span className={ctable.table_header_content}>{wd}</span>
                </div>
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {tranposedTT.map((classData, i1) => {
          return (
            <tr className={ctable.table_body} key={i1}>
              <td>
                <div className={ctable.table_content_container}>
                  <span className={ctable.table_body_content}>{i1 + 1}교시</span>
                </div>
              </td>
              {classData.map((wd, i2) => {
                return (
                  <td className={wd.isMobile ? ctable.table_body_variant : ''} key={i1 + '-' + i2}>
                    <div className={ctable.table_content_container}>
                      <span className={ctable.table_body_content}>{wd.subject}</span>
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export default ClassTimeTable;
