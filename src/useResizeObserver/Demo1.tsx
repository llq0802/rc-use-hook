import { Button } from 'antd';
import { useResizeObserver } from 'rc-use-hooks';
import React, { useRef, useState } from 'react';

export default function Demo() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [contentRect, setContentRect] = useState({});
  const stop = useResizeObserver(ref, (entries) => {
    const [entry] = entries;
    setContentRect(entry.contentRect);
  });

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
        <pre>{JSON.stringify(contentRect, null, 2)}</pre>
      </b>
    </div>
  );
}
