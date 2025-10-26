export interface AuthModalProps {
  isVisible: boolean;

  onClose: () => void;
}

export interface AuthViewProps {
  onClose: () => void;
}

export interface AuthLoginProps extends AuthViewProps {
  onNavigateToRegister: () => void;
}

export interface AuthRegisterProps extends AuthViewProps {
  onNavigateToLogin: () => void;
}
