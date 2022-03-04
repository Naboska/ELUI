import { Context, createContext, useContext } from 'react';

import type { TSegmentedControlContext } from '../types';

const SegmentedControlContext = createContext<TSegmentedControlContext>(<TSegmentedControlContext>{});
SegmentedControlContext.displayName = 'SegmentedControlProvider';

export const SegmentedControlProvider = SegmentedControlContext.Provider;

export const useSegmentedControlContext = <Value = unknown>() =>
  useContext<TSegmentedControlContext<Value>>(
    <Context<TSegmentedControlContext<Value>>>(SegmentedControlContext as unknown)
  );
