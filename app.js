// ═══════════════════════════════════════════════
//  Archie Mission Control v2 — App Logic
// ═══════════════════════════════════════════════

const AUTH_HASH = '6909a9b1bbd39f1f5843ba9ce587da14fed1d17d166ba27afe07b66fe9a19f99';
const GITHUB_OWNER = 'ArchieWrenless';
const GITHUB_REPO = 'mission-control';
const GITHUB_FILE = 'data.js';
const GITHUB_BRANCH = 'main';

// ─── State ───
let tasks = { backlog: [], 'in-progress': [], done: [] };
let fileSha = null; // GitHub file SHA for updates

// ═══════════════ INIT ═══════════════

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('mc_auth') === AUTH_HASH) {
        showDashboard();
    } else {
        showAuth();
    }
});

// ═══════════════ AUTH ═══════════════

function showAuth() {
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');

    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pw = document.getElementById('authPassword').value;
        const hash = await sha256(pw);

        if (hash === AUTH_HASH) {
            localStorage.setItem('mc_auth', AUTH_HASH);
            showDashboard();
        } else {
            const err = document.getElementById('authError');
            err.textContent = 'Incorrect access code';
            document.getElementById('authPassword').value = '';
            setTimeout(() => { err.textContent = ''; }, 3000);
        }
    });
}

async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// ═══════════════ DASHBOARD ═══════════════

function showDashboard() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Deep clone data from data.js
    tasks = JSON.parse(JSON.stringify(TASKS));

    renderAll();
    bindEvents();
    checkGatewayStatus(); // Initial check
    setInterval(checkGatewayStatus, 30000); // Check every 30 seconds
}

function renderAll() {
    renderKanban();
    renderActivity();
    renderMemory();
    updateStats();
}

// ═══════════════ GATEWAY STATUS ═══════════════

async function checkGatewayStatus() {
    const gatewayDot = document.querySelector('.gateway-dot');
    const gatewayLabel = document.querySelector('.gateway-label');
    
    if (!gatewayDot || !gatewayLabel) return;

    try {
        // Try localhost first (for local access)
        const response = await fetch('http://localhost:18789/api/v1/status', {
            method: 'GET',
            mode: 'cors',
            timeout: 5000
        }).catch(() => {
            // Fallback to LAN IP
            return fetch('http://192.168.1.163:18789/api/v1/status', {
                method: 'GET',
                mode: 'cors',
                timeout: 5000
            });
        });

        if (response && response.ok) {
            gatewayDot.classList.remove('offline');
            gatewayDot.classList.add('online');
            gatewayLabel.textContent = 'Gateway: Online';
        } else {
            throw new Error('Gateway not responding');
        }
    } catch (error) {
        gatewayDot.classList.remove('online');
        gatewayDot.classList.add('offline');
        gatewayLabel.textContent = 'Gateway: Offline';
    }
}

// ═══════════════ KANBAN ═══════════════

