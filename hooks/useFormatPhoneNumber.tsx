const PHONE_FORMAT_REGEX = /(\d{2})(\d{5})(\d{4})/;

export function useFormatPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(PHONE_FORMAT_REGEX, "($1) $2-$3");
}
