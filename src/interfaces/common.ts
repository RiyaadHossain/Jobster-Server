import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  type?: string;
  errorMessages: IGenericErrorMessage[];
};

export type IFilters = { searchTerm?: string };

export type ISearch = { searchTerm?: string };
