export type AuthModalProps = {
  isVisible: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onGoogleLogin?: () => void;
  onPersonNotFound?: (email: string, token: string) => void;
};

export type AuthViewProps = {
  onClose: () => void;
};

export interface AuthLoginProps extends AuthViewProps {
  onGoogleLogin?: () => void;
  onPersonNotFound?: (email: string, token: string) => void;
}

export interface AuthRegisterProps extends AuthViewProps {}
