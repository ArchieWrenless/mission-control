// Mission Control App
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    renderActivity();
    renderMemory();
    updateStats();
    updateTimestamp();
});

function renderTasks() {
    const columns = ['backlog', 'in-progress', 'done'];
    
    columns.forEach(status => {
        const container = document.getElementById(status);
        const tasks = TASKS[status] || [];
        
        container.innerHTML = tasks.map(task => `
            <div class="task-card" data-id="${task.id}">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">${task.description}</div>
                <span class="task-tag ${task.tag}">${task.tag}</span>
            </div>
        `).join('');
    });
}

function renderActivity() {
    const container = document.getElementById('activityLog');
    
    container.innerHTML = ACTIVITY.map(item => `
        <div class="activity-item">
            <span class="time">${item.time}</span>
            <span class="action">${item.action}</span>
        </div>
    `).join('');
}

function renderMemory() {
    const container = document.getElementById('memoryPreview');
    
    container.innerHTML = MEMORY_SNAPSHOTS.map(item => `
        <div class="memory-card">
            <h4>${item.title}</h4>
            <p>${item.content}</p>
        </div>
    `).join('');
}

function updateStats() {
    const total = Object.values(TASKS).flat().length;
    const inProgress = TASKS['in-progress']?.length || 0;
    const done = TASKS['done']?.length || 0;
    
    document.getElementById('tasksTotal').textContent = total;
    document.getElementById('tasksInProgress').textContent = inProgress;
    document.getElementById('tasksDone').textContent = done;
    
    // Calculate days active (from Jan 27, 2026)
    const startDate = new Date('2026-01-27');
    const today = new Date();
    const daysActive = Math.max(1, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)));
    document.getElementById('daysActive').textContent = daysActive;
}

function updateTimestamp() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    document.getElementById('lastUpdated').textContent = `Last updated: ${timeStr}`;
}

// Auto-refresh every 30 seconds
setInterval(() => {
    updateTimestamp();
}, 30000);
