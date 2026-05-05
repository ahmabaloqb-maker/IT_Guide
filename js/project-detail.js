/**
 * JavaScript لصفحة تفاصيل المشروع
 */

// بيانات المشروع الحالي
let currentProject = null;
let currentProjectId = null;
let userRating = 0;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 صفحة تفاصيل المشروع جاهزة');
    
    // الحصول على ID المشروع من URL
    getProjectFromURL();
    
    // إذا وجد المشروع، تحميله
    if (currentProjectId) {
        loadProject();
        loadRelatedProjects();
        loadComments();
    } else {
        showError('لم يتم العثور على المشروع');
    }
    
    // إعداد الأحداث
    setupEventListeners();
    
    // تحديث عدد المشاهدات
    updateViewCount();
});

/**
 * الحصول على ID المشروع من URL
 */
function getProjectFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    currentProjectId = parseInt(urlParams.get('id')) || 1; // الافتراضي 1 للاختبار
    
    // تخزين في localStorage للاستخدام اللاحق
    localStorage.setItem('lastViewedProject', currentProjectId);
}

/**
 * تحميل بيانات المشروع
 */
function loadProject() {
    // البحث عن المشروع في البيانات
    currentProject = projects.find(project => project.id === currentProjectId);
    
    if (!currentProject) {
        // إذا لم يوجد، استخدم المشروع الأول
        currentProject = projects[0];
    }
    
    // عرض بيانات المشروع
    displayProjectData();
    
    // تحميل ملفات الكود
    loadProjectFiles();
}

/**
 * عرض بيانات المشروع
 */
function displayProjectData() {
    if (!currentProject) return;
    
    // المعلومات الأساسية
    document.getElementById('projectTitle').textContent = currentProject.title;
    document.getElementById('projectMainTitle').textContent = currentProject.title;
    document.getElementById('projectDescription').innerHTML = `
        <p>${currentProject.description}</p>
        <p>هذا المشروع هو مثال رائع لـ${getLevelName(currentProject.level)} في مجال ${getCategoryName(currentProject.category)}.</p>
    `;
    
    // المستوى والتخصص
    document.getElementById('projectLevel').textContent = getLevelName(currentProject.level);
    document.getElementById('projectCategory').textContent = getCategoryName(currentProject.category);
    document.getElementById('quickLevel').textContent = getLevelName(currentProject.level);
    document.getElementById('quickCategory').textContent = getCategoryName(currentProject.category);
    
    // الإحصائيات
    document.getElementById('viewCount').textContent = formatNumber(currentProject.views || 0);
    document.getElementById('downloadCount').textContent = formatNumber(currentProject.downloads || 0);
    document.getElementById('likeCount').textContent = formatNumber(currentProject.likes || 0);
    document.getElementById('projectDate').textContent = currentProject.createdAt || '2024';
    document.getElementById('lastUpdate').textContent = currentProject.createdAt || '2024';
    document.getElementById('projectAuthor').textContent = currentProject.author || 'طالب';
    
    // التقنيات
    displayTechnologies();
    
    // تحديث Title للصفحة
    document.title = `${currentProject.title} - IT Guide`;
    
    // تحديث معلومات سريعة
    document.getElementById('fileCount').textContent = '5';
    document.getElementById('projectSize').textContent = '2.4 MB';
    
    // روابط المشروع
    updateProjectLinks();
}

/**
 * عرض التقنيات المستخدمة
 */
