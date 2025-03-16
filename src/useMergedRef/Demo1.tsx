import { useFocus, useMergedRef } from 'rc-use-hooks';
import React, { useRef } from 'react';

const MergedRefDemo = () => {
  const input1Ref = useRef<HTMLInputElement>(null!);
  const input2Ref = useRef<HTMLInputElement>(null!);

  // 合并两个 ref
  const mergedRef = useMergedRef(input1Ref, input2Ref);

  const foucs = useFocus(mergedRef);

  return (
    <div>
      <input
        ref={mergedRef}
        defaultValue="input1"
        style={{ padding: '8px', fontSize: '14px' }}
      />

      <hr />
      <input
        ref={mergedRef}
        defaultValue="input2"
        style={{ padding: '8px', fontSize: '14px' }}
      />
    </div>
  );
};

export default MergedRefDemo;
