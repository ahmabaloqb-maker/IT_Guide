/**
 * بيانات المشاريع
 */

const projects = [
    {
        id: 1,
        title: "موقع شخصي متكامل",
        description: "موقع شخصي مع تصميم عصري و CV تفاعلي، مناسب للمستوى الأول",
        level: "1",
        category: "web",
        technologies: ["HTML", "CSS"],
        icon: "fas fa-user",
        featured: true,
        views: 150,
        downloads: 45,
        likes: 89
    },
    {
        id: 2,
        title: "متجر إلكتروني",
        description: "متجر كامل مع سلة تسوق ونظام دفع تجريبي",
        level: "2",
        category: "web",
        technologies: ["HTML", "CSS", "JavaScript"],
        icon: "fas fa-shopping-cart",
        featured: true,
        views: 320,
        downloads: 120,
        likes: 200
    },
    {
        id: 3,
        title: "تطبيق مهام يومية",
        description: "تطبيق ويب لإدارة المهام اليومية مع إشعارات",
        level: "1",
        category: "web",
        technologies: ["JavaScript", "LocalStorage"],
        icon: "fas fa-tasks",
        featured: true,
        views: 95,
        downloads: 32,
        likes: 67
    },
    {
        id: 4,
        title: "منصة تعليمية",
        description: "منصة لعرض الدورات والدروس التعليمية",
        level: "3",
        category: "web",
        technologies: ["PHP", "MySQL", "JavaScript"],
        icon: "fas fa-graduation-cap",
        featured: false,
        views: 210,
        downloads: 78,
        likes: 145
    },
    {
        id: 5,
        title: "تطبيق طقس تفاعلي",
        description: "تطبيق يعرض حالة الطقس باستخدام API",
        level: "2",
        category: "mobile",
        technologies: ["React Native", "API"],
        icon: "fas fa-cloud-sun",
        featured: false,
        views: 140,
        downloads: 52,
        likes: 98
    },
    {
        id: 6,
        title: "نظام إدارة مكتبة",
        description: "نظام متكامل لإدارة الكتب والإعارة",
        level: "4",
        category: "database",
        technologies: ["Python", "Django", "MySQL"],
        icon: "fas fa-book",
        featured: false,
        views: 280,
        downloads: 95,
        likes: 210
    }
];

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
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// تصدير البيانات والدوال
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { projects, getLevelName, getLevelClass, formatNumber };
}
// تصدير الدوال للاستخدام في upload.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        projects, 
        getLevelName, 
        getLevelClass, 
        formatNumber,
        getCategoryName 
    };
}
