import { useWillMount } from 'rc-use-hooks';
import React, { useEffect, useLayoutEffect, useState } from 'react';

export default function Demo1() {
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

  return <h3>Demo-{count}</h3>;
}
