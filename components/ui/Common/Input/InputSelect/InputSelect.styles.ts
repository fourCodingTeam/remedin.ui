import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const Backdrop = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	background-color: ${theme.colors.common.blackFaded}60;
	padding: 16px;
`;

export const Container = styled.View`
	background-color: ${theme.colors.background.light};
	border-radius: 8px;
	max-height: 60%;
	overflow: hidden;
`;

export const Item = styled.TouchableOpacity`
	padding: ${theme.sizes[3]} ${theme.sizes[4]};
	border-bottom-color: #eee;
	border-bottom-width: 1px;
`;

export const ItemText = styled.Text`
	font-size: ${theme.sizes[3]};
	color: ${theme.colors.text.default};
`;
