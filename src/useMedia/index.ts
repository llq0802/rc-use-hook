import { useEffect, useState } from 'react';

/**
 * 使用window.matchMedia检查视口是否与给定的媒体查询匹配，
 * @param query {string}  媒体查询语句字符串
 * @return  {boolean} 是匹配成功
 */
export default function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
