import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const CardWrapper = styled.View<{
  backgroundColor: string;
  borderColor?: string;
}>`
  flex: 1;
  padding: ${theme.sizes[4]};
  border-radius: ${theme.borderRadius[3]};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-width: ${({ borderColor }) => (borderColor ? "1px" : "0px")};
  border-color: ${({ borderColor }) => borderColor ?? "transparent"};
  gap: ${theme.sizes[3]};
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const TitleText = styled.Text<{ color: string }>`
  font-family: ${theme.fonts.medium};
  font-size: ${theme.sizes[3]};
  color: ${({ color }) => color};
`;

export const IconContainer = styled.View<{ backgroundColor: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius[2]};
  align-items: center;
  justify-content: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const ValueContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: ${theme.sizes[1]};
`;

export const ValueText = styled.Text<{ color: string }>`
  font-family: ${theme.fonts.bold};
  font-size: ${theme.sizes[9]};
  color: ${({ color }) => color};
`;

export const UnitText = styled.Text<{ color: string }>`
  font-family: ${theme.fonts.medium};
  font-size: ${theme.sizes[4]};
  color: ${({ color }) => color};
  text-transform: uppercase;
`;
