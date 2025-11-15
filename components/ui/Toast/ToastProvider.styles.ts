import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const ToastProviderContainer = styled.View`
  position: absolute;
  top: ${theme.sizes[8]};
  left: ${theme.sizes[4]};
  right: ${theme.sizes[4]};
  z-index: 9999;
  pointer-events: box-none;
`;
