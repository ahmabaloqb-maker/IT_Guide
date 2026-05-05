/**
 * JavaScript الرئيسي لـ IT Guide
 */

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 IT Guide - الصفحة الرئيسية');
    
    // تحميل المشاريع المميزة
    loadFeaturedProjects();
    
    // إعداد القائمة المتحركة
    setupMobileMenu();
    
    // إعداد التنقل السلس
    setupSmoothScroll();
    
    // تحديث الروابط النشطة
    updateActiveLinks();
});

/**
 * تحميل المشاريع المميزة
 */
function loadFeaturedProjects() {
    const container = document.getElementById('featuredProjects');
    if (!container) return;
    
    // تصفية المشاريع المميزة
    const featuredProjects = projects.filter(project => project.featured);
    
    if (featuredProjects.length === 0) {
        container.innerHTML = '<p>لا توجد مشاريع مميزة حالياً</p>';
        return;
    }
    
    // عرض أول 3 مشاريع مميزة
    const projectsToShow = featuredProjects.slice(0, 3);
    
    container.innerHTML = projectsToShow.map(project => `
        <div class="project-card">
            <div class="project-image">
                <i class="${project.icon}"></i>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-level ${getLevelClass(project.level)}">
                        ${getLevelName(project.level)}
                    </span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-footer">
                    <div class="project-stats">
                        <span><i class="fas fa-eye"></i> ${formatNumber(project.views)}</span>
                        <span><i class="fas fa-download"></i> ${formatNumber(project.downloads)}</span>
                        <span><i class="fas fa-heart"></i> ${formatNumber(project.likes)}</span>
                    </div>
                    <button class="btn btn-primary" onclick="viewProject(${project.id})">
                        <i class="fas fa-external-link-alt"></i> عرض
                    </button>
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
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

/**
 * إعداد التنقل السلس
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // تجاهل الروابط التي تؤدي لصفحات أخرى
            if (href === '#' || href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * تحديث الروابط النشطة
 */
function updateActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const linkHref = link.getAttribute('href');
        if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * عرض تفاصيل المشروع
 */
function viewProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        alert(`مشروع: ${project.title}\n\nسيتم تنفيذ صفحة التفاصيل في التحديثات القادمة`);
        // لاحقاً: نافذة منبثقة أو صفحة جديدة
    }
}

/**
 * إرسال نموذج الاتصال
 */
function submitContactForm(event) {
    event.preventDefault();
    alert('شكراً لتواصلك! سيتم الرد عليك قريباً.');
    event.target.reset();
}

// إضافة الدوال للـwindow للوصول من HTML
window.viewProject = viewProject;
window.submitContactForm = submitContactForm;