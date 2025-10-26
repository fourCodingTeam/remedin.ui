import { theme } from "@/constants/theme";
import styled from "styled-components/native";

type InputBaseWrapperProps = {
    isActive: boolean
}

export const InputBaseWrapper = styled.View<InputBaseWrapperProps>`
    width: 100%;
    border-radius: ${theme.borderRadius[2]};
    padding: ${theme.sizes[3]} ${theme.sizes[4]};

     border: ${({ isActive }) =>
    isActive ? `1px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.border.default}`};
`
export const InputStyle = styled.TextInput`
    width: 100%;
    height: 19px;
    outline: none;
    border: none;
    color: red;
    font-family: ${theme.fonts.regular};

    /* &::placeholder{
        color: ${theme.colors.text.muted};
    } */
`