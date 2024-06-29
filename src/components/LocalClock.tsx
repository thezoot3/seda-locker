import React from 'react';

function LocalClock({ style }: { style?: string }) {
  const [time, setTime] = React.useState(new Date());
  setInterval(() => {
    setTime(new Date());
  }, 1000);
  return <span className={style}>{time.toLocaleTimeString()}</span>;
}
export default LocalClock;
