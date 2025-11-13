export type ModalBaseProps = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  button: {
    label: string;
    variant:
      | "primary"
      | "secondary"
      | "danger"
      | "neutral"
      | "outline"
      | "empty";
    onPress: () => void;
  }[];
  children?: React.ReactNode;
};
