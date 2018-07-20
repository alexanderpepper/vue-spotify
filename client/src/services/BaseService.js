import request from 'superagent'
import Throttle from 'superagent-throttle'

const throttle = new Throttle({
  active: true, // set false to pause queue
  rate: 10, // how many requests can be sent every `ratePer`
  ratePer: 1000, // number of ms in which `rate` requests may be sent
  concurrent: 2 // how many requests can be sent concurrently
})

const apiRequest = (request) => request
  .set('Authorization', window.localStorage['token'])
  .then(response => (response.body && response.body.results) || response.body)

class BaseService {
  static GET (url, query) {
    return apiRequest(request.get(url).query(query))
  }

  static GET_THROTTLED (url, query) {
    return apiRequest(request.get(url).query(query).use(throttle.plugin()))
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
