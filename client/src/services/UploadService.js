import api from '../constants/api.js'
import request from 'superagent'
class UploadService {
  static uploadFile (file) {
    return request.post(api.uploadFile)
      .attach('file', file)
      .set('Authorization', window.localStorage['token'])
      .then(response => response.body.result.files.file[0].providerResponse.location)
      .catch(err => console.log(err))
  }
}

export default UploadService
