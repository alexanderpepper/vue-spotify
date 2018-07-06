import BaseService from './BaseService'
import api from '../constants/api.js'

class LibraryService extends BaseService {
  static get () {
    return this.GET(api.myLibrary)
  }

  static save (library) {
    return this.POST(api.myLibrary, library)
    // if (library.id) {
    //   return this.PATCH(api.library(library.id), library)
    // } else {
    //   return this.POST(api.library(), library)
    // }
  }
}

export default LibraryService
