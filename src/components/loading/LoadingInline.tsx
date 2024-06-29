import loading from '@styles/loading.module.scss';
import React, { Fragment } from 'react';
import { LoadingProps } from '../../types/';

function LoadingInline({ isReady, children }: LoadingProps) {
  function Loading() {
    return (
      <div className={loading.inline_loading}>
        <span className={loading.inline_loading_spinner}>refresh</span>
        <span className={loading.inline_loading_text}>Loading...</span>
      </div>
    );
  }
  return isReady ? <Fragment>{children}</Fragment> : <Loading />;
}
export default LoadingInline;
