export type BaseResponse<T = unknown> = {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};
