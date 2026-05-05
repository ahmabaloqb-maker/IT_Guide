/**
 * بيانات المشاريع - تبدأ فارغة وتمتلئ بمشاريع الطلاب
 */

// مصفوفة المشاريع (تبدأ فارغة)
let projects = [];

// إحصائيات إضافية
let studentsCount = 0;
let totalDownloads = 0;

/**
 * تحميل المشاريع من localStorage
 */
function loadProjectsFromStorage() {
    const saved = localStorage.getItem('itguide_projects');
    if (saved) {
        projects = JSON.parse(saved);
    } else {
        projects = [];
    }
    
    const savedStudents = localStorage.getItem('itguide_students');
    if (savedStudents) {
        studentsCount = parseInt(savedStudents);
    } else {
        studentsCount = 0;
    }
}

/**
 * حفظ المشاريع في localStorage
 */
function saveProjectsToStorage() {
    localStorage.setItem('itguide_projects', JSON.stringify(projects));
    localStorage.setItem('itguide_students', studentsCount);
}

/**
 * إضافة مشروع جديد
 */
function addProject(project) {
    const newProject = {
        id: Date.now(),
        ...project,
        views: 0,
        downloads: 0,
        likes: 0,
        featured: projects.length === 0, // أول مشروع يصبح مميزاً
        createdAt: new Date().toISOString().split('T')[0]
    };
    projects.push(newProject);
    
    // زيادة عدد الطلاب
    studentsCount++;
    
    saveProjectsToStorage();
    return newProject;
}

/**
 * تحديث إحصائيات المشروع
 */
function updateProjectStats(projectId, type) {
    const project = projects.find(p => p.id == projectId);
    if (project) {
        if (type === 'view') project.views++;
        if (type === 'download') {
            project.downloads++;
            totalDownloads++;
        }
        if (type === 'like') project.likes++;
        saveProjectsToStorage();
    }
}

/**
 * حساب إجمالي التحميلات
 */
function calculateTotalDownloads() {
    return projects.reduce((sum, p) => sum + (p.downloads || 0), 0);
}

/**
 * دوال مساعدة
 */
function getLevelName(level) {
    const levels = {
        '1': 'مستوى أول',
        '2': 'مستوى ثاني',
        '3': 'مستوى ثالث',
        '4': 'مشروع تخرج'
    };
    return levels[level] || `مستوى ${level}`;
}

function getLevelClass(level) {
    return `level-${level}`;
}

function formatNumber(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getCategoryName(category) {
    const categories = {
        'web': 'برمجة الويب',
        'mobile': 'تطبيقات الجوال',
        'ai': 'الذكاء الاصطناعي',
        'database': 'قواعد البيانات',
        'network': 'الشبكات',
        'other': 'آخر'
    };
    return categories[category] || category;
}

// تحميل المشاريع عند بدء التشغيل
loadProjectsFromStorage();
totalDownloads = calculateTotalDownloads();

// تصدير للاستخدام العام
if (typeof window !== 'undefined') {
    window.projects = projects;
    window.getLevelName = getLevelName;
    window.getLevelClass = getLevelClass;
    window.formatNumber = formatNumber;
    window.getCategoryName = getCategoryName;
    window.addProject = addProject;
    window.updateProjectStats = updateProjectStats;
    window.calculateTotalDownloads = calculateTotalDownloads;
}