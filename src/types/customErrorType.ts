export interface CustomErrorType extends Error {
  status?: string;
  statusCode: number;
  code?: string;
}
