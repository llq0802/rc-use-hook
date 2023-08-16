import { Select } from 'antd';
import { useDelayedState } from 'rc-use-hooks';
import React, { Key, ReactNode, useEffect, useState } from 'react';

type TypeValue = {
  label: ReactNode;
  value: Key;
};

function Demo1() {
  const [list, setList] = useState<TypeValue[]>([]);
  const [value, setValue] = useDelayedState<string>(
    list?.[0]?.value as string,
    !!list.length,
  );
  useEffect(() => {
    const handle = setTimeout(() => {
      setList([
        { label: 'AAA', value: 'aaa' },
        { label: 'BBB', value: 'bbb' },
        { label: 'CCC', value: 'ccc' },
      ]);
    }, 3000);
    return () => {
      clearTimeout(handle);
    };
  }, []);

  return (
    <div>
      <h3>value: {value}</h3>
      <Select
        placeholder="请选择"
        style={{ width: '30%' }}
        options={list}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}

export default Demo1;
