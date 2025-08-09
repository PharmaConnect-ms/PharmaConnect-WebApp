'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import InitAuthGate from '@/components/InitAuthGate';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitAuthGate>{children}</InitAuthGate>
    </Provider>
  );
}
