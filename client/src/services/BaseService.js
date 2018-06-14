import request from 'superagent'

const apiRequest = (request) => request
  .set('Authorization', window.localStorage['token'])
  .then(response => (response.body && response.body.results) || response.body)

class BaseService {
  static GET (url, query) {
    return apiRequest(request.get(url).query(query))
  }

  static POST (url, data) {
    return apiRequest(request.post(url).send(data))
  }

  static DELETE (url) {
    return apiRequest(request.delete(url))
  }

  static PUT (url, data) {
    return apiRequest(request.put(url).send(data))
  }

  static PATCH (url, data) {
    return apiRequest(request.patch(url).send(data))
  }
}

export default BaseService
