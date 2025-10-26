# Componente: `MultiSelectTag`

O componente `MultiSelectTag` representa um botão de tag utilizado em seleções múltiplas.  
Ele exibe um texto estilizado (`StyledText`) dentro de um `TouchableOpacity` customizado, variando visualmente conforme seu estado (`isSelected` e `disabled`).

---

## **Importação**

```tsx
import { MultiSelectTag } from "@/components/MultiSelectTag";
````

---

## **Propriedades**

| Propriedade  | Tipo         | Padrão          | Descrição                                                     |
| ------------ | ------------ | --------------- | ------------------------------------------------------------- |
| `id`         | `number`     | **obrigatório** | Identificador único da tag (útil para gerenciamento externo). |
| `label`      | `string`     | **obrigatório** | Texto exibido na tag.                                         |
| `isSelected` | `boolean`    | `false`         | Indica se a tag está selecionada. Altera cor e borda.         |
| `disabled`   | `boolean`    | `false`         | Desabilita interação e aplica estilo opaco.                   |
| `onPress`    | `() => void` | `undefined`     | Função chamada ao pressionar a tag.                           |

---

## **Comportamento Visual**

| Estado           | Fundo                             | Borda                         | Interação        |
| ---------------- | --------------------------------- | ----------------------------- | ---------------- |
| **Normal**       | `theme.colors.background.default` | `theme.colors.border.default` | Pressionável     |
| **Selecionado**  | `theme.colors.accent.primary`     | `theme.colors.accent.primary` | Pressionável     |
| **Desabilitado** | `theme.colors.border.muted`       | `theme.colors.border.muted`   | Não pressionável |

---

## **Exemplo de Uso**

```tsx
<MultiSelectTag
  id={1}
  label="Opção A"
  isSelected={true}
  onPress={() => console.log("Tag selecionada!")}
/>
```

```tsx
<MultiSelectTag
  id={2}
  label="Opção B"
  disabled
/>
```

---

## **Implementação**

### Componente

```tsx
export function MultiSelectTag({
  id,
  isSelected,
  label,
  disabled,
  onPress,
}: MultiSelectTagProps) {
  return (
    <TagWrapper
      isSelected={isSelected}
      disabled={disabled}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <StyledText variant="mediumRegular">{label}</StyledText>
    </TagWrapper>
  );
}
```

### Estilização (`TagWrapper`)

```tsx
export const TagWrapper = styled.TouchableOpacity<{
  isSelected?: boolean;
  disabled?: boolean;
}>`
  background-color: ${({ isSelected, disabled }) =>
    disabled
      ? theme.colors.border.muted
      : isSelected
      ? theme.colors.accent.primary
      : theme.colors.background.default};

  border: ${({ isSelected, disabled }) =>
    disabled
      ? `1px solid ${theme.colors.border.muted}`
      : isSelected
      ? `1px solid ${theme.colors.accent.primary}`
      : `1px solid ${theme.colors.border.default}`};

  border-radius: ${theme.sizes[5]};
  padding: ${theme.sizes[3]};
`;
```

---

## **Resumo**

✅ Componente simples e reutilizável
✅ Visual coerente com o tema da aplicação
✅ Ideal para listas de seleção múltipla
✅ Estados claros: normal, selecionado e desabilitado

Use `MultiSelectTag` para representar escolhas selecionáveis de forma consistente e acessível. 🎯
