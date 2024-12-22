import { useWillMount } from 'rc-use-hooks';
import React, { useEffect, useLayoutEffect } from 'react';

export default function Demo1() {
  useEffect(() => {
    console.log('==useEffect====>');
  }, []);

  useLayoutEffect(() => {
    console.log('==useLayoutEffect====>');
  }, []);

  useWillMount(() => {
    console.log('===useWillMount====>');
  });

  return <h3>查看控制台</h3>;
}
