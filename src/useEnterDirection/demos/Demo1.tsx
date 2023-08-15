import { useEnterDirection } from 'rc-use-hooks';
import React, { useRef } from 'react';

const style: React.CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: 400,
  height: 300,
  border: '1px solid',
  fontSize: 18,
  fontWeight: 700,
};

const Demo1 = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const direction = useEnterDirection(ref);
  return (
    <div ref={ref} style={style}>
      {direction || '鼠标进入试试!'}
    </div>
  );
};

export default Demo1;
