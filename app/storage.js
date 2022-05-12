const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./storage-config')
let blobServiceClient
let containersInitialised

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const containerBatch = blobServiceClient.getContainerClient(config.container)

async function initialiseContainers () {
  console.log('Making sure blob containers exist')
  await containerBatch.createIfNotExists()
  await initialiseFolders()
  containersInitialised = true
}

async function initialiseFolders () {
  const placeHolderText = 'Placeholder'
  const inboundClient = containerBatch.getBlockBlobClient(`${config.inboundFolder}/default.txt`)
  const archiveClient = containerBatch.getBlockBlobClient(`${config.archiveFolder}/default.txt`)
  const quarantineClient = containerBatch.getBlockBlobClient(`${config.quarantineFolder}/default.txt`)
  await inboundClient.upload(placeHolderText, placeHolderText.length)
  await archiveClient.upload(placeHolderText, placeHolderText.length)
  await quarantineClient.upload(placeHolderText, placeHolderText.length)
}

async function getBlob (folder, filename) {
  containersInitialised ?? await initialiseContainers()
  return containerBatch.getBlockBlobClient(`${folder}/${filename}`)
}

async function getFileList (prefix) {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  for await (const file of containerBatch.listBlobsFlat({ prefix })) {
    if (file.name.endsWith('.dat')) {
      fileList.push(file.name.replace(`${prefix}/`, ''))
    }
  }

  return { prefix, fileList }
}

async function getStorageDetails () {
  const batchInbound = await getFileList(config.inboundFolder)
  const batchArchive = await getFileList(config.archiveFolder)
  const batchQuarantine = await getFileList(config.quarantineFolder)

  return { batchInbound, batchArchive, batchQuarantine }
}

async function getFileDetails (prefix, filename) {
  const blob = await getBlob(prefix, filename)
  return blob.getProperties()
}

async function downloadPaymentFile (prefix, filename) {
  const blob = await getBlob(prefix, filename)
  const blobBuffer = await blob.downloadToBuffer()
  return blobBuffer.toString('utf-8')
}

module.exports = {
  getStorageDetails,
  getFileDetails,
  getFileList,
  downloadPaymentFile
}
