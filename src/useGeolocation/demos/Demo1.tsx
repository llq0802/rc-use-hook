import { useGeolocation } from 'rc-use-hook';
import React from 'react';

const Demo1 = () => {
  const ret = useGeolocation();
  console.log('ret', ret);
  return <div>Demo1</div>;
};

export default Demo1;
