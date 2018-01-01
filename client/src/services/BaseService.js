import request from 'superagent'

class BaseService {
  static GET (url, query) {
    return request.get(url)
      .query(query)
      .set('Authorization', window.localStorage['token'])
      .then(response => response.body)
  }

  static POST (url, data) {
    return request.post(url)
      .send(data)
      .set('Authorization', window.localStorage['token'])
      .then(response => response.body)
  }

  static DELETE (url) {
    return request.delete(url)
      .set('Authorization', window.localStorage['token'])
      .then(response => response.body)
  }

  static PUT (url, data) {
    return request.put(url)
      .send(data)
      .set('Authorization', window.localStorage['token'])
      .then(response => response.body)
  }

  static PATCH (url, data) {
    return request.patch(url)
      .send(data)
      .set('Authorization', window.localStorage['token'])
      .then(response => response.body)
  }
}

export default BaseService
