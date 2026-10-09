import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useOnline() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    return NetInfo.addEventListener(state => {
      setOnline(state.isConnected !== false && state.isInternetReachable !== false);
    });
  }, []);

  return online;
}
