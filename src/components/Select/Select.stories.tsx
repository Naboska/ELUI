import { useState } from 'react';
import styled from 'styled-components';

import { Icon } from 'components/Icon';
import { reverseArrayValue, toString } from 'lib';

import type { ISelect } from './types';
import { SELECT_CN } from './constants';
import { Select } from './Select';

export default {
  title: 'ui/Select',
  component: Select,
  argTypes: {
    validate: { options: [true, false, null], control: { type: 'radio' } },
    leftSlot: { control: { type: null } },
    onChange: { control: { type: null } },
    onClear: { control: { type: null } },
    activeValue: { control: { type: null } },
    onSearch: { control: { type: null } },
    boxStyle: { control: { type: null } },
  },
  args: {
    placeholder: 'Placeholder',
    label: 'Label',
    message: 'This is the description area',
    validateMessage: 'This is an validate message',
    className: '',
    searchFallback: '',
    disabled: false,
    isRequired: true,
    validate: null,
    withChevron: true,
    isPortal: true,
    zIndex: 21,
  },
};

export const Default = (args: ISelect) => {
  const [value, setValue] = useState<string>();

  return (
    <StyledBox>
      <Select<string>
        {...args}
        onChange={value => {
          setValue(value);
          args?.onChange(value);
        }}
        onClear={() => {
          setValue('');
          args?.onClear('');
        }}
        activeValue={value}
        leftSlot={values => values[0]?.leftSlot}
        searchFallback={args?.searchFallback || (value && `Item ${Number(value) + 1}`)}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <Select.Option key={i} leftSlot={<Icon.Mail />} value={toString(i)}>
            Item {i + 1}
          </Select.Option>
        ))}
      </Select>
    </StyledBox>
  );
};
Default.args = {
  isCloseAfterChange: true,
};
Default.argTypes = {
  multiple: { control: { type: null } },
};

export const Multiple = (args: ISelect) => {
  const [values, setValues] = useState<string[]>([]);

  const items = Array.from({ length: 20 }, (_, i) => toString(i));

  return (
    <StyledBox>
      <Select<string>
        {...args}
        onChange={value => {
          setValues(reverseArrayValue(values, value));
          args?.onChange(value);
        }}
        activeValue={values}
        onClear={value => {
          setValues(value ? reverseArrayValue(values, value) : []);
          args?.onClear(value);
        }}
      >
        <Select.Option
          leftSlot={<Icon.Grid />}
          checked={values.length === items.length}
          onClick={() => setValues(values.length === items.length ? [] : items)}
        >
          All
        </Select.Option>
        {items.map(i => (
          <Select.Option key={i} leftSlot={<Icon.Mail />} value={toString(i)}>
            Item {Number(i) + 1}
          </Select.Option>
        ))}
      </Select>
    </StyledBox>
  );
};
Multiple.args = {
  multiple: true,
  isCloseAfterChange: false,
};

const StyledBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.white};
  box-shadow: 0 0 8px ${({ theme }) => theme.palette.grey_300};

  .${SELECT_CN} {
    max-width: 500px;
  }
`;
