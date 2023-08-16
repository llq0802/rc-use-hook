import { useDefer } from 'rc-use-hooks';
import React from 'react';

const style: React.CSSProperties = {
  width: 100,
  height: 100,
  background: 'red',
};
const Hello = ({ children }) => {
  return <div style={style}>{children}</div>;
};

const list = new Array(1000).fill(1);

const Demo1 = () => {
  const isRender = useDefer(list.length);

  console.log('isRender==');
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 100px)',
        placeContent: 'center',
        gridGap: 4,
        border: `1px solid`,
      }}
    >
      {list.map((item, index) => {
        return isRender(index) && <Hello key={index}>{index}</Hello>;
      })}
    </div>
  );
};

export default Demo1;
