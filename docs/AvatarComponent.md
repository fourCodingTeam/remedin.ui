# Componente: `Avatar`

O componente `Avatar` exibe a foto de perfil de um usuário, com fallback inteligente baseado nas iniciais e suporte a indicadores de status.

---

## **Importação**

```tsx
import { Avatar } from "@/components/ui";
```

---

## **Propriedades**

| Propriedade               | Tipo                              | Padrão     | Descrição                                                                 |
| ------------------------- | --------------------------------- | ---------- | ------------------------------------------------------------------------- |
| `name`                    | `string`                          | `undefined`| Usado para gerar as iniciais quando não há imagem.                        |
| `source`                  | `ImageSourcePropType`             | `undefined`| Fonte da imagem exibida no avatar.                                        |
| `size`                    | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"`    | Define o diâmetro do avatar.                                              |
| `bordered`                | `boolean`                         | `false`    | Exibe uma borda clara ao redor do avatar.                                 |
| `fallbackBackgroundColor` | `string`                          | `undefined`| Cor de fundo quando não há imagem (usa o tema por padrão).                |
| `status`                  | `"online" \| "offline" \| "busy" \| "away" \| "none"` | `"none"` | Controla a exibição do indicador de status.                               |
| `statusColor`             | `string`                          | `undefined`| Sobrescreve a cor do indicador de status.                                 |
| `style`                   | `StyleProp<ViewStyle>`            | `undefined`| Estilos adicionais aplicados ao contêiner.                                |
| `...rest`                 | `ViewProps`                       | `-`        | Qualquer outra propriedade válida para `View`.                            |

---

## **Estados de Status**

| Status      | Cor utilizada                                         |
| ----------- | ----------------------------------------------------- |
| `online`    | `theme.colors.warnings.success`                       |
| `away`      | `theme.colors.warnings.warning`                       |
| `busy`      | `theme.colors.warnings.danger`                        |
| `offline`   | `theme.colors.border.muted`                           |
| `none`      | Oculta o indicador                                    |

---

## **Exemplos de Uso**

```tsx
<Avatar
  name="Ana Laura"
  source={{ uri: "https://i.pravatar.cc/300" }}
  size="lg"
  bordered
/>
```

```tsx
<Avatar
  name="Carlos Silva"
  status="online"
/>
```

```tsx
<Avatar
  name="Usuário Desconhecido"
  fallbackBackgroundColor="#8AA2F4"
  status="away"
/>
```

---

## **Resumo**

✅ Mantém consistência visual com o tema da aplicação  
✅ Fallback automático com iniciais do usuário  
✅ Suporte a vários tamanhos e indicador de status opcional  
✅ Fácil personalização através de propriedades adicionais  

Use o `Avatar` para representar usuários de forma clara e responsiva em toda a aplicação. ✨

