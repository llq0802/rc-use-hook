import { usePortal } from 'rc-use-hook';
import React from 'react';

function Child() {
  return <div id="myUsePortal">子组件内容-</div>;
}

export default function Demo1() {
  const Portal = usePortal(document.getElementById('myUsePortal'));
  return (
    <div>
      <p>父组件</p>
      <Portal>9 Portal 9</Portal>
      <Child />
    </div>
  );
}
