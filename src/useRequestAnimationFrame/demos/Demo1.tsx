import { useRequestAnimationFrame } from 'rc-use-hook';
import React, { useState } from 'react';

function Demo1() {
  const [count, setCount] = useState(0);

  useRequestAnimationFrame((deltaTime) => {
    setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100);
  });

  return <p>{Math.round(count)}</p>;
}

export default Demo1;
