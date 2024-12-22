import { Button } from 'antd';
import { useMeasure } from 'rc-use-hooks';
import React from 'react';

const Demo1 = () => {
  const ref = React.useRef<HTMLTextAreaElement>(null!);
  const rect = useMeasure(ref);
  return (
    <div>
      <div>
        <Button onClick={() => stop()}>stop observe</Button>
      </div>
      <br />
      <textarea
        ref={ref}
        disabled
        style={{ width: 286, height: 166 }}
        value="拖动试试"
      />
      <br />
      <b>
        <pre>{JSON.stringify(rect, null, 2)}</pre>
      </b>
    </div>
  );
};

export default Demo1;
