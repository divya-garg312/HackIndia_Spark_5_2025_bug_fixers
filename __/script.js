 // Global variables
 let lastAlertTime = 0;
 const ALERT_INTERVAL = 30000;
 let monitoringActive = true;
 let snoozeActive = false;
 let snoozeInterval = null;

 // Initialize when DOM is loaded
 document.addEventListener('DOMContentLoaded', function() {
     // Button elements
     const startBtn = document.getElementById('start-btn');
     const pauseBtn = document.getElementById('pause-btn');
     const snoozeBtn = document.getElementById('snooze-btn');
     
     // Initialize button states
     checkMonitoringStatus();
     
     // Add event listeners
     startBtn.addEventListener('click', startMonitoring);
     pauseBtn.addEventListener('click', pauseMonitoring);
     snoozeBtn.addEventListener('click', snoozeAlerts);
     
     // Start polling
     setInterval(pollServer, 3000);
 });

 function pauseMonitoring() {
     fetch('/pause_monitoring')
         .then(res => {
             if (!res.ok) throw new Error('Network response was not ok');
             return res.json();
         })
         .then(data => {
             console.log(data.status);
             checkMonitoringStatus();
         })
         .catch(error => {
             console.error('Error pausing monitoring:', error);
         });
 }
 
 // Update checkMonitoringStatus function
 function checkMonitoringStatus() {
     fetch('/get_monitoring_status')
 
 .then(res => {
     if (!res.ok) throw new Error('Network response was not ok');
     return res.json();
 })
 .then(data => {
     monitoringActive = data.monitoring_active;
     snoozeActive = data.snooze_active;
     
     const startBtn = document.getElementById('start-btn');
     const pauseBtn = document.getElementById('pause-btn');
     const snoozeBtn = document.getElementById('snooze-btn');
     
     if (monitoringActive) {
         startBtn.classList.add('btn-disabled');
         startBtn.disabled = true;
         pauseBtn.classList.remove('btn-disabled');
         pauseBtn.disabled = false;
         snoozeBtn.classList.remove('btn-disabled');
         snoozeBtn.disabled = false;
     } else {
         startBtn.classList.remove('btn-disabled');
         startBtn.disabled = false;
         pauseBtn.classList.add('btn-disabled');
         pauseBtn.disabled = true;
         snoozeBtn.classList.add('btn-disabled');
         snoozeBtn.disabled = true;
     }
     
     if (snoozeActive) {
         startSnoozeCountdown();
     }
 })
 .catch(error => {
     console.error('Error checking monitoring status:', error);
        });
}

const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
document.body.classList.toggle('dark-mode');
localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Mini Mode Toggle
const miniModeToggle = document.getElementById('mini-mode-toggle');
miniModeToggle.addEventListener('click', () => {
document.body.classList.toggle('mini-mode');
localStorage.setItem('miniMode', document.body.classList.contains('mini-mode'));
miniModeToggle.textContent = document.body.classList.contains('mini-mode') ? '🔲' : '🔍';

// Make mini mode draggable
if (document.body.classList.contains('mini-mode')) {
 makeDraggable();
}
});

// Check for saved preferences
if (localStorage.getItem('darkMode') === 'true') {
document.body.classList.add('dark-mode');
darkModeToggle.textContent = '☀️';
}

if (localStorage.getItem('miniMode') === 'true') {
document.body.classList.add('mini-mode');
miniModeToggle.textContent = '🔲';
makeDraggable();
}

// Make mini mode draggable
function makeDraggable() {
const miniContent = document.querySelector('.mini-mode-content');
let isDragging = false;
let offsetX, offsetY;

miniContent.addEventListener('mousedown', (e) => {
 isDragging = true;
 offsetX = e.clientX - miniContent.getBoundingClientRect().left;
 offsetY = e.clientY - miniContent.getBoundingClientRect().top;
 miniContent.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
 if (!isDragging) return;
 miniContent.style.left = `${e.clientX - offsetX}px`;
 miniContent.style.top = `${e.clientY - offsetY}px`;
 miniContent.style.right = 'auto';
 miniContent.style.bottom = 'auto';
});

document.addEventListener('mouseup', () => {
 isDragging = false;
 miniContent.style.cursor = 'grab';
});
}

// Update mini mode stats
function updateMiniStats() {
document.getElementById('mini-posture').textContent = 
 document.getElementById('posture-status').textContent;
document.getElementById('mini-focus').textContent = 
 document.getElementById('focus-time').textContent;
document.getElementById('mini-alerts').textContent = 
 parseInt(document.getElementById('posture-alerts').textContent) + 
 parseInt(document.getElementById('focus-alerts').textContent);
}

