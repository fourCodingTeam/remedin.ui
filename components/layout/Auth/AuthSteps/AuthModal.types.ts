export type AuthModalProps = {
  isVisible: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onGoogleLogin?: () => void;
};

export type AuthViewProps = {
  onClose: () => void;
};

export interface AuthLoginProps extends AuthViewProps {
  onGoogleLogin?: () => void;
}

export interface AuthRegisterProps extends AuthViewProps {}
