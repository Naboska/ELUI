import styled from 'styled-components';

import { Typography } from 'components/index';

export const StyledFieldLabel = styled.label`
  display: flex;
  width: fit-content;
  margin-bottom: 8px;
`;

export const StyledRequired = styled(Typography)`
  color: ${({ theme }) => theme.palette.error};
`;
