import { useRequestAnimationFrame } from 'rc-use-hooks';
import React, { useState } from 'react';

function Demo1() {
  const [count, setCount] = useState(0);

  useRequestAnimationFrame((deltaTime) => {
    setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100);
  });

  return <h3>{Math.round(count)}</h3>;
}

export default Demo1;
