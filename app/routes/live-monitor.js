module.exports = {
  method: 'GET',
  path: '/live-monitor',
  options: {
    handler: (request, h) => {
      return h.view('live-monitor')
    }
  }
}
