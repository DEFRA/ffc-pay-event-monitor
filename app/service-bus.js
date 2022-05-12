const { ServiceBusAdministrationClient } = require('@azure/service-bus')
const connectionString = 'Endpoint=sb://devffcinfsb1001.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=VtIWNv1+gCxUXlJEy6uYpKdMytycTLBWrE7xoWI/wxQ='

const getPaymentSubscriptionDetails = async () => {
  const enrichment = await getSubscriptionDetails('ffc-pay-request-dev', 'ffc-pay-enrichment')
  const paymentProcessing = await getSubscriptionDetails('ffc-pay-processing-dev', 'ffc-pay-processing')
  const paymentSubmission = await getSubscriptionDetails('ffc-pay-submit-dev', 'ffc-pay-submission')
  return { enrichment, paymentProcessing, paymentSubmission }
}

const getSubscriptionDetails = async (topicnName, subscriptionName) => {
  const serviceBusAdministrationClient = new ServiceBusAdministrationClient(connectionString)
  const subscriptionProperties = await serviceBusAdministrationClient.getSubscriptionRuntimeProperties(topicnName, subscriptionName)
  return { activeMessageCount: subscriptionProperties.activeMessageCount, deadLetterMessageCount: subscriptionProperties.deadLetterMessageCount }
}

module.exports = getPaymentSubscriptionDetails
