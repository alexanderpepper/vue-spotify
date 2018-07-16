import BaseService from './BaseService'

const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB
const dbVersion = 1.0

class ImageCacheService extends BaseService {
  static getObjectURL (key) {
    const promiseFunction = async resolve => {
      const request = indexedDB.open('imageFiles', dbVersion)
      let db

      const createObjectStore = function (dataBase) {
        dataBase.createObjectStore('images')
      }

      const getImageFile = () => {
        attemptLoadFromDatabase(resolve, getImageFileFromServer)
      }

      const attemptLoadFromDatabase = (success, failure) => {
        const transaction = db.transaction(['images'], 'readonly')
        const request = transaction.objectStore('images').get(key)
        request.onsuccess = function (event) {
          const imgFile = event.target.result
          if (imgFile) {
            const URL = window.URL || window.webkitURL
            const imgURL = URL.createObjectURL(imgFile)
            success(imgURL)
          } else {
            failure()
          }
        }
        request.onerror = failure
      }

      const getImageFileFromServer = function () {
        const xhr = new XMLHttpRequest()
        let blob
        xhr.open('GET', key, true)
        xhr.responseType = 'blob'
        xhr.addEventListener('load', function () {
          if (xhr.status === 200) {
            blob = xhr.response
            putImageInDatabase(blob)
          }
        }, false)
        xhr.send()
      }

      const putImageInDatabase = function (blob) {
        const transaction = db.transaction(['images'], 'readwrite')
        transaction.objectStore('images').put(blob, key)
        transaction.objectStore('images').get(key).onsuccess = function (event) {
          const imgFile = event.target.result
          const URL = window.URL || window.webkitURL
          const imgURL = URL.createObjectURL(imgFile)
          resolve(imgURL)
        }
      }

      request.onerror = function (event) {
        console.log('Error creating/accessing IndexedDB database', event)
      }

      request.onsuccess = function (event) {
        db = request.result

        db.onerror = function (event) {
          console.log('Error creating/accessing IndexedDB database', event)
        }

        // TODO investigate whether we really need this
        // Interim solution for Google Chrome to create an objectStore. Will be deprecated
        if (db.setVersion) {
          if (db.version !== dbVersion) {
            const setVersion = db.setVersion(dbVersion)
            setVersion.onsuccess = function () {
              createObjectStore(db)
              getImageFile()
            }
          } else {
            getImageFile()
          }
        } else {
          getImageFile()
        }
      }

      // For future use. Currently only in latest Firefox versions
      request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result)
      }
    }
    return new Promise(promiseFunction)
  }
}

export default ImageCacheService
