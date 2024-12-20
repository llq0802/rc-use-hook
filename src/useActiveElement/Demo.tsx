import { Flex, Input } from 'antd';
import { useActiveElement } from 'rc-use-hooks';
import React from 'react';

const arr = [1, 2, 3];
const Demo = () => {
  const activeElement = useActiveElement<HTMLInputElement>();
  return (
    <Flex gap={8}>
      {arr.map((i) => {
        return (
          <Input
            key={i}
            placeholder={`${i}`}
            data-id={i}
            onClick={() => {
              alert(activeElement?.dataset.id);
            }}
          />
        );
      })}
    </Flex>
  );
};

export default Demo;
