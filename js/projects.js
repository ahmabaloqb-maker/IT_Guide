/**
 * JavaScript لصفحة المشاريع
 */

// إعدادات التصفية
let currentFilters = {
    level: 'all',
    category: 'all',
    tech: 'all',
    search: '',
    sortBy: 'newest'
};

// إعدادات التقسيم
let currentPage = 1;
const projectsPerPage = 6;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📁 صفحة المشاريع جاهزة');
    
    // تحميل المشاريع
    loadProjects();
    
    // إعداد الفلاتر
    setupFilters();
    
    // إعداد البحث
    setupSearch();
    
    // إعداد الترتيب
    setupSorting();
    
    // إعداد التقسيم
    setupPagination();
    
    // تحميل من URL إذا وجد
    loadFromURL();
});

/**
 * تحميل وعرض المشاريع
 */
function loadProjects() {
    let filteredProjects = filterProjects();
    filteredProjects = sortProjects(filteredProjects);
    
    const paginatedProjects = paginateProjects(filteredProjects);
    
    displayProjects(paginatedProjects);
    updateStats(filteredProjects.length);
    updatePagination(filteredProjects.length);
}

/**
 * تصفية المشاريع حسب الفلاتر
 */
function filterProjects() {
    return projects.filter(project => {
        // فلترة بالمستوى
        if (currentFilters.level !== 'all' && project.level !== currentFilters.level) {
            return false;
        }
        
        // فلترة بالتخصص
        if (currentFilters.category !== 'all' && project.category !== currentFilters.category) {
            return false;
        }
        
        // فلترة بالتقنيات
        if (currentFilters.tech !== 'all') {
            const techs = project.technologies.map(t => t.toLowerCase());
            if (!techs.includes(currentFilters.tech)) {
                return false;
            }
        }
        
        // فلترة بالبحث
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const inTitle = project.title.toLowerCase().includes(searchTerm);
            const inDescription = project.description.toLowerCase().includes(searchTerm);
            const inTech = project.technologies.some(t => 
                t.toLowerCase().includes(searchTerm)
            );
            
            if (!(inTitle || inDescription || inTech)) {
                return false;
            }
        }
        
        return true;
    });
}

/**
 * ترتيب المشاريع
 */
function sortProjects(projectsList) {
    switch(currentFilters.sortBy) {
        case 'newest':
            // المفترض ترتيب حسب التاريخ، لكن حالياً نرجعها كما هي
            return [...projectsList];
            
        case 'popular':
            return [...projectsList].sort((a, b) => b.views - a.views);
            
        case 'downloads':
            return [...projectsList].sort((a, b) => b.downloads - a.downloads);
            
        case 'level':
            return [...projectsList].sort((a, b) => a.level - b.level);
            
        default:
            return projectsList;
    }
}

/**
 * تقسيم المشاريع للصفحات
 */
function paginateProjects(projectsList) {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return projectsList.slice(startIndex, endIndex);
}

/**
 * عرض المشاريع في الشبكة
 */
