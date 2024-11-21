import * as Font from 'expo-font';
import { useState, useEffect } from 'react';

export const useFonts = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Orbitron: require('./assets/fonts/Orbitron-Regular.ttf'),
    }).then(() => setLoaded(true));
  }, []);

  return loaded;
};
