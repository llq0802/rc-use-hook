import { useWillMount } from 'rc-use-hooks';
import useSlideVerify from 'rc-use-hooks/useSlideVerify';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function Demo1() {
  const ref = useRef();
  // useDraggable(ref);
  const { x, reset } = useSlideVerify(ref, {
    maxMoveX: 100,
    onMouseUp(moveX) {
      console.log('==onMouseUp===>', moveX);
    },
  });

  console.log('==x====>', x);

  const [count, setCount] = useState(0);
  useWillMount(() => {
    setTimeout(() => {
      setCount(999);
    }, 1000);
    console.log('== useWillMount ====>');
  });
  useLayoutEffect(() => {
    console.log('==useLayoutEffect====>');
  }, []);
  useEffect(() => {
    console.log('==useEffect====>');
  }, []);

  return (
    <h3>
      Demo-{count}
      <button onClick={reset}>reset</button>
      <div
        ref={ref}
        style={{ width: 100, height: 100, background: 'red', cursor: 'move' }}
      >
        box
      </div>
    </h3>
  );
}
