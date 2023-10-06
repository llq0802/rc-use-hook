import { useEffect, useState } from 'react';

/**
 * 使用window.matchMedia检查视口是否与给定的媒体查询匹配，
 * @author 李岚清 <https://github.com/llq0802>
 * @param query {string}  媒体查询语句字符串
 * @return  {boolean} 是匹配成功
 */
export default function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };

    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}