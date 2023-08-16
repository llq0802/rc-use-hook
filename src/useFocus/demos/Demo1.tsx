import { useFocus } from 'rc-use-hooks';
import React, { useRef } from 'react';

export default function Demo() {
  const ref = useRef<HTMLInputElement>(null);
  const focused = useFocus(ref);

  return (
    <div className={`form-field${focused && ' is-focused'}`}>
      <input type="text" ref={ref} placeholder="focus on me" />
      <span className="tip"> {focused ? '聚焦咯' : '没有聚焦'}</span>
    </div>
  );
}