// Call this in your existing updateStats function
function updateStats() {
// Your existing stats update code...
updateMiniStats();
}

 // Sound for alerts
 const alertSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');

 function showAlert(message) {
     if (snoozeActive) return;
     
     const now = Date.now();
     if (now - lastAlertTime > ALERT_INTERVAL) {
         lastAlertTime = now;
         
         try {
             alertSound.play().catch(e => console.log("Audio play failed:", e));
         } catch (e) {
             console.log("Audio error:", e);
         }

         const alertBox = document.createElement('div');
         alertBox.className = 'alert-box';
         
         if (message.includes("Posture")) {
             alertBox.innerHTML = `<span class="alert-icon">🚨</span> ${message}`;
             alertBox.style.backgroundColor = '#ff3d00';
         } else if (message.includes("break")) {
             alertBox.innerHTML = `<span class="alert-icon">🧠</span> ${message}`;
             alertBox.style.backgroundColor = '#3f51b5';
         } else {
             alertBox.textContent = message;
         }
         
         document.body.appendChild(alertBox);

         setTimeout(() => {
             alertBox.style.opacity = '0';
             setTimeout(() => alertBox.remove(), 500);
         }, 8000);
     }
 }

 function checkMonitoringStatus() {
     fetch('/get_monitoring_status')
         .then(res => {
             if (!res.ok) throw new Error('Network response was not ok');
             return res.json();
         })
         .then(data => {
             monitoringActive = data.monitoring_active;
             snoozeActive = data.snooze_active;
             
             const startBtn = document.getElementById('start-btn');
             const snoozeBtn = document.getElementById('snooze-btn');
             
             if (monitoringActive) {
                 startBtn.classList.add('btn-disabled');
                 startBtn.disabled = true;
                 snoozeBtn.classList.remove('btn-disabled');
                 snoozeBtn.disabled = false;
             } else {
                 startBtn.classList.remove('btn-disabled');
                 startBtn.disabled = false;
                 snoozeBtn.classList.add('btn-disabled');
                 snoozeBtn.disabled = true;
             }
             
             if (snoozeActive) {
                 startSnoozeCountdown();
             }
         })
         .catch(error => {
             console.error('Error checking monitoring status:', error);
         });
 }

 function startMonitoring() {
     fetch('/start_monitoring')
         .then(res => {
             if (!res.ok) throw new Error('Network response was not ok');
             return res.json();
         })
         .then(data => {
             console.log(data.status);
             checkMonitoringStatus();
         })
         .catch(error => {
             console.error('Error starting monitoring:', error);
         });
 }

 function snoozeAlerts() {
     fetch('/snooze_alerts')
         .then(res => {
             if (!res.ok) throw new Error('Network response was not ok');
             return res.json();
         })
         .then(data => {
             console.log(data.status);
             startSnoozeCountdown(data.snooze_until);
         })
         .catch(error => {
             console.error('Error snoozing alerts:', error);
         });
 }

 function startSnoozeCountdown(snoozeUntil) {
     // Clear any existing interval
     if (snoozeInterval) {
         clearInterval(snoozeInterval);
     }
     
     const snoozeBtn = document.getElementById('snooze-btn');
     snoozeActive = true;
     snoozeBtn.classList.add('btn-disabled');
     snoozeBtn.disabled = true;
     
     let secondsLeft = Math.round(snoozeUntil - Date.now()/1000);
     
     function updateCountdown() {
         secondsLeft--;
         
         if (secondsLeft <= 0) {
             clearInterval(snoozeInterval);
             snoozeBtn.textContent = 'Snooze Alerts (5 min)';
             snoozeBtn.classList.remove('btn-disabled');
             snoozeBtn.disabled = false;
             snoozeActive = false;
             snoozeInterval = null;
         } else {
             snoozeBtn.textContent = `Snoozed (${Math.floor(secondsLeft/60)}:${(secondsLeft%60).toString().padStart(2, '0')})`;
         }
     }
     
     // Initial update
     updateCountdown();
     
     // Set interval for updates
     snoozeInterval = setInterval(updateCountdown, 1000);
 }

 function pollServer() {
     // Check for alerts
     fetch('/alert_status')
         .then(res => {
             if (!res.ok) throw new Error('Network response was not ok');
             return res.json();
         })
         .then(data => {
             if (data.alert && data.alert !== "none") {
                 showAlert(data.alert);
             }
         })
         .catch(error => {
             console.error('Error polling alerts:', error);
         });
     
     // Update stats
     updateStats();
 }

 function updateStats() {
     fetch('/get_stats')
         .then(res => {
             if (!res.ok) throw new Error('Network response was not ok');
             return res.json();
         })
         .then(data => {
             document.getElementById('posture-status').textContent = 
                 data.posture_status === 'good' ? 'Good Posture' : 'Poor Posture';
             document.getElementById('focus-time').textContent = formatTime(data.focus_time);
             document.getElementById('posture-alerts').textContent = data.posture_alerts;
             document.getElementById('focus-alerts').textContent = data.focus_alerts;
             
             document.getElementById('posture-bar').className = 
                 data.posture_status === 'good' ? 'progress-bar' : 'progress-bar bad-progress';
             document.getElementById('posture-bar').style.width = 
                 data.posture_status === 'good' ? '100%' : '30%';
             
             const focusPercent = Math.min(100, (data.focus_time / 1800) * 100);
             document.getElementById('focus-bar').style.width = `${focusPercent}%`;
         })
         .catch(error => {
             console.error('Error updating stats:', error);
         });
 }

 function formatTime(seconds) {
     const mins = Math.floor(seconds / 60);
     const secs = Math.floor(seconds % 60);
     return `${mins}:${secs.toString().padStart(2, '0')}`;
 }