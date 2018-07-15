import BaseService from './BaseService'
import api from '../constants/api.js'

class LibraryService extends BaseService {
  static get () {
    return this.GET(api.myLibrary)
  }

  static save (library) {
    return this.POST(api.myLibrary, library)
  }
}

export default LibraryService
