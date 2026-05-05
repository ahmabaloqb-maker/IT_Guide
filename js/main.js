/**
 * JavaScript الرئيسي لـ IT Guide
 */

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 IT Guide - الصفحة الرئيسية');
    
    // تحديث الإحصائيات
    updateStats();
    
    // تحميل المشاريع المميزة
    loadFeaturedProjects();
    
    // إعداد القائمة المتحركة
    setupMobileMenu();
    
    // تحديث الروابط النشطة
    updateActiveLinks();
});

/**
 * تحديث الإحصائيات
 */
function updateStats() {
    const totalProjects = projects.length;
    const students = studentsCount;
    const totalDownloads = calculateTotalDownloads();
    
    const statProjects = document.getElementById('statProjects');
    const statStudents = document.getElementById('statStudents');
    const statDownloads = document.getElementById('statDownloads');
    
    if (statProjects) statProjects.textContent = formatNumber(totalProjects);
    if (statStudents) statStudents.textContent = formatNumber(students);
    if (statDownloads) statDownloads.textContent = formatNumber(totalDownloads);
}

/**
 * تحميل المشاريع المميزة
 */
function loadFeaturedProjects() {
    const container = document.getElementById('featuredProjects');
    if (!container) return;
    
    // المشاريع المميزة (أول 3 مشاريع أو أحدثها)
    const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
    
    if (featuredProjects.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">لا توجد مشاريع حالياً. كن أول من يرفع مشروع!</p>';
        return;
    }
    
    container.innerHTML = featuredProjects.map(project => `
        <div class="project-card">
            <div class="project-image">
                <i class="${project.icon || 'fas fa-code'}"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-level ${getLevelClass(project.level)}">${getLevelName(project.level)}</span>
                <p class="project-description">${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-footer">
                    <div class="project-stats">
                        <span><i class="fas fa-eye"></i> ${formatNumber(project.views)}</span>
                        <span><i class="fas fa-download"></i> ${formatNumber(project.downloads)}</span>
                        <span><i class="fas fa-heart"></i> ${formatNumber(project.likes)}</span>
                    </div>
                    <a href="project-detail.html?id=${project.id}" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> عرض
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * إعداد القائمة المتحركة للجوال
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

/**
 * تحديث الروابط النشطة
 */
function updateActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.remove('active');
        if (currentPage === 'index.html' && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}

// تحديث الإحصائيات عند تحميل الصفحة
window.updateStats = updateStats;