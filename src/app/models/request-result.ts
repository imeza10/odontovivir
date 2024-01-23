export interface RequestResult<T> {

  isSuccessful: boolean;
  isError: boolean;
  errorMessage: string;
  messages: string[];
  result: {};
}

export interface RequestResultPHP<T> {

  success: string;
  sql: string;
  encontradas: string;
  message: string;
  result: T[];
}