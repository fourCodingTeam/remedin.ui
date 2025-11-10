import styled from "styled-components/native";
import { theme } from "@/constants/theme";

type ButtonsWrapperProps = {
  heightFull?: boolean;
  addPadding?: boolean;
};

export const ButtonsWrapper = styled.View<ButtonsWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
  justify-content: flex-end;
  ${({ heightFull }) => heightFull && "height: 90%;"};
  padding: ${({ addPadding }) => (addPadding ? `${theme.sizes[4]} 0` : 0)};
`;

export const ContentWrapper = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
`;

export const ScrollableContentWrapper = styled.ScrollView`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
`;

export const FormContentWrapper = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${theme.sizes[2]};
`;

export const InputsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
`;
