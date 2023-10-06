import { useAnimateNumber } from 'rc-use-hooks';
import React from 'react';

export default function Demo1() {
  const [value1, setValue1] = useAnimateNumber(0);
  const [value2, setValue2] = useAnimateNumber(100, {
    decimals: 0,
  });

  return (
    <>
      <h3
        onClick={() => {
          setValue1(value1 + 1);
        }}
      >
        点我-value1: {value1}
      </h3>
      <h3
        onClick={() => {
          setValue2(value2 + 10);
        }}
      >
        点我-value2: {value2}
      </h3>
    </>
  );
}
