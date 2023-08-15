import { useEffect, useState } from 'react';

/**
 * 获取图像原始宽高
 */
export default (url: string) => {
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    if (!url) return;
    const img = document.createElement('img');
    img.addEventListener('load', (e: Event) => {
      const { naturalWidth, naturalHeight } = e.target;
      setSize([naturalWidth, naturalHeight]);
    });

    img.src = url;
  }, [url]);

  return size;
};
