export interface HttpRequest {
  body?: any;
  params: { [key: string]: string };
}

export interface HttpResponse {
  statusCode: number;
  body?: any;
}
