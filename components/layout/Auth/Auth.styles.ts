import { theme } from "@/constants/theme";
import styled from "styled-components/native";

export const StyledView = styled.View`
  flex: 1;
  position: relative;
  align-content: center;
  justify-content: flex-end;
`;

export const StyledImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const ButtonsWrapper = styled.View`
  paddingVertical: ${theme.sizes[6]};
  paddingHorizontal: ${theme.sizes[4]};
  gap: 8px;
`