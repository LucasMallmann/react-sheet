import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

type Callback<T = unknown> = (data: T) => void;

export function useLoadFromLocalStorage(callback: Callback) {
  const localStorageData = useLoaderData();

  useEffect(() => {
    if (!localStorageData || Object.keys(localStorageData).length === 0) {
      return;
    }

    callback(localStorageData);
  }, [callback, localStorageData]);
}