function displayTechnologies() {
    const techTagsContainer = document.getElementById('techTags');
    const techDetailsContainer = document.getElementById('techDetails');
    
    if (!currentProject.technologies || currentProject.technologies.length === 0) {
        techTagsContainer.innerHTML = '<span style="color: #999;">لم يتم تحديد تقنيات</span>';
        techDetailsContainer.innerHTML = '<p style="color: #999;">لا توجد تفاصيل للتقنيات</p>';
        return;
    }
    
    // عرض الوسوم
    techTagsContainer.innerHTML = currentProject.technologies
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');
    
    // عرض التفاصيل
    const techIcons = {
        'HTML': 'fab fa-html5',
        'CSS': 'fab fa-css3-alt',
        'JavaScript': 'fab fa-js',
        'Python': 'fab fa-python',
        'Java': 'fab fa-java',
        'PHP': 'fab fa-php',
        'React': 'fab fa-react',
        'Vue.js': 'fab fa-vuejs',
        'Node.js': 'fab fa-node-js',
        'MySQL': 'fas fa-database',
        'MongoDB': 'fas fa-database'
    };
    
    const techDescriptions = {
        'HTML': 'لإنشاء هيكل الصفحة',
        'CSS': 'لتصميم وتنسيق الصفحة',
        'JavaScript': 'لإضافة التفاعلية',
        'Python': 'للبرمجة الخلفية',
        'PHP': 'لخوادم الويب',
        'React': 'لواجهة المستخدم',
        'Vue.js': 'للتطبيقات التفاعلية',
        'Node.js': 'لخادم JavaScript'
    };
    
    techDetailsContainer.innerHTML = currentProject.technologies
        .map(tech => `
            <div class="tech-item">
                <i class="${techIcons[tech] || 'fas fa-code'} tech-icon"></i>
                <div>
                    <div class="tech-name">${tech}</div>
                    <div class="tech-role">${techDescriptions[tech] || 'لغة برمجة'}</div>
                </div>
            </div>
        `)
        .join('');
}

/**
 * تحديث روابط المشروع
 */
function updateProjectLinks() {
    const liveDemoBtn = document.getElementById('liveDemoBtn');
    const githubBtn = document.getElementById('githubBtn');
    
    if (currentProject.projectURL) {
        liveDemoBtn.href = currentProject.projectURL;
        liveDemoBtn.style.display = 'flex';
    } else {
        liveDemoBtn.style.display = 'none';
    }
    
    if (currentProject.githubURL) {
        githubBtn.href = currentProject.githubURL;
        githubBtn.style.display = 'flex';
    } else {
        githubBtn.style.display = 'none';
    }
}

/**
 * تحميل ملفات المشروع
 */
function loadProjectFiles() {
    const fileSelector = document.getElementById('fileSelector');
    
    // ملفات افتراضية للمشروع
    const projectFiles = [
        { name: 'index.html', language: 'html', size: '2.1 KB', content: generateSampleHTML() },
        { name: 'style.css', language: 'css', size: '3.4 KB', content: generateSampleCSS() },
        { name: 'script.js', language: 'javascript', size: '1.8 KB', content: generateSampleJS() },
        { name: 'README.md', language: 'markdown', size: '0.8 KB', content: generateSampleREADME() },
        { name: 'package.json', language: 'json', size: '0.5 KB', content: generateSamplePackageJSON() }
    ];
    
    // إضافة الخيارات للقائمة
    fileSelector.innerHTML = '<option value="">اختر ملفاً للمعاينة</option>' +
        projectFiles.map(file => 
            `<option value="${file.name}" data-language="${file.language}" data-size="${file.size}">
                ${file.name} (${file.size})
            </option>`
        ).join('');
    
    // إعداد حدث تغيير الملف
    fileSelector.addEventListener('change', function() {
        const selectedFile = projectFiles.find(file => file.name === this.value);
        if (selectedFile) {
            displayFileContent(selectedFile);
        }
    });
    
    // اختيار أول ملف افتراضي
    if (projectFiles.length > 0) {
        fileSelector.value = projectFiles[0].name;
        displayFileContent(projectFiles[0]);
    }
}

/**
 * عرض محتوى الملف
 */
function displayFileContent(file) {
    const codePreview = document.getElementById('codePreview');
    const currentFileSpan = document.getElementById('currentFile');
    const fileSizeSpan = document.getElementById('fileSize');
    
    // تحديث معلومات الملف
    currentFileSpan.textContent = file.name;
    fileSizeSpan.textContent = file.size;
    
    // تحديث الكود
    codePreview.textContent = file.content;
    codePreview.className = `language-${file.language}`;
    
    // إعادة تمييز الكود
    hljs.highlightElement(codePreview);
}

/**
 * تحميل المشاريع المشابهة
 */
