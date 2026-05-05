/**
 * JavaScript لصفحة المشاريع
 */

let currentFilters = { level: 'all', search: '' };
let currentPage = 1;
const projectsPerPage = 6;
let filteredProjects = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupFilters();
    setupSearch();
    setupPagination();
});

function loadProjects() {
    filteredProjects = filterProjects();
    const paginated = paginateProjects(filteredProjects);
    displayProjects(paginated);
    updateStats();
    updatePaginationButtons();
}

function filterProjects() {
    return projects.filter(project => {
        if (currentFilters.level !== 'all' && project.level !== currentFilters.level) return false;
        if (currentFilters.search) {
            const term = currentFilters.search.toLowerCase();
            const match = project.title.toLowerCase().includes(term) ||
                         project.description.toLowerCase().includes(term) ||
                         project.technologies.some(t => t.toLowerCase().includes(term));
            if (!match) return false;
        }
        return true;
    });
}

function paginateProjects(list) {
    const start = (currentPage - 1) * projectsPerPage;
    return list.slice(start, start + projectsPerPage);
}

function displayProjects(list) {
    const container = document.getElementById('projectsContainer');
    const noResults = document.getElementById('noResults');
    
    if (!list.length) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    container.innerHTML = list.map(project => `
        <div class="project-item">
            <div class="project-header">
                <h3>${project.title}</h3>
                <span class="project-level ${getLevelClass(project.level)}">${getLevelName(project.level)}</span>
            </div>
            <div class="project-body">
                <p>${project.description.substring(0, 120)}${project.description.length > 120 ? '...' : ''}</p>
                <div class="project-tech" style="margin: 0.5rem 0;">
                    ${project.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="project-stats" style="margin-bottom: 1rem;">
                    <span><i class="fas fa-eye"></i> ${formatNumber(project.views)}</span>
                    <span><i class="fas fa-download"></i> ${formatNumber(project.downloads)}</span>
                    <span><i class="fas fa-heart"></i> ${formatNumber(project.likes)}</span>
                </div>
                <a href="project-detail.html?id=${project.id}" class="view-project-btn">عرض التفاصيل</a>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    document.getElementById('projectCount').textContent = filteredProjects.length;
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    document.getElementById('pageInfo').textContent = `الصفحة ${currentPage} من ${totalPages || 1}`;
}

function setupFilters() {
    document.querySelectorAll('#levelFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#levelFilters .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilters.level = this.dataset.filter;
            currentPage = 1;
            loadProjects();
        });
    });
    
    document.getElementById('clearFilters').addEventListener('click', function() {
        currentFilters = { level: 'all', search: '' };
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('#levelFilters .filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === 'all');
        });
        currentPage = 1;
        loadProjects();
    });
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', function() {
        currentFilters.search = searchInput.value.trim();
        currentPage = 1;
        loadProjects();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            currentFilters.search = searchInput.value.trim();
            currentPage = 1;
            loadProjects();
        }
    });
}

function setupPagination() {
    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadProjects();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    document.getElementById('nextBtn').addEventListener('click', function() {
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadProjects();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || totalPages === 0;
}