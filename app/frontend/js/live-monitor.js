const events = []

const addToElement = (event) => {
  const node = document.createElement('p')
  node.setAttribute('id', event.properties.id)
  const textnode = document.createTextNode(`${event.properties.action.timestamp} : ${event.name} (${event.properties.id}) - message: ${event.properties.action.message} - status: ${event.properties.status}`)
  node.appendChild(textnode)
  node.classList.add(event.properties.status === 'failed' ? 'line3' : 'line1')
  document.getElementById('commmand-screen').appendChild(node)
  document.getElementById(event.properties.id).addEventListener('click', (e) => {
    viewDetails(e.target.id)
  })
}

export function viewDetails (id) {
  const tempEvent = JSON.parse(JSON.stringify(events))
  const event = tempEvent.find(e => e.properties.id.toString() === id.toString())
  console.log('event', tempEvent)
  const eventDetails = JSON.stringify(event, null, 2)
  document.getElementById('event-details').innerHTML = eventDetails
}

export function filterEvent (id) {
  const search = document.getElementById('event-id-search')
  const filter = search.value.toUpperCase()
  const tempEvent = JSON.parse(JSON.stringify(events))
  const filteredEvents = tempEvent.filter(event => event.properties.id.toString().toUpperCase().includes(filter))

  document.getElementById('commmand-screen').innerHTML = ''

  if (filter.length > 0) {
    filteredEvents.forEach(event => {
      addToElement(event)
    })
  } else {
    events.forEach(event => {
      addToElement(event)
    })
  }
}

export function startMonitor (signalR) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:7071/api', { headers: { 'Access-Control-Allow-Origin': 'http://localhost:7071' } })
    .configureLogging(signalR.LogLevel.Information)
    .build()

  async function start () {
    const liveMonitor = document.getElementById('live-monitor')
    try {
      await connection.start()
      liveMonitor.style.display = 'block'
      console.log('SignalR Connected.')
    } catch (err) {
      console.log(err)
      liveMonitor.style.display = 'none'
      const liveMonitorMessage = document.getElementById('live-monitor-message')
      liveMonitorMessage.innerHTML = 'SignalR not connected.'
      setTimeout(start, 5000)
    }
  }

  connection.onclose(async () => {
    await start()
  })

  connection.on('payEvent', (data) => {
    events.push(data)
    addToElement(data)
  })

  start()
}