function loadRelatedProjects() {
    const relatedContainer = document.getElementById('relatedProjects');
    
    if (!currentProject) return;
    
    // البحث عن مشاريع مشابهة (نفس المستوى أو التخصص)
    const related = projects
        .filter(project => 
            project.id !== currentProject.id && 
            (project.level === currentProject.level || 
             project.category === currentProject.category)
        )
        .slice(0, 3); // أول 3 مشاريع فقط
    
    if (related.length === 0) {
        relatedContainer.innerHTML = `
            <div class="no-comments">
                <p>لا توجد مشاريع مشابهة حالياً</p>
            </div>
        `;
        return;
    }
    
    relatedContainer.innerHTML = related.map(project => `
        <a href="project-detail.html?id=${project.id}" class="related-project">
            <i class="fas fa-project-diagram"></i>
            <div>
                <h4>${project.title}</h4>
                <span>${getLevelName(project.level)}</span>
            </div>
        </a>
    `).join('');
}

/**
 * تحميل التعليقات
 */
function loadComments() {
    const commentsContainer = document.getElementById('commentsList');
    
    // الحصول على التعليقات من localStorage
    const storedComments = JSON.parse(localStorage.getItem(`project_${currentProjectId}_comments`)) || [];
    
    if (storedComments.length === 0) {
        commentsContainer.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-comment-slash"></i>
                <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
            </div>
        `;
        return;
    }
    
    // عرض التعليقات
    commentsContainer.innerHTML = storedComments.map((comment, index) => `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">
                        ${comment.name ? comment.name.charAt(0) : 'ط'}
                    </div>
                    <div class="author-info">
                        <h4>${comment.name || 'طالب'}</h4>
                        <span class="comment-time">${comment.time}</span>
                    </div>
                </div>
                <div class="comment-rating">
                    ${generateStarRating(comment.rating)}
                </div>
            </div>
            <div class="comment-content">
                ${comment.text}
            </div>
            <div class="comment-actions">
                <button class="comment-action" onclick="likeComment(${index})">
                    <i class="far fa-thumbs-up"></i> أعجبني
                </button>
                <button class="comment-action" onclick="replyToComment(${index})">
                    <i class="far fa-reply"></i> رد
                </button>
            </div>
        </div>
    `).join('');
    
    // تحديث إحصائيات التقييم
    updateRatingStats(storedComments);
}

/**
 * تحديث إحصائيات التقييم
 */
function updateRatingStats(comments) {
    if (comments.length === 0) {
        document.getElementById('avgRating').textContent = '0.0';
        document.getElementById('ratingCount').textContent = '0';
        return;
    }
    
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const avgRating = totalRating / comments.length;
    
    document.getElementById('avgRating').textContent = avgRating.toFixed(1);
    document.getElementById('ratingCount').textContent = comments.length;
    
    // تحديث النجوم
    const starsContainer = document.querySelector('.rating-stars');
    starsContainer.innerHTML = generateStarRating(avgRating);
}

/**
 * إعداد الأحداث
 */
function setupEventListeners() {
    // زر التحميل
    document.getElementById('downloadBtn').addEventListener('click', downloadProject);
    
    // زر الإعجاب
    document.getElementById('likeBtn').addEventListener('click', toggleLike);
    
    // نسخ الكود
    document.getElementById('copyCodeBtn').addEventListener('click', copyCode);
    
    // تقييم النجوم
    setupStarRating();
    
    // إرسال التعليق
    document.getElementById('commentForm').addEventListener('submit', submitComment);
    
    // مشاركة المشروع
    document.getElementById('shareBtn').addEventListener('click', openShareModal);
    
    // إغلاق نافذة المشاركة
    document.querySelector('.modal-overlay')?.addEventListener('click', closeShareModal);
    document.querySelector('.modal-close')?.addEventListener('click', closeShareModal);
}

/**
 * تقييم النجوم
 */
function setupStarRating() {
    const stars = document.querySelectorAll('#starsRating i');
    
    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
        
        star.addEventListener('mouseleave', function() {
            highlightStars(userRating);
        });
        
        star.addEventListener('click', function() {
            userRating = parseInt(this.dataset.rating);
            document.getElementById('userRating').value = userRating;
            highlightStars(userRating);
        });
    });
}

/**
 * تلوين النجوم
 */
function highlightStars(rating) {
    const stars = document.querySelectorAll('#starsRating i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
            star.style.color = '#FFD700';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#ddd';
        }
    });
}

/**
 * تحميل المشروع
 */
function downloadProject() {
    if (!currentProject) return;
    
    // زيادة عداد التحميلات
    currentProject.downloads = (currentProject.downloads || 0) + 1;
    document.getElementById('downloadCount').textContent = formatNumber(currentProject.downloads);
    
    // محاكاة التحميل
    showToast('جاري تحميل المشروع...', 'info');
    
    setTimeout(() => {
        // في الواقع، هنا سيكون رابط التحميل الحقيقي
        showToast('تم بدء تحميل المشروع', 'success');
        
        // حفظ في localStorage
        saveProjectsToStorage();
    }, 1000);
}

/**
 * الإعجاب بالمشروع
 */
function toggleLike() {
    if (!currentProject) return;
    
    const likeBtn = document.getElementById('likeBtn');
    const likeIcon = likeBtn.querySelector('i');
    const likeCount = document.getElementById('likeCount');
    
    // التحقق إذا كان المستخدم أعجب بالمشروع مسبقاً
    const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
    const isLiked = likedProjects.includes(currentProjectId);
    
    if (isLiked) {
        // إزالة الإعجاب
        currentProject.likes = Math.max(0, (currentProject.likes || 0) - 1);
        likeIcon.className = 'far fa-heart';
        likedProjects.splice(likedProjects.indexOf(currentProjectId), 1);
        showToast('تم إزالة الإعجاب', 'info');
    } else {
        // إضافة الإعجاب
        currentProject.likes = (currentProject.likes || 0) + 1;
        likeIcon.className = 'fas fa-heart';
        likedProjects.push(currentProjectId);
        showToast('شكراً لإعجابك بالمشروع!', 'success');
    }
    
    // تحديث العدد
    likeCount.textContent = formatNumber(currentProject.likes);
    
    // حفظ في localStorage
    localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
    saveProjectsToStorage();
}

/**
 * نسخ الكود
 */
function copyCode() {
    const codePreview = document.getElementById('codePreview');
    const codeText = codePreview.textContent;
    
    navigator.clipboard.writeText(codeText).then(() => {
        showToast('تم نسخ الكود بنجاح', 'success');
    }).catch(err => {
        showToast('فشل نسخ الكود', 'error');
        console.error('فشل نسخ الكود:', err);
    });
}

/**
 * إرسال تعليق
 */
function submitComment(e) {
    e.preventDefault();
    
    const commentText = document.getElementById('commentText').value.trim();
    const commenterName = document.getElementById('commenterName').value.trim();
    
    if (!commentText) {
        showToast('يرجى كتابة تعليق', 'error');
        return;
    }
    
    if (userRating === 0) {
        showToast('يرجى اختيار تقييم', 'error');
        return;
    }
    
    // إنشاء التعليق
    const newComment = {
        text: commentText,
        name: commenterName || 'طالب',
        rating: userRating,
        time: new Date().toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        likes: 0
    };
    
    // الحصول على التعليقات الحالية
    const storedComments = JSON.parse(localStorage.getItem(`project_${currentProjectId}_comments`)) || [];
    storedComments.unshift(newComment); // إضافة في البداية
    
    // حفظ في localStorage
    localStorage.setItem(`project_${currentProjectId}_comments`, JSON.stringify(storedComments));
    
    // إعادة تحميل التعليقات
    loadComments();
    
    // إعادة تعيين النموذج
    document.getElementById('commentForm').reset();
    userRating = 0;
    highlightStars(0);
    document.getElementById('userRating').value = 0;
    
    showToast('تم نشر تعليقك بنجاح', 'success');
}

/**
 * فتح نافذة المشاركة
 */
function openShareModal() {
    const modal = document.getElementById('shareModal');
    const shareLinkInput = document.getElementById('shareLinkInput');
    
    // إنشاء رابط المشاركة
    const shareLink = `${window.location.origin}${window.location.pathname}?id=${currentProjectId}`;
    shareLinkInput.value = shareLink;
    
    modal.classList.add('active');
}

/**
 * إغلاق نافذة المشاركة
 */
function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

/**
 * مشاركة على وسائل التواصل
 */
function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentProject.title);
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    showToast('جاري فتح نافذة المشاركة', 'info');
}

/**
 * نسخ رابط المشاركة
 */
function copyShareLink() {
    const shareLinkInput = document.getElementById('shareLinkInput');
    
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
        showToast('تم نسخ الرابط بنجاح', 'success');
    }).catch(err => {
        showToast('فشل نسخ الرابط', 'error');
        console.error('فشل نسخ الرابط:', err);
    });
}

/**
 * تحديث عدد المشاهدات
 */
function updateViewCount() {
    if (!currentProject) return;
    
    // زيادة عداد المشاهدات
    currentProject.views = (currentProject.views || 0) + 1;
    document.getElementById('viewCount').textContent = formatNumber(currentProject.views);
    
    // حفظ في localStorage
    saveProjectsToStorage();
}

/**
 * حفظ المشاريع في localStorage
 */
function saveProjectsToStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

/**
 * إظهار رسالة خطأ
 */
function showError(message) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <h2>${message}</h2>
            <p>يرجى العودة لصفحة المشاريع وتجربة مشروع آخر</p>
            <a href="projects.html" class="btn btn-primary">تصفح المشاريع</a>
        </div>
    `;
}

/**
 * إظهار رسالة منبثقة
 */
function showToast(message, type = 'info') {
    // إزالة أي رسائل سابقة
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

/**
 * دوال مساعدة
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

/**
 * توليد محتوى عينة للكود
 */
function generateSampleHTML() {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentProject?.title || 'مشروع طلابي'}</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- الهيدر -->
    <header>
        <nav>
            <div class="logo">
                <h1>${currentProject?.title || 'المشروع'}</h1>
            </div>
            <ul class="nav-links">
                <li><a href="#home">الرئيسية</a></li>
                <li><a href="#about">من نحن</a></li>
                <li><a href="#contact">اتصل بنا</a></li>
            </ul>
        </nav>
    </header>

    <!-- المحتوى الرئيسي -->
    <main>
        <section class="hero">
            <h2>مرحباً بك في ${currentProject?.title || 'المشروع'}</h2>
            <p>مشروع طلابي لتعلم ${getCategoryName(currentProject?.category) || 'البرمجة'}</p>
        </section>
    </main>

    <!-- الفوتر -->
    <footer>
        <p>© 2024 ${currentProject?.title || 'المشروع'}. جميع الحقوق محفوظة</p>
    </footer>

    <!-- JavaScript -->
    <script src="script.js"></script>
</body>
</html>`;
}

function generateSampleCSS() {
    return `/* أنماط ${currentProject?.title || 'المشروع'} */

:root {
    --primary: #2D5BFF;
    --secondary: #8B5CF6;
    --dark: #1F2937;
    --light: #F9FAFB;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    direction: rtl;
    line-height: 1.6;
    color: var(--dark);
    background: var(--light);
}

/* الهيدر */
header {
    background: var(--white);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.logo h1 {
    color: var(--primary);
    font-size: 1.5rem;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--dark);
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: var(--primary);
}

/* الهيرو */
.hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    border-radius: 0 0 30px 30px;
    margin-bottom: 3rem;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* الفوتر */
footer {
    text-align: center;
    padding: 2rem;
    background: var(--dark);
    color: white;
    margin-top: 3rem;
}

/* تجاوبية */
@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    
    .nav-links {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
}`;
}

function generateSampleJS() {
    return `/**
 * ${currentProject?.title || 'المشروع'} - JavaScript
 * 
 * هذا الملف يحتوي على الدوال التفاعلية للمشروع
 */

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('${currentProject?.title || "المشروع"} جاهز للعمل!');
    
    // إعداد التنقل السلس
    setupSmoothScroll();
    
    // إعداد الأحداث
    setupEventListeners();
    
    // تحميل البيانات
    loadInitialData();
});

