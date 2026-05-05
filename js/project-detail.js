/**
 * JavaScript لصفحة تفاصيل المشروع
 */

let currentProject = null;
let currentProjectId = null;

document.addEventListener('DOMContentLoaded', function() {
    getProjectIdFromURL();
    if (currentProjectId) {
        loadProject();
    } else {
        showNotFound();
    }
});

function getProjectIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    currentProjectId = parseInt(params.get('id'));
}

function loadProject() {
    currentProject = projects.find(p => p.id === currentProjectId);
    
    if (!currentProject) {
        showNotFound();
        return;
    }
    
    displayProject();
    updateViewCount();
}

function displayProject() {
    const container = document.getElementById('projectContent');
    
    container.innerHTML = `
        <div class="project-card-detail">
            <h1 class="project-title-detail">${currentProject.title}</h1>
            
            <div class="project-meta">
                <span><i class="fas fa-graduation-cap"></i> ${getLevelName(currentProject.level)}</span>
                <span><i class="fas fa-tags"></i> ${getCategoryName(currentProject.category)}</span>
                <span><i class="fas fa-calendar"></i> ${currentProject.createdAt || '2024'}</span>
            </div>
            
            <div class="project-description-detail">
                <h3>📝 وصف المشروع</h3>
                <p>${currentProject.description}</p>
            </div>
            
            <div class="tech-section">
                <h3>🛠️ التقنيات المستخدمة</h3>
                <div class="tech-list">
                    ${currentProject.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="stats-section">
                <div class="stat-item">
                    <i class="fas fa-eye"></i>
                    <span class="number" id="viewCount">${formatNumber(currentProject.views)}</span>
                    <span>مشاهدة</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-download"></i>
                    <span class="number" id="downloadCount">${formatNumber(currentProject.downloads)}</span>
                    <span>تحميل</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-heart"></i>
                    <span class="number" id="likeCount">${formatNumber(currentProject.likes)}</span>
                    <span>إعجاب</span>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="downloadProject()">
                    <i class="fas fa-download"></i> تحميل المشروع
                </button>
                <button class="btn btn-secondary" onclick="likeProject()" id="likeBtn">
                    <i class="far fa-heart"></i> أعجبني
                </button>
                ${currentProject.projectURL ? `<a href="${currentProject.projectURL}" target="_blank" class="btn btn-primary"><i class="fas fa-globe"></i> العرض الحي</a>` : ''}
                ${currentProject.githubURL ? `<a href="${currentProject.githubURL}" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> GitHub</a>` : ''}
            </div>
        </div>
    `;
}

function updateViewCount() {
    if (currentProject) {
        currentProject.views++;
        const viewSpan = document.getElementById('viewCount');
        if (viewSpan) viewSpan.textContent = formatNumber(currentProject.views);
        saveProjectsToStorage();
    }
}

function downloadProject() {
    if (currentProject) {
        currentProject.downloads++;
        const downloadSpan = document.getElementById('downloadCount');
        if (downloadSpan) downloadSpan.textContent = formatNumber(currentProject.downloads);
        saveProjectsToStorage();
        alert(`جاري تحميل مشروع: ${currentProject.title}\n\nملاحظة: في النسخة الحالية، يتم حفظ المشروع في المتصفح فقط. يمكنك نسخ الكود من المشاريع الأخرى.`);
    }
}

function likeProject() {
    if (currentProject) {
        currentProject.likes++;
        const likeSpan = document.getElementById('likeCount');
        const likeBtn = document.getElementById('likeBtn');
        if (likeSpan) likeSpan.textContent = formatNumber(currentProject.likes);
        if (likeBtn) likeBtn.innerHTML = '<i class="fas fa-heart"></i> تم الإعجاب';
        saveProjectsToStorage();
        alert('شكراً لإعجابك بالمشروع!');
    }
}

function showNotFound() {
    const container = document.getElementById('projectContent');
    container.innerHTML = `
        <div class="not-found">
            <i class="fas fa-search" style="font-size: 3rem; color: var(--gray);"></i>
            <h2>عذراً، لم نجد المشروع</h2>
            <p>المشروع الذي تبحث عنه غير موجود أو تم حذفه</p>
            <a href="projects.html" class="btn btn-primary">تصفح المشاريع</a>
        </div>
    `;
}

window.downloadProject = downloadProject;
window.likeProject = likeProject;