export type ModalPageWrapperProps = {
  children: React.ReactNode;
  isScrollable?: boolean;
  header?: {
    title: string;
    description: string;
    icon: React.ReactNode;
  };
  isVisible: boolean;
  onClose: () => void;
};
