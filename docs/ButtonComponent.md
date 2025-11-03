Claro — vou atualizar o **Markdown** para incluir a prop `icon` com autocomplete usando **FontAwesome**, e também mostrar no uso como ela aparece no botão.
Aqui está o **md revisado**:

---

# Componente: Button

O componente `Button` é um elemento de interface de usuário (UI) fundamental, projetado para ser um botão de ação personalizável e reutilizável em toda a aplicação React Native. Ele é construído sobre o `TouchableOpacity`, garantindo uma resposta visual suave ao toque.

Além de múltiplos estilos (`variants`) e tamanhos (`size`), o componente também suporta ícones opcionais usando **FontAwesome**, estados de carregamento (`isLoading`) e desabilitado (`disabled`).

---

## Estrutura de Arquivos

Localizado em:
`components/ui/common/Button/`

| Arquivo                | Função                                     |
| ---------------------- | ------------------------------------------ |
| **`Button.tsx`**       | Implementação e renderização do componente |
| **`Button.types.ts`**  | Definições de tipos (props)                |
| **`Button.styles.ts`** | Estilos (styled-components)                |

---

## Propriedades (Props)

| Prop        | Tipo                                                                             | Padrão      | Descrição                                                                 |
| :---------- | :------------------------------------------------------------------------------- | :---------- | :------------------------------------------------------------------------ |
| **`label`** | `string`                                                                         | —           | **(Obrigatório)** O texto exibido dentro do botão.                        |
| `variant`   | `'black'` `'primary'` `'secondary'` `'danger'` `'neutral'` `'outline'` `'empty'` | `'primary'` | Estilo visual do botão.                                                   |
| `size`      | `'sm'` `'md'` `'lg'`                                                             | `'md'`      | Define o espaçamento interno e dimensões do botão.                        |
| `fullWidth` | `boolean`                                                                        | `false`     | O botão se expande para ocupar toda a largura disponível.                 |
| `isLoading` | `boolean`                                                                        | `false`     | Mostra um `ActivityIndicator` e desativa a interação.                     |
| `disabled`  | `boolean`                                                                        | `false`     | Desativa clique e aplica estilo esmaecido.                                |
| `textSize`  | `StyledTextVariant`                                                              | `undefined` | Controla a variante de tamanho do texto.                                  |
| **`icon`**  | `IconName` (`keyof typeof FontAwesome.glyphMap`)                                 | `undefined` | Ícone opcional do **FontAwesome**, com autocomplete integrado.            |
| `...props`  | `TouchableOpacityProps`                                                          | —           | Suporta todas as props do TouchableOpacity, como `onPress`, `style`, etc. |

---

## Como Usar

### Uso básico

```jsx
import { Button } from '@/components/ui';

<Button label="Clique Aqui" onPress={() => alert('Botão Pressionado!')} />;
```

### Variantes

```jsx
<Button label="Confirmar" variant="black" />
<Button label="Ver Detalhes" variant="secondary" />
<Button label="Cancelar" variant="outline" />
<Button label="Excluir" variant="danger" />
<Button label="Saber Mais" variant="empty" />
```

### Tamanhos

```jsx
<Button label="Pequeno" size="sm" />
<Button label="Médio" size="md" />
<Button label="Grande" size="lg" />
```

### Ocupando a largura total

```jsx
<Button label="Entrar" fullWidth />
```

### Estado de carregamento e desativado

```jsx
<Button label="Enviando..." isLoading fullWidth />
<Button label="Indisponível" disabled fullWidth />
```

### ✅ Usando Ícones (com autocomplete 🎉)

```jsx
<Button label="Enviar" icon="send" variant="primary" />

<Button label="Adicionar" icon="plus" variant="secondary" />

<Button label="Excluir" icon="trash" variant="danger" />
```