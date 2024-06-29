import loading from '@styles/loading.module.scss';
import React, { Fragment } from 'react';
import { LoadingProps } from '../../types/';
function LoadingBox({ isReady, children, message }: LoadingProps) {
  function Loading() {
    return (
      <div className={loading.box_loading}>
        <div className={loading.box_loading_container}>
          <span className={loading.box_loading_spinner}>refresh</span>
          <span className={loading.box_loading_text}>{message || 'Loading...'}</span>
        </div>
      </div>
    );
  }
  return isReady ? <Fragment>{children}</Fragment> : <Loading />;
}
export default LoadingBox;
