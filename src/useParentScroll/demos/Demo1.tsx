import { useParentScroll } from 'rc-use-hooks';
import React, { useRef } from 'react';

function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollDom = useParentScroll(ref);

  console.log('scrollDom', scrollDom);

  return (
    <div id="myScrollDom" style={{ height: 300, overflow: 'auto' }}>
      第一个可滚动的节点的id: {scrollDom?.id}
      <br />
      <br />
      <div style={{ height: 1000 }} ref={ref}>
        超出的内容
      </div>
    </div>
  );
}

export default Demo;
