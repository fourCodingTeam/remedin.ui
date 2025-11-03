import { theme } from "@/constants/theme";
import styled from "styled-components/native";

export const Backdrop = styled.TouchableOpacity`
	flex: 1;
	background-color: ${theme.colors.common.blackFaded};
	justify-content: center;
	padding: 20px;
`;

export const Container = styled.View`
	background-color: ${theme.colors.background.light};
	border-radius: 8px;
	max-height: 60%;
	overflow: hidden;
`;

export const Item = styled.TouchableOpacity`
	padding: ${theme.sizes[2]} ${theme.sizes[3]};
	border-bottom-color: #eee;
	border-bottom-width: 1px;
`;

export const ItemText = styled.Text`
	font-size: ${theme.sizes[3]};
	color: ${theme.colors.text.default};
`;
