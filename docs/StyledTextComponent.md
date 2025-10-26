
# Componente: `StyledText`

O componente `StyledText` é uma abstração para o componente `Text` do React Native com estilização consistente baseada no tema da aplicação.  
Ele permite configurar tamanho da fonte, peso (regular / semibold / bold) e cores, utilizando tokens definidos no `theme`.

---

## **Importação**

```tsx
import { StyledText } from "@/components/StyledText";
````

---

## **Propriedades**

| Propriedade | Tipo                | Padrão            | Descrição                                |
| ----------- | ------------------- | ----------------- | ---------------------------------------- |
| `variant`   | `StyledTextVariant` | `"mediumRegular"` | Define o tamanho e o peso da fonte.      |
| `color`     | `StyledTextColor`   | `"default"`       | Define a cor do texto.                   |
| `children`  | `React.ReactNode`   | **obrigatório**   | Conteúdo interno do texto a ser exibido. |
| `style`     | `object`            | `undefined`       | Estilização inline adicional.            |

---

## **Tipos Disponíveis**

### `StyledTextVariant` (tamanho + peso da fonte)

Os prefixos definem o tamanho:

| Prefixo   | Tamanho        |
| --------- | -------------- |
| `small`   | Pequeno        |
| `medium`  | Médio (padrão) |
| `large`   | Grande         |
| `largest` | Muito grande   |

Os sufixos definem o peso:

| Sufixo     | Peso         |
| ---------- | ------------ |
| `Regular`  | Regular      |
| `SemiBold` | Semi-Negrito |
| `Bold`     | Negrito      |

Exemplos de valores válidos:

```ts
"smallRegular" | "mediumBold" | "largeSemiBold" | "largestRegular"
```

---

### `StyledTextColor` (cor do texto)

| Valor     | Cor definida no tema                                  |
| --------- | ----------------------------------------------------- |
| `default` | `theme.colors.text.default`                           |
| `muted`   | `theme.colors.text.muted`                             |
| `black`   | `theme.colors.common.black`                           |
| `light`   | `theme.colors.background.light`                       |
| `dark`    | `theme.colors.text.default` (equivalente a `default`) |

---

## **Exemplo de Uso**

```tsx
<StyledText>
  Texto padrão (mediumRegular + default)
</StyledText>
```

```tsx
<StyledText variant="largeBold" color="black">
  Título destacado
</StyledText>
```

```tsx
<StyledText variant="smallRegular" color="muted" style={{ textAlign: "center" }}>
  Texto descritivo centralizado
</StyledText>
```

---

## **Implementação**

### Componente principal

```tsx
export function StyledText({
  variant = "mediumRegular",
  color = "default",
  children,
  style,
}: StyledTextProps) {
  return (
    <StyledTextVariants variant={variant} color={color} style={style}>
      {children}
    </StyledTextVariants>
  );
}
```

### Estilização com `styled-components`

```tsx
export const StyledTextVariants = styled.Text<{
  variant: string;
  color: string;
}>`
  font-family: ${({ variant }) => {
    if (variant.includes("SemiBold")) return theme.fonts.semiBold;
    if (variant.includes("Bold")) return theme.fonts.bold;
    return theme.fonts.regular;
  }};

  font-size: ${({ variant }) => {
    if (variant.startsWith("small")) return theme.sizes["3"];
    if (variant.startsWith("medium")) return theme.sizes["4"];
    if (variant.startsWith("large")) return theme.sizes["6"];
    if (variant.startsWith("largest")) return theme.sizes["8"];
    return theme.sizes["4"];
  }};

  color: ${({ color }) => {
    switch (color) {
      case "muted":
        return theme.colors.text.muted;
      case "black":
        return theme.colors.common.black;
      case "light":
        return theme.colors.background.light;
      case "dark":
        return theme.colors.text.default;
      default:
        return theme.colors.text.default;
    }
  }};
`;
```
