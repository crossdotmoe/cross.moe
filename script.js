let ws = null;
let heartbeatInterval = null;

function startWebSocket() {
  ws = new WebSocket('wss://api.lanyard.rest/socket');

  ws.onopen = () => {
    console.log('[WS] Connected');
  };

  ws.onmessage = (message) => {
    let data = JSON.parse(message.data);

    if (data.op === 1) {
      heartbeatInterval = setInterval(() => {
        ws.send(JSON.stringify({ op: 3 }));
      }, data.d.heartbeat_interval);

      ws.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_ids: ["671727555945955358"]
        }
      }));
    }

    if (data.op === 0 && data.t === 'INIT_STATE') {
      console.log('[WS] INIT_STATE received');
      if (data.d["671727555945955358"].discord_status === "online") {
        document.getElementById('avatar').style.borderColor = "rgb(35, 165, 89)";
        document.getElementById('status').style.backgroundColor = "rgb(35, 165, 89)";
        document.getElementById('status-text').textContent = "Online"
      } else if (data.d["671727555945955358"].discord_status === "idle") {
        document.getElementById('avatar').style.borderColor = "rgb(240, 177, 50)";
        document.getElementById('status').style.backgroundColor = "rgb(240, 177, 50)";
        document.getElementById('status-text').textContent = "Away"
      } else if (data.d["671727555945955358"].discord_status === "dnd") {
        document.getElementById('avatar').style.borderColor = "rgb(242, 63, 66)";
        document.getElementById('status').style.backgroundColor = "rgb(242, 63, 66)";
        document.getElementById('status-text').textContent = "Busy"
      } else {
        document.getElementById('avatar').style.borderColor = "rgb(128, 132, 142)";
        document.getElementById('status').style.backgroundColor = "rgb(128, 132, 142)";
        document.getElementById('status-text').textContent = "Offline"
      }
    }

    if (data.op === 0 && data.t === 'PRESENCE_UPDATE') {
      console.log('[WS] PRESENCE_UPDATE received');
      if (data.d.discord_status === "online") {
        document.getElementById('avatar').style.borderColor = "rgb(35, 165, 89)";
        document.getElementById('status').style.backgroundColor = "rgb(35, 165, 89)";
        document.getElementById('status-text').textContent = "Online"
      } else if (data.d.discord_status === "idle") {
        document.getElementById('avatar').style.borderColor = "rgb(240, 177, 50)";
        document.getElementById('status').style.backgroundColor = "rgb(240, 177, 50)";
        document.getElementById('status-text').textContent = "Away"
      } else if (data.d.discord_status === "dnd") {
        document.getElementById('avatar').style.borderColor = "rgb(242, 63, 66)";
        document.getElementById('status').style.backgroundColor = "rgb(242, 63, 66)";
        document.getElementById('status-text').textContent = "Busy"
      } else {
        document.getElementById('avatar').style.borderColor = "rgb(128, 132, 142)";
        document.getElementById('status').style.backgroundColor = "rgb(128, 132, 142)";
        document.getElementById('status-text').textContent = "Offline"
      }
    }
  };

  ws.onerror = (error) => {
    console.error('[WS] Error: ', error);
  };

  ws.onclose = (event) => {
    console.log('[WS] Connection closed: ', event);

    if (heartbeatInterval) {
      console.log('[WS] Clearing heartbeat interval');
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }

    console.log('[WS] Attempting reconnect in 5 seconds');
    setTimeout(startWebSocket, 5000);
  };
}

function createConfetti() {
  let defaults = { startVelocity: 30, spread: 360, ticks: 200, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  setInterval(function() {
      let currentDate = new Date();
      let startDate = new Date(currentDate.getFullYear(), 11, 4);
      
      if (currentDate.getMonth() === startDate.getMonth() && currentDate.getDate() === startDate.getDate()) {
      let particleCount = 120;

      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }
  }, 250);
}

startWebSocket();
createConfetti();