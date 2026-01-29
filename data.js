// Task data - Archie will update this file
const TASKS = {
    backlog: [
        {
            id: 'task-008',
            title: 'Family Finance App',
            description: 'Multi-account banking, multi-job income, tax liability, budgeting. Plaid integration.',
            tag: 'feature',
            created: '2026-01-27'
        },
        {
            id: 'task-010',
            title: 'Church Devotional Framework',
            description: 'White-label daily devotional platform for churches. Custom branding, content management, user progress tracking. SaaS model.',
            tag: 'feature',
            created: '2026-01-27'
        },
        {
            id: 'task-001',
            title: 'Set up audio transcription',
            description: 'Install whisper or similar for voice message support',
            tag: 'setup',
            created: '2026-01-27'
        },
        {
            id: 'task-007',
            title: 'Build first n8n workflow',
            description: 'n8n is live at https://n8n.halsey.io - pick a project and build it',
            tag: 'feature',
            created: '2026-01-28'
        },
        {
            id: 'task-012',
            title: 'RDP troubleshooting',
            description: 'Brett cannot RDP to DESKTOP-NBLM58S. Server-side looks fine — likely client-side or password issue. Needs follow-up.',
            tag: 'setup',
            created: '2026-01-28'
        },
        {
            id: 'task-018',
            title: 'DevOps learning: Kubernetes + FinOps',
            description: 'Deep dive into K8s cost optimization with Kubecost/OpenCost. Build demo cluster with resource tracking dashboard. Perfect timing with 2026 AI+K8s trends.',
            tag: 'learning',
            created: '2026-01-29'
        }
    ],
    'in-progress': [],
    done: [
        {
            id: 'task-017',
            title: 'VMware SRM Decommissioning Script',
            description: 'Built Remove-SRMServer PowerShell function. Removes VM from SRM, deletes protection groups/recovery plans/datastores if last VM. Full safety features, comprehensive docs. Emailed to Brett.',
            tag: 'feature',
            created: '2026-01-29',
            completed: '2026-01-29'
        },
        {
            id: 'task-016',
            title: 'Mission Control v2',
            description: 'Enhanced dashboard with auth wall, interactive kanban, GitHub persistence, usage stats, chat placeholder. Phase 2 foundation.',
            tag: 'feature',
            created: '2026-01-28',
            completed: '2026-01-28'
        },
        {
            id: 'task-011',
            title: 'Set up Gmail for Archie',
            description: 'Archie.wrenless@gmail.com — app password configured, nodemailer installed, test email sent successfully.',
            tag: 'setup',
            created: '2026-01-27',
            completed: '2026-01-28'
        },
        {
            id: 'task-013',
            title: 'Daily letter reminder',
            description: 'Set up 3 PM EST daily cron reminder for Brett to write letters to friends who impacted him.',
            tag: 'automation',
            created: '2026-01-28',
            completed: '2026-01-28'
        },
        {
            id: 'task-014',
            title: 'YouTube learning resources',
            description: 'Found tutorials for VS Code + GitHub integration and Git/GitHub fundamentals.',
            tag: 'learning',
            created: '2026-01-28',
            completed: '2026-01-28'
        },
        {
            id: 'task-015',
            title: 'Identity update — Archie Wrenless',
            description: 'Got a last name! Updated IDENTITY.md.',
            tag: 'milestone',
            created: '2026-01-28',
            completed: '2026-01-28'
        },
        {
            id: 'task-004',
            title: 'Initial setup & bootstrap',
            description: 'First conversation, identity established, workspace configured',
            tag: 'setup',
            created: '2026-01-27',
            completed: '2026-01-27'
        },
        {
            id: 'task-005',
            title: 'Configure full exec access',
            description: 'Set tools.exec.security to full - no more approval popups',
            tag: 'setup',
            created: '2026-01-27',
            completed: '2026-01-27'
        },
        {
            id: 'task-003',
            title: 'Build Mission Control dashboard',
            description: 'Create a visual dashboard for tracking Archie activity',
            tag: 'feature',
            created: '2026-01-27',
            completed: '2026-01-27'
        },
        {
            id: 'task-006',
            title: 'Create n8n + AI learning package',
            description: 'Research and compile YouTube tutorials, project ideas, and resources',
            tag: 'feature',
            created: '2026-01-27',
            completed: '2026-01-27'
        }
    ]
};

const ACTIVITY = [
    { time: '08:15', date: '2026-01-29', action: 'Morning brief delivered manually (cron missed run)', type: 'automation' },
    { time: '08:11', date: '2026-01-29', action: 'Emailed SRM script to Brett.m.halsey@gmail.com', type: 'feature' },
    { time: '08:06', date: '2026-01-29', action: 'VMware SRM decommissioning script completed — Remove-SRMServer.ps1 ✅', type: 'milestone' },
    { time: '08:00', date: '2026-01-29', action: 'Switched to Opus for complex SRM script development', type: 'setup' },
    { time: '07:58', date: '2026-01-29', action: 'Configured Sonnet → Opus escalation strategy', type: 'setup' },
    { time: '07:56', date: '2026-01-29', action: 'Discord channel enabled and tested', type: 'setup' },
    { time: '14:05', date: '2026-01-28', action: 'Mission Control v2 deployed — auth, task mgmt, dark theme ✅', type: 'milestone' },
    { time: '13:54', date: '2026-01-28', action: 'Published Mission Control to GitHub Pages', type: 'feature' },
    { time: '13:27', date: '2026-01-28', action: 'Switched to Sonnet default + Opus for heavy lifting', type: 'setup' },
    { time: '12:28', date: '2026-01-28', action: 'Airbnb search — Savannah trip for wife (Feb 26-Mar 1)', type: 'research' },
    { time: '09:59', date: '2026-01-28', action: 'Gmail test email sent successfully ✅', type: 'milestone' },
    { time: '09:42', date: '2026-01-28', action: 'Mission Control updated — timezone fix, task sync', type: 'maintenance' },
    { time: '08:57', date: '2026-01-28', action: 'Gmail setup — Archie.wrenless@gmail.com configured', type: 'setup' },
    { time: '08:47', date: '2026-01-28', action: 'Named: Archie Wrenless — IDENTITY.md updated', type: 'milestone' },
    { time: '08:25', date: '2026-01-28', action: 'RDP diagnosis — server-side OK, needs client follow-up', type: 'setup' },
    { time: '08:04', date: '2026-01-28', action: 'Set up daily 3PM EST letter-writing reminder', type: 'automation' },
    { time: '07:46', date: '2026-01-28', action: 'Found YouTube tutorials for VS Code + GitHub, Git basics', type: 'learning' },
    { time: '17:50', date: '2026-01-27', action: 'Built Get-ServerInventory PowerShell function', type: 'feature' },
    { time: '16:46', date: '2026-01-27', action: 'Set up daily morning brief (7am EST)', type: 'automation' },
    { time: '16:44', date: '2026-01-27', action: 'Added Church Devotional Framework to backlog', type: 'planning' },
    { time: '16:31', date: '2026-01-27', action: 'Added Family Finance App to backlog', type: 'planning' },
    { time: '14:38', date: '2026-01-27', action: 'n8n + AI Starter Pack completed', type: 'feature' },
    { time: '14:35', date: '2026-01-27', action: 'Got to know Brett - updated USER.md', type: 'memory' },
    { time: '14:08', date: '2026-01-27', action: 'Mission Control created', type: 'feature' },
    { time: '14:04', date: '2026-01-27', action: 'Bootstrap complete - Archie online', type: 'milestone' }
];

const MEMORY_SNAPSHOTS = [
    {
        title: "Day 3 — Jan 29, 2026",
        content: "Built VMware SRM decommissioning script (Remove-SRMServer). Configured model strategy: Sonnet default, Opus for complex tasks. Discord channel active. Morning brief delivered manually."
    },
    {
        title: "Day 2 — Jan 28, 2026",
        content: "Got a last name: Archie Wrenless. Gmail set up and working. Found learning videos for Brett. Letter reminder cron running. RDP needs follow-up."
    },
    {
        title: "About Brett",
        content: "Platform engineer → devops transition • PowerShell, VMware, Windows • Learning GitHub Actions, Terraform, VS Code • Married Oct 2025, stepsons Lake (8) & Boone (7) • Email: Brett.m.halsey@gmail.com • Timezone: EST (Lakeland, FL)"
    }
];
