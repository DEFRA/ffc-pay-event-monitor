const getPaymentSubscriptionDetails = require('../service-bus')
const { getStorageDetails } = require('../storage')

module.exports = {
  method: 'GET',
  path: '/processing-monitor',
  options: {
    handler: async (request, h) => {
      const subscriptionDetails = await getPaymentSubscriptionDetails()
      const storageDetails = await getStorageDetails()
      console.log(subscriptionDetails, storageDetails)
      return h.view('processing-monitor', { subscriptionDetails, storageDetails })
    }
  }
}
