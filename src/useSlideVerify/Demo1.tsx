import { Button } from 'antd';
import { useSlideVerify } from 'rc-use-hooks';
import React, { useRef } from 'react';

export default function Demo1() {
  const ref = useRef(null);
  const { moveX, reset } = useSlideVerify(ref, {
    maxMoveX: 400,
    onMouseUp(moveX) {
      console.log('==onMouseUp===>', moveX);
    },
  });
  console.log('==moveX====>', moveX);
  return (
    <h3>
      <Button onClick={reset}>reset</Button>
      <hr />
      <div
        ref={ref}
        style={{
          width: 100,
          height: 100,
          background: 'red',
          cursor: 'move',
        }}
      >
        box
      </div>
    </h3>
  );
}
