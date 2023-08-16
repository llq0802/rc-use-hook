import { useGeolocation } from 'rc-use-hooks';
import React from 'react';

const Demo1 = () => {
  const coords = useGeolocation();
  return (
    <div>
      <h3>仅在 HTTPS 下有效</h3>
      <pre>{JSON.stringify(coords, null, 4)}</pre>
    </div>
  );
};

export default Demo1;
