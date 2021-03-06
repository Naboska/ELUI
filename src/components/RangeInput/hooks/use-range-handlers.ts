import { KeyboardEvent, MouseEvent, RefObject, SyntheticEvent, useCallback } from 'react';
import { clamp } from 'ramda';

import { dispatchEvent } from 'lib';

export type TThumb = {
  innerRef: RefObject<HTMLInputElement>;
  railRef: RefObject<HTMLDivElement>;
  min: number;
  max: number;
  value: number;
};

const LEFT_ARROW_CODE = 'ArrowLeft';

const RIGHT_ARROW_CODE = 'ArrowRight';

export const useRangeHandlers = ({ innerRef, railRef, max, min, value }: TThumb) => {
  const setInputValue = useCallback(
    value => {
      dispatchEvent({ event: 'input', element: innerRef.current, property: 'value', args: value });
      railRef.current.focus();
    },
    [innerRef, railRef]
  );

  const handleChangeTrack = useCallback(
    (x: number) => {
      const { left, width } = railRef.current.getBoundingClientRect();
      const value = clamp(0, 1, (x - left) / width) * (max - min) + min;
      setInputValue(Math.round(value));
    },
    [railRef, max, min, setInputValue]
  );

  const handleClickRail = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      handleChangeTrack(event.pageX);
    },
    [handleChangeTrack]
  );

  const handleIncrement = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      setInputValue(clamp(min, max, value + 1));
    },
    [max, min, setInputValue, value]
  );

  const handleDecrement = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      setInputValue(clamp(min, max, value - 1));
    },
    [max, min, setInputValue, value]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === LEFT_ARROW_CODE) handleDecrement(event);
      if (event.key === RIGHT_ARROW_CODE) handleIncrement(event);
    },
    [handleIncrement, handleDecrement]
  );

  return {
    handleChangeTrack,
    handleClickRail,
    handleIncrement,
    handleDecrement,
    handleKeyDown,
  };
};
