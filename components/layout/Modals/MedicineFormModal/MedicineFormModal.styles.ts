import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const SideBySideInputsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  gap: ${theme.sizes[2]};
`;
