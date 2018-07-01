import BaseService from './BaseService'

const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB
const dbVersion = 1.0

class ImageCacheService extends BaseService {
  // returns promise for now
  static getObjectURL (key) {
    // giving it a name so we can recur
    const promiseFunction = async resolve => {
      var request = indexedDB.open('imageFiles', dbVersion)
      var db

      const createObjectStore = function (dataBase) {
        // Create an objectStore
        console.log('Creating objectStore')
        dataBase.createObjectStore('images')
      }

      const getImageFile = () => {
        attemptLoadFromDatabase(resolve, getImageFileFromServer)
      }

      const attemptLoadFromDatabase = (success, failure) => {
        // Open a transaction to the database
        const transaction = db.transaction(['images'], 'readonly')
        console.log('attempting to load from database')

        // Retrieve the file that was just stored
        const request = transaction.objectStore('images').get(key)
        request.onsuccess = function (event) {
          var imgFile = event.target.result
          console.log('Got image!' + imgFile)

          // Get window.URL object
          var URL = window.URL || window.webkitURL

          // Create and revoke ObjectURL
          var imgURL = URL.createObjectURL(imgFile)

          console.log('loaded from db successfully')
          success(imgURL)
        }

        request.onerror = failure
      }

      const getImageFileFromServer = function () {
        console.log('unable to load from db. trying server load')

        // Create XHR
        var xhr = new XMLHttpRequest()
        var blob

        xhr.open('GET', key, true)
        // Set the responseType to blob
        xhr.responseType = 'blob'

        xhr.addEventListener('load', function () {
          if (xhr.status === 200) {
            console.log('Image retrieved')

            // Blob as response
            blob = xhr.response
            console.log('Blob:' + blob)

            // Put the received blob into IndexedDB
            putImageInDatabase(blob)
          }
        }, false)
        // Send XHR
        xhr.send()
      }

      const putImageInDatabase = function (blob) {
        console.log('Putting images in IndexedDB')

        // Open a transaction to the database
        var transaction = db.transaction(['images'], 'readwrite')

        // Put the blob into the dabase
        transaction.objectStore('images').put(blob, key)

        // Retrieve the file that was just stored
        transaction.objectStore('images').get(key).onsuccess = function (event) {
          var imgFile = event.target.result
          console.log('Got elephant!' + imgFile)

          // Get window.URL object
          var URL = window.URL || window.webkitURL

          // Create and revoke ObjectURL
          var imgURL = URL.createObjectURL(imgFile)

          resolve(imgURL)
        }
      }

      request.onerror = function (event) {
        console.log('Error creating/accessing IndexedDB database', event)
      }

      request.onsuccess = function (event) {
        console.log('Success creating/accessing IndexedDB database', event)
        db = request.result

        db.onerror = function (event) {
          console.log('Error creating/accessing IndexedDB database', event)
        }

        // TODO investigate whether we really need this
        // Interim solution for Google Chrome to create an objectStore. Will be deprecated
        if (db.setVersion) {
          if (db.version !== dbVersion) {
            var setVersion = db.setVersion(dbVersion)
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
    // This promise lets us pretend to return in the 'ready' event.
    return new Promise(promiseFunction)
  }
}

export default ImageCacheService