function renderKanban() {
    ['backlog', 'in-progress', 'done'].forEach(status => {
        const container = document.getElementById(status);
        const items = tasks[status] || [];

        container.innerHTML = items.map(task => {
            const moveButtons = buildMoveButtons(task.id, status);
            return `
                <div class="task-card" data-id="${task.id}">
                    <div class="task-title">${esc(task.title)}</div>
                    <div class="task-desc">${esc(task.description)}</div>
                    <div class="task-footer">
                        <span class="task-tag ${task.tag}">${task.tag}</span>
                        <div class="task-actions">
                            ${moveButtons}
                            <button class="task-action-btn danger" onclick="deleteTask('${task.id}','${status}')" title="Delete">✕</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update column counts
        const countMap = { backlog: 'countBacklog', 'in-progress': 'countInProgress', done: 'countDone' };
        const el = document.getElementById(countMap[status]);
        if (el) el.textContent = items.length;
    });
}

function buildMoveButtons(taskId, status) {
    const buttons = [];
    if (status === 'backlog') {
        buttons.push(`<button class="task-action-btn forward" onclick="moveTask('${taskId}','backlog','in-progress')" title="Move to In Progress">▸</button>`);
    } else if (status === 'in-progress') {
        buttons.push(`<button class="task-action-btn back" onclick="moveTask('${taskId}','in-progress','backlog')" title="Move to Backlog">◂</button>`);
        buttons.push(`<button class="task-action-btn forward" onclick="moveTask('${taskId}','in-progress','done')" title="Move to Done">▸</button>`);
    } else if (status === 'done') {
        buttons.push(`<button class="task-action-btn back" onclick="moveTask('${taskId}','done','in-progress')" title="Move to In Progress">◂</button>`);
    }
    return buttons.join('');
}

function moveTask(taskId, from, to) {
    const idx = tasks[from].findIndex(t => t.id === taskId);
    if (idx === -1) return;

    const [task] = tasks[from].splice(idx, 1);

    // Update completed date
    if (to === 'done' && !task.completed) {
        task.completed = new Date().toISOString().split('T')[0];
    } else if (to !== 'done') {
        delete task.completed;
    }

    tasks[to].unshift(task);
    renderKanban();
    updateStats();
    persistToGitHub();
}

function deleteTask(taskId, status) {
    if (!confirm('Delete this task?')) return;
    tasks[status] = tasks[status].filter(t => t.id !== taskId);
    renderKanban();
    updateStats();
    persistToGitHub();
}

function addTask(title, description, tag, column) {
    // Generate next task ID
    const allTasks = Object.values(tasks).flat();
    const maxNum = allTasks.reduce((max, t) => {
        const n = parseInt(t.id.replace('task-', ''), 10);
        return n > max ? n : max;
    }, 0);

    const newTask = {
        id: `task-${String(maxNum + 1).padStart(3, '0')}`,
        title,
        description,
        tag,
        created: new Date().toISOString().split('T')[0]
    };

    tasks[column].unshift(newTask);
    renderKanban();
    updateStats();
    persistToGitHub();
}

// ═══════════════ ACTIVITY ═══════════════

function renderActivity() {
    const container = document.getElementById('activityLog');
    container.innerHTML = ACTIVITY.map(item => `
        <div class="activity-item">
            <span class="activity-time">${item.time}</span>
            <span class="activity-date">${item.date}</span>
            <span class="activity-text">${esc(item.action)}</span>
            <span class="activity-type">${item.type}</span>
        </div>
    `).join('');
}

// ═══════════════ MEMORY ═══════════════

function renderMemory() {
    const container = document.getElementById('memoryPreview');
    container.innerHTML = MEMORY_SNAPSHOTS.map(item => `
        <div class="memory-card">
            <h4>${esc(item.title)}</h4>
            <p>${esc(item.content)}</p>
        </div>
    `).join('');
}

// ═══════════════ STATS ═══════════════

function updateStats() {
    const b = tasks.backlog.length;
    const ip = tasks['in-progress'].length;
    const d = tasks.done.length;
    const total = b + ip + d;

    setText('statTotal', total);
    setText('statBacklog', b);
    setText('statInProgress', ip);
    setText('statDone', d);
    setText('headerTotal', total);
    setText('headerDone', d);
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ═══════════════ GITHUB PERSISTENCE ═══════════════

async function persistToGitHub() {
    const pat = localStorage.getItem('mc_gh_pat');
    if (!pat) {
        showToast('Set your GitHub token in Settings to save changes', 'info');
        return;
    }

    const content = generateDataFile();
    const encoded = btoa(unescape(encodeURIComponent(content)));

    try {
        // First get current file SHA
        if (!fileSha) {
            const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}?ref=${GITHUB_BRANCH}`, {
                headers: {
                    'Authorization': `token ${pat}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (getRes.ok) {
                const data = await getRes.json();
                fileSha = data.sha;
            }
        }

        const body = {
            message: `Update tasks — ${new Date().toISOString()}`,
            content: encoded,
            branch: GITHUB_BRANCH
        };
        if (fileSha) body.sha = fileSha;

        const putRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (putRes.ok) {
            const result = await putRes.json();
            fileSha = result.content.sha;
            showToast('Saved to GitHub ✓', 'success');
        } else {
            const err = await putRes.json();
            console.error('GitHub save failed:', err);
            showToast('GitHub save failed — check console', 'error');
        }
    } catch (e) {
        console.error('GitHub save error:', e);
        showToast('Network error saving to GitHub', 'error');
    }
}

function generateDataFile() {
    const indent = '    ';

    function taskToStr(t, extra = '') {
        let s = `${indent}${indent}{\n`;
        s += `${indent}${indent}${indent}id: '${t.id}',\n`;
        s += `${indent}${indent}${indent}title: '${escQuote(t.title)}',\n`;
        s += `${indent}${indent}${indent}description: '${escQuote(t.description)}',\n`;
        s += `${indent}${indent}${indent}tag: '${t.tag}',\n`;
        s += `${indent}${indent}${indent}created: '${t.created}'`;
        if (t.completed) {
            s += `,\n${indent}${indent}${indent}completed: '${t.completed}'`;
        }
        s += `\n${indent}${indent}}`;
        return s;
    }

    function columnToStr(name, items) {
        if (items.length === 0) return `${indent}${name}: []`;
        return `${indent}${name}: [\n${items.map(t => taskToStr(t)).join(',\n')}\n${indent}]`;
    }

    let out = '// Task data - Archie will update this file\n';
    out += 'const TASKS = {\n';
    out += columnToStr('backlog', tasks.backlog) + ',\n';
    out += columnToStr("'in-progress'", tasks['in-progress']) + ',\n';
    out += columnToStr('done', tasks.done) + '\n';
    out += '};\n\n';

    // Preserve ACTIVITY and MEMORY_SNAPSHOTS as-is
    out += 'const ACTIVITY = ' + JSON.stringify(ACTIVITY, null, 4) + ';\n\n';
    out += 'const MEMORY_SNAPSHOTS = ' + JSON.stringify(MEMORY_SNAPSHOTS, null, 4) + ';\n';

    return out;
}

// ═══════════════ UI EVENTS ═══════════════

function bindEvents() {
    // Chat toggle
    const chatPanel = document.getElementById('chatPanel');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');

    // Start collapsed
    chatPanel.classList.add('collapsed');

    chatToggleBtn.addEventListener('click', () => {
        chatPanel.classList.toggle('collapsed');
    });

    chatCloseBtn.addEventListener('click', () => {
        chatPanel.classList.add('collapsed');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('mc_auth');
        location.reload();
    });

    // Settings modal
    const settingsModal = document.getElementById('settingsModal');
    document.getElementById('settingsBtn').addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        const stored = localStorage.getItem('mc_gh_pat') || '';
        document.getElementById('ghPatInput').value = stored;
        document.getElementById('patStatus').textContent = '';
    });

    document.getElementById('settingsCloseBtn').addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });

    document.getElementById('savePatBtn').addEventListener('click', () => {
        const val = document.getElementById('ghPatInput').value.trim();
        if (val) {
            localStorage.setItem('mc_gh_pat', val);
            fileSha = null; // Reset SHA when token changes
            const status = document.getElementById('patStatus');
            status.textContent = 'Token saved ✓';
            status.className = 'form-status success';
        }
    });

    document.getElementById('clearPatBtn').addEventListener('click', () => {
        localStorage.removeItem('mc_gh_pat');
        document.getElementById('ghPatInput').value = '';
        fileSha = null;
        const status = document.getElementById('patStatus');
        status.textContent = 'Token cleared';
        status.className = 'form-status error';
    });

    // Add task modal
    const addTaskModal = document.getElementById('addTaskModal');
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        addTaskModal.classList.remove('hidden');
        document.getElementById('newTaskTitle').value = '';
        document.getElementById('newTaskDesc').value = '';
        document.getElementById('newTaskTag').value = 'feature';
        document.getElementById('newTaskColumn').value = 'backlog';
        setTimeout(() => document.getElementById('newTaskTitle').focus(), 100);
    });

    document.getElementById('addTaskCloseBtn').addEventListener('click', () => {
        addTaskModal.classList.add('hidden');
    });

    addTaskModal.addEventListener('click', (e) => {
        if (e.target === addTaskModal) addTaskModal.classList.add('hidden');
    });

    document.getElementById('createTaskBtn').addEventListener('click', () => {
        const title = document.getElementById('newTaskTitle').value.trim();
        const desc = document.getElementById('newTaskDesc').value.trim();
        const tag = document.getElementById('newTaskTag').value;
        const column = document.getElementById('newTaskColumn').value;

        if (!title) {
            document.getElementById('newTaskTitle').focus();
            return;
        }

        addTask(title, desc || 'No description', tag, column);
        addTaskModal.classList.add('hidden');
        showToast('Task created ✓', 'success');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            settingsModal.classList.add('hidden');
            addTaskModal.classList.add('hidden');
        }
    });
}

// ═══════════════ TOAST ═══════════════

function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.save-toast').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = `save-toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ═══════════════ HELPERS ═══════════════

function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escQuote(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