function displayProjects(projectsList) {
    const container = document.getElementById('projectsContainer');
    
    if (projectsList.length === 0) {
        document.getElementById('noResults').style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    document.getElementById('noResults').style.display = 'none';
    
    container.innerHTML = projectsList.map(project => `
        <div class="project-item" data-id="${project.id}">
            <div class="project-header">
                <h3>${project.title}</h3>
                <span class="project-level ${getLevelClass(project.level)}">
                    ${getLevelName(project.level)}
                </span>
            </div>
            
            <div class="project-body">
                <p class="project-description">${project.description}</p>
                
                <div class="project-tech">
                    ${project.technologies.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="project-footer">
                <div class="project-stats">
                    <span><i class="fas fa-eye"></i> ${formatNumber(project.views)}</span>
                    <span><i class="fas fa-download"></i> ${formatNumber(project.downloads)}</span>
                    <span><i class="fas fa-heart"></i> ${formatNumber(project.likes)}</span>
                </div>
                
                <button class="view-project-btn" onclick="viewProjectDetail(${project.id})">
                    <i class="fas fa-external-link-alt"></i> عرض التفاصيل
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * تحديث الإحصائيات
 */
function updateStats(total) {
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('filteredProjects').textContent = total;
}

/**
 * إعداد الفلاتر
 */
function setupFilters() {
    // فلاتر المستوى
    document.querySelectorAll('#levelFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#levelFilters .filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            currentFilters.level = this.dataset.filter;
            currentPage = 1;
            loadProjects();
            updateURL();
        });
    });
    
    // فلاتر التخصص
    document.querySelectorAll('#categoryFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.category === 'all') {
                // إذا كان "الكل"، أزل النشط من البقية
                document.querySelectorAll('#categoryFilters .filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
            } else {
                // أزل النشط من "الكل"
                document.querySelector('#categoryFilters .filter-btn[data-category="all"]')
                    .classList.remove('active');
            }
            
            this.classList.toggle('active');
            updateCategoryFilter();
            currentPage = 1;
            loadProjects();
            updateURL();
        });
    });
    
    // فلاتر التقنيات
    document.querySelectorAll('#techFilters .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.tech === 'all') {
                document.querySelectorAll('#techFilters .filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
            } else {
                document.querySelector('#techFilters .filter-btn[data-tech="all"]')
                    .classList.remove('active');
            }
            
            this.classList.toggle('active');
            updateTechFilter();
            currentPage = 1;
            loadProjects();
            updateURL();
        });
    });
    
    // زر مسح الفلاتر
    document.getElementById('clearFilters').addEventListener('click', function() {
        resetFilters();
        currentPage = 1;
        loadProjects();
        updateURL();
    });
}

/**
 * تحديث فلتر التخصص
 */
function updateCategoryFilter() {
    const activeCategories = Array.from(
        document.querySelectorAll('#categoryFilters .filter-btn.active')
    ).map(btn => btn.dataset.category);
    
    if (activeCategories.length === 0 || activeCategories.includes('all')) {
        currentFilters.category = 'all';
    } else {
        currentFilters.category = activeCategories[0];
    }
}

/**
 * تحديث فلتر التقنيات
 */
function updateTechFilter() {
    const activeTechs = Array.from(
        document.querySelectorAll('#techFilters .filter-btn.active')
    ).map(btn => btn.dataset.tech);
    
    if (activeTechs.length === 0 || activeTechs.includes('all')) {
        currentFilters.tech = 'all';
    } else {
        currentFilters.tech = activeTechs[0];
    }
}

/**
 * إعادة تعيين الفلاتر
 */
function resetFilters() {
    currentFilters = {
        level: 'all',
        category: 'all',
        tech: 'all',
        search: '',
        sortBy: 'newest'
    };
    
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'newest';
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector('#levelFilters .filter-btn[data-filter="all"]').classList.add('active');
    document.querySelector('#categoryFilters .filter-btn[data-category="all"]').classList.add('active');
    document.querySelector('#techFilters .filter-btn[data-tech="all"]').classList.add('active');
}

/**
 * إعداد البحث
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetSearchBtn = document.getElementById('resetSearch');
    
    searchBtn.addEventListener('click', function() {
        currentFilters.search = searchInput.value.trim();
        currentPage = 1;
        loadProjects();
        updateURL();
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            currentFilters.search = searchInput.value.trim();
            currentPage = 1;
            loadProjects();
            updateURL();
        }
    });
    
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            currentFilters.search = '';
            currentPage = 1;
            loadProjects();
            updateURL();
        });
    }
}

/**
 * إعداد الترتيب
 */
function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    
    sortSelect.addEventListener('change', function() {
        currentFilters.sortBy = this.value;
        loadProjects();
        updateURL();
    });
}

/**
 * إعداد التقسيم للصفحات
 */
function setupPagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadProjects();
            updateURL();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const totalProjects = projects.length;
        const totalPages = Math.ceil(totalProjects / projectsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            loadProjects();
            updateURL();
        }
    });
}

/**
 * تحديث أزرار التصفح
 */
function updatePagination(totalProjects) {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    pageInfo.textContent = `الصفحة ${currentPage} من ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

/**
 * تحديث URL مع الفلاتر
 */
function updateURL() {
    const params = new URLSearchParams();
    
    if (currentFilters.level !== 'all') params.set('level', currentFilters.level);
    if (currentFilters.category !== 'all') params.set('category', currentFilters.category);
    if (currentFilters.tech !== 'all') params.set('tech', currentFilters.tech);
    if (currentFilters.search) params.set('search', currentFilters.search);
    if (currentFilters.sortBy !== 'newest') params.set('sort', currentFilters.sortBy);
    if (currentPage > 1) params.set('page', currentPage);
    
    const newURL = params.toString() ? `projects.html?${params.toString()}` : 'projects.html';
    window.history.replaceState({}, '', newURL);
}

/**
 * تحميل الفلاتر من URL
 */
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('level')) {
        currentFilters.level = params.get('level');
        const levelBtn = document.querySelector(`#levelFilters .filter-btn[data-filter="${currentFilters.level}"]`);
        if (levelBtn) {
            document.querySelectorAll('#levelFilters .filter-btn').forEach(b => b.classList.remove('active'));
            levelBtn.classList.add('active');
        }
    }
    
    if (params.has('category')) {
        currentFilters.category = params.get('category');
        const categoryBtn = document.querySelector(`#categoryFilters .filter-btn[data-category="${currentFilters.category}"]`);
        if (categoryBtn) {
            document.querySelectorAll('#categoryFilters .filter-btn').forEach(b => b.classList.remove('active'));
            categoryBtn.classList.add('active');
        }
    }
    
    if (params.has('search')) {
        currentFilters.search = params.get('search');
        document.getElementById('searchInput').value = currentFilters.search;
    }
    
    if (params.has('sort')) {
        currentFilters.sortBy = params.get('sort');
        document.getElementById('sortSelect').value = currentFilters.sortBy;
    }
    
    if (params.has('page')) {
        currentPage = parseInt(params.get('page'));
    }
}

/**
 * عرض تفاصيل المشروع
 */
function viewProjectDetail(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        alert(`تفاصيل المشروع:\n\n${project.title}\n\n${project.description}\n\nالمستوى: ${getLevelName(project.level)}\nالتقنيات: ${project.technologies.join(', ')}`);
        // لاحقاً: نافذة منبثقة أو صفحة تفاصيل
    }
}

function createProjectElement(project) {
    // ... الكود السابق ...
    
    div.innerHTML = `
        <!-- ... الكود السابق ... -->
        <a href="project-detail.html?id=${project.id}" class="view-btn">
            <i class="fas fa-external-link-alt"></i> عرض
        </a>
        <!-- ... الكود السابق ... -->
    `;
    
    return div;
}

// إضافة الدوال للـwindow للوصول من HTML
window.viewProjectDetail = viewProjectDetail;