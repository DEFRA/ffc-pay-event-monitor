const { getStorageDetails, getFileDetails, downloadPaymentFile } = require('../storage')

module.exports = {
  method: 'GET',
  path: '/storage-details',
  options: {
    handler: async (request, h) => {
      let fileDetails = {}
      let fileContent = {}
      const filename = request.query.filename
      const prefix = request.query.prefix
      const storageDetails = await getStorageDetails()
      console.log(storageDetails)
      if (filename) {
        fileDetails = await getFileDetails(prefix, filename)
        fileContent = await downloadPaymentFile(prefix, filename)
        console.log(fileContent)
      }
      return h.view('storage-details', { storageDetails, fileDetails, fileContent })
    }
  }
}
