export type BaseResponse<T = any> = {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
};