/**
 * إعداد التنقل السلس بين الأقسام
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * إعداد الأحداث
 */
function setupEventListeners() {
    // مثال: إضافة حدث للنقر على الأزرار
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('تم النقر على زر:', this.textContent);
        });
    });
    
    // مثال: إضافة حدث للتغير في الحقول
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            console.log('تم تغيير الحقل:', this.name || this.id);
        });
    });
}

/**
 * تحميل البيانات الأولية
 */
function loadInitialData() {
    // هنا يمكنك جلب البيانات من API أو localStorage
    console.log('جاري تحميل البيانات...');
    
    // محاكاة جلب البيانات
    setTimeout(() => {
        console.log('تم تحميل البيانات بنجاح');
        updateUI();
    }, 1000);
}

/**
 * تحديث واجهة المستخدم
 */
function updateUI() {
    // تحديث عناصر واجهة المستخدم
    console.log('تم تحديث واجهة المستخدم');
}

/**
 * إظهار رسالة للمستخدم
 */
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = \`message \${type}\`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

/**
 * دوال مساعدة
 */

// تنسيق الأرقام
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return re.test(email);
}

// توليد معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}`;
}

function generateSampleREADME() {
    return `# ${currentProject?.title || 'المشروع'}

## 📋 الوصف
${currentProject?.description || 'مشروع طلابي لمادة البرمجة'}

## 🚀 كيفية التشغيل

### المتطلبات المسبقة
- متصفح ويب حديث (Chrome, Firefox, Edge)
- محرر نصوص (VS Code, Sublime Text)
- اتصال بالإنترنت (للمكتبات الخارجية)

### خطوات التثبيت

1. **تنزيل المشروع**
   \`\`\`bash
   git clone https://github.com/username/project.git
   \`\`\`

2. **الانتقال لمجلد المشروع**
   \`\`\`bash
   cd project
   \`\`\`

3. **فتح المشروع في المتصفح**
   - افتح ملف \`index.html\` في المتصفح
   - أو استخدم Live Server في VS Code

### هيكل المجلدات
\`\`\`
project/
├── index.html          # الصفحة الرئيسية
├── style.css           # أنماط CSS
├── script.js           # سكريبتات JavaScript
├── README.md           # هذا الملف
└── assets/             # الموارد (صور، أيقونات)
\`\`\`

## 🛠 التقنيات المستخدمة
${currentProject?.technologies?.map(tech => `- ${tech}`).join('\n') || '- HTML\n- CSS\n- JavaScript'}

## 📁 الملفات الرئيسية

### index.html
هيكل HTML الأساسي للمشروع

### style.css
كل أنماط CSS والتنسيقات

### script.js
الدوال والتفاعلات باستخدام JavaScript

## 🤝 المساهمة
1. Fork المشروع
2. أنشئ فرعاً جديداً (\`git checkout -b feature/AmazingFeature\`)
3. أضف تغييراتك (\`git commit -m 'Add some AmazingFeature'\`)
4. ادفع للفرع (\`git push origin feature/AmazingFeature\`)
5. افتح طلب Pull

## 📄 الرخصة
هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل

## 👥 فريق العمل
- الطالب الأول
- الطالب الثاني
- الطالب الثالث

## 🙏 الشكر والتقدير
- شكراً للمعلم/المعلمة على التوجيه
- شكراً للزملاء على المساعدة
- شكراً لـ IT Guide على المنصة`;
}

function generateSamplePackageJSON() {
    return `{
  "name": "${currentProject?.title.toLowerCase().replace(/\s+/g, '-') || 'student-project'}",
  "version": "1.0.0",
  "description": "${currentProject?.description || 'Student project for IT course'}",
  "main": "index.html",
  "scripts": {
    "start": "live-server --port=3000",
    "build": "echo 'No build step required for static site'"
  },
  "keywords": [
    "student-project",
    "${getCategoryName(currentProject?.category) || 'web'}",
    "education"
  ],
  "author": "Student Name",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {
    "live-server": "^1.2.2"
  }
}`;
}

// إضافة الدوال للـwindow للوصول من HTML
window.closeShareModal = closeShareModal;
window.shareOnSocial = shareOnSocial;
window.copyShareLink = copyShareLink;
window.likeComment = function(index) {
    showToast('تم الإعجاب بالتعليق', 'success');
};
window.replyToComment = function(index) {
    showToast('سيتم تنفيذ نظام الردود قريباً', 'info');
};