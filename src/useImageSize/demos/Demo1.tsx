import { useImageSize } from 'rc-use-hook';
import React from 'react';
const url = `https://picsum.photos/200`;
function Demo1() {
  const [width, height] = useImageSize(url);
  return (
    <>
      <div
        style={{
          width: width || 150,
          height: height || 150,
          backgroundColor: '#209cee',
        }}
      >
        当前图像的原始宽高为
        <p> width: {width}</p>
        <p>height: {height}</p>
      </div>
    </>
  );
}

export default Demo1;
