# Componente: Button

O componente `Button` é um elemento de interface de usuário (UI) fundamental, projetado para ser um botão de ação personalizável e reutilizável em toda a aplicação React Native. Ele é construído sobre o `TouchableOpacity` nativo, garantindo uma resposta visual ao toque.

O componente oferece suporte a múltiplos estilos visuais (`variants`), tamanhos, e estados como **carregando** (`isLoading`) e **desativado** (`disabled`).

## Estrutura de Arquivos

O componente está localizado em:
`components/ui/common/Button/`

-   `Button.tsx`: A lógica e a renderização do componente.
-   `Button.types.ts`: As definições de tipos e interfaces para as props.
-   `Button.styles.ts`: Os estilos do componente usando `styled-components`.

---

## Propriedades (Props)

A tabela abaixo descreve todas as `props` que você pode passar para o componente `Button`.

| Prop | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| **`label`** | `string` | - | **(Obrigatório)** O texto que será exibido dentro do botão. |
| `variant` | `'black'` `'primary'` `'secondary'` `'danger'` `'neutral'` `'outline'` `'empty'` | `'primary'` | Define o estilo visual do botão (cor de fundo, borda, etc.). |
| `size` | `'sm'` `'md'` `'lg'` | `'md'` | Define o tamanho do botão, alterando o `padding` interno. |
| `fullWidth` | `boolean` | `false` | Se `true`, o botão ocupará 100% da largura do seu contêiner pai. |
| `isLoading` | `boolean` | `false` | Se `true`, exibe um `ActivityIndicator` no lugar do texto e desativa o botão. |
| `disabled` | `boolean` | `false` | Se `true`, o botão fica visualmente esmaecido e não pode ser pressionado. |
| `textSize` | `StyledTextVariant` | `undefined` | Permite customizar a variante de estilo do texto do `label` (prop vinda do `StyledText`). |
| `...props` | `TouchableOpacityProps` | - | Aceita todas as outras propriedades do `TouchableOpacity` do React Native, como `onPress`, `style`, `activeOpacity`, etc. |

---

## Como Usar

Primeiro, importe o componente no arquivo onde deseja usá-lo.

```jsx
import { Button } from '@/components/ui/common/Button';

<Button label="Clique Aqui" onPress={() => alert('Botão Pressionado!')} />
```

Para controlar as variantes, utilize a propriedade "variants".

```jsx

// Variante 'black'
<Button label="Confirmar" variant="black" />

// Variante 'secondary'
<Button label="Ver Detalhes" variant="secondary" />

// Variante 'outline' com borda
<Button label="Cancelar" variant="outline" />

// Variante 'danger' para ações destrutivas
<Button label="Excluir" variant="danger" />

// Variante 'empty' sem fundo ou borda
<Button label="Saber Mais" variant="empty" />

```

Para controlar o tamanho, utilize a propriedade "size".

```jsx

<Button label="Pequeno" variant="primary" size="sm" />

<Button label="Médio (Padrão)" variant="primary" size="md" />

<Button label="Grande" variant="primary" size="lg" />

```

Para fazer o botão ocupar todo o espaço disponível, utilize a propriedade "fullWidth".

```jsx

<Button label="Entrar" variant="primary" fullWidth={true} />

```

Além disso, também existe o estado de carregamento e disabled.

```jsx

// Estado de carregamento (exibe um spinner)
<Button label="Enviando..." isLoading={true} fullWidth />

// Estado desativado (não pode ser clicado)
<Button label="Salvo" disabled={true} fullWidth />

```