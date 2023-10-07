import { useEffect, useState } from 'react';

/**
 * 获取图像原始宽高
 * @author 李岚清 <https://github.com/llq0802>
 * @param {string} url 图片的url地址
 * @return {[number,number]} 图像原始宽高的数组
 */
export default function useImageSize(url: string) {
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
}
