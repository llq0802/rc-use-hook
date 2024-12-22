import { useDraggable } from 'rc-use-hooks';
import React, { useRef } from 'react';

const Demo1 = () => {
  const ref = useRef<HTMLDivElement>(null!);
  const { moving, x, y } = useDraggable(ref);

  return (
    <div
      style={{
        height: 500,
        border: '1px solid #000',
        position: 'relative',
      }}
    >
      <div
        ref={ref}
        style={{
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 100,
          height: 100,
          background: 'red',
          userSelect: 'none',
          touchAction: 'none',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        drag me
      </div>
    </div>
  );
};

export default Demo1;
