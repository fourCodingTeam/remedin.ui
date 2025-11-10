import FontAwesome from "@expo/vector-icons/FontAwesome";
import styled from "styled-components/native";
import { theme } from "@/constants/theme";

type InputBaseWrapperProps = {
  isActive: boolean;
  isCompact?: boolean;
  enableFlexOne?: boolean;
};

export const InputBaseWrapper = styled.View<InputBaseWrapperProps>`
    flex: ${({ enableFlexOne }) => (enableFlexOne ? 1 : "none")};
    width: 100%;
    flex-direction: row;
    align-items: center;
    border-radius: ${theme.borderRadius[2]};
    ${({ isCompact }) =>
      isCompact
        ? `
        padding: ${theme.sizes[1]} ${theme.sizes[3]};`
        : `padding: ${theme.sizes[2]} ${theme.sizes[4]};`}

    border: ${({ isActive }) =>
      isActive
        ? `1px solid ${theme.colors.accent.primary}`
        : `1px solid ${theme.colors.border.default}`};
`;
export const InputStyle = styled.TextInput`
    flex: 1;
    width: 100%;
    height: 40px;
    outline: none;
    border: none;
    color: ${theme.colors.text.default};
    font-family: ${theme.fonts.regular};
    font-size: ${theme.sizes[4]};

     &::placeholder{
        color: ${theme.colors.text.muted};
    }
`;
export const InputPrefixIconWrapper = styled(FontAwesome)`
    margin-right: ${theme.sizes[2]};
`;
export const InputSuffixIconWrapper = styled(FontAwesome)`
    margin-left: ${theme.sizes[2]};
`;
