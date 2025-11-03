export const validateEmail = (email: string) => {
  if (!email || email.length < 1 || !email.includes("@")) {
    throw new Error("Digite um email válido");
  }
};
