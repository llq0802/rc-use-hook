import { Button } from 'antd';
import { usePortal } from 'rc-use-hooks';
import React, { useState } from 'react';

function Child() {
  return <div id="myUsePortal">Child组件内容--: </div>;
}

function PortalChild() {
  return <span> Portal 的子组件内容</span>;
}

export default function Demo1() {
  const Portal = usePortal(document.getElementById('myUsePortal'));

  const [show, setShow] = useState(true);

  return (
    <div>
      <Button onClick={() => setShow(!show)}>切换</Button>
      <p>父组件</p>
      {show && (
        <Portal>
          <PortalChild />
        </Portal>
      )}
      <Child />
    </div>
  );
}
