import { useHover } from 'ahooks';
import { useFocus, useMergedRef } from 'rc-use-hooks';
import React, { useRef } from 'react';

const MergedRefDemo = () => {
  const input1Ref = useRef<HTMLInputElement>(null!);
  const input2Ref = useRef<HTMLInputElement>(null!);
  // 合并两个 ref
  const mergedRef = useMergedRef(input1Ref, input2Ref);

  const foucs1 = useFocus(input1Ref);
  const hover2 = useHover(input2Ref);

  return (
    <div>
      <input ref={mergedRef} style={{ padding: '8px', fontSize: '14px' }} />
      <p>input-focus: {foucs1 ? 'focus' : 'blur'}</p>
      <p>input-hover: {hover2 ? 'hover' : 'no-hover'}</p>
    </div>
  );
};

export default MergedRefDemo;
