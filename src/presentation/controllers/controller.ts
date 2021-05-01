import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'

export interface Controller {
  handle: (request: HttpRequest) => Promise<HttpResponse>
}
