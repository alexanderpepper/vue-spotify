import BaseService from './BaseService'
import api from '../constants/api.js'

class LibraryService extends BaseService {
  static get () {
    return this.GET(api.library)
  }

  static save (library) {
    return this.POST(api.library, library)
  }
}

export default LibraryService
