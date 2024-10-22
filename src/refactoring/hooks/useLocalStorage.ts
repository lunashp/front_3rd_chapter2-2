import { useState, useEffect } from "react";

/**
 * 로컬 스토리지에 데이터를 저장하고 관리하는 커스텀 훅입니다.
 * 주어진 키에 해당하는 데이터를 로컬 스토리지에서 가져오고,
 * 값이 변경될 때마다 로컬 스토리지에 업데이트합니다.
 *
 * @template T
 * @param {string} key - 로컬 스토리지에 저장할 데이터의 키.
 * @param {T} initialValue - 로컬 스토리지에 값이 없을 경우 사용할 초기값.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} - 현재 저장된 값과 값을 업데이트하는 함수.
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 로컬 스토리지에 값이 없으면 초기값을 사용
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // 값이 변경될 때마다 로컬 스토리지 업데이트
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
