/**
 * JavaScript لصفحة رفع المشروع
 */

// حالة النموذج
let currentStep = 1;
let formData = {
    title: '',
    description: '',
    level: '',
    category: '',
    technologies: [],
    projectURL: '',
    githubURL: '',
    files: []
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📤 صفحة رفع المشروع جاهزة');
    
    // إعداد التقنيات
    setupTechSelector();
    
    // إدارة رفع الملفات
    setupFileUpload();
    
    // إعداد خطوات النموذج
    setupStepNavigation();
    
    // إرسال النموذج
    setupFormSubmit();
    
    // تحميل من LocalStorage إذا وجد
    loadFromStorage();
});

/**
 * إعداد محدد التقنيات
 */
function setupTechSelector() {
    const techOptions = document.querySelectorAll('.tech-option input');
    const selectedTechsContainer = document.getElementById('selectedTechs');
    const techSearch = document.getElementById('techSearch');
    
    // تحديث التقنيات المختارة
    function updateSelectedTechs() {
        selectedTechsContainer.innerHTML = '';
        formData.technologies.forEach(tech => {
            const tag = document.createElement('div');
            tag.className = 'tech-tag';
            tag.innerHTML = `
                ${tech}
                <span class="remove" onclick="removeTech('${tech}')">&times;</span>
            `;
            selectedTechsContainer.appendChild(tag);
        });
        
        if (formData.technologies.length === 0) {
            selectedTechsContainer.innerHTML = '<span style="color: #999;">لم تقم باختيار أي تقنيات</span>';
        }
    }
    
    // إضافة/إزالة تقنية
    techOptions.forEach(option => {
        option.addEventListener('change', function() {
            const tech = this.value;
            
            if (this.checked && !formData.technologies.includes(tech)) {
                formData.technologies.push(tech);
            } else if (!this.checked && formData.technologies.includes(tech)) {
                formData.technologies = formData.technologies.filter(t => t !== tech);
            }
            
            updateSelectedTechs();
            saveToStorage();
        });
    });
    
    // بحث التقنيات
    techSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        techOptions.forEach(option => {
            const techName = option.value.toLowerCase();
            const parent = option.closest('.tech-option');
            
            if (techName.includes(searchTerm) || searchTerm === '') {
                parent.style.display = 'flex';
            } else {
                parent.style.display = 'none';
            }
        });
    });
    
    // تحديث أولي
    updateSelectedTechs();
}

/**
 * إزالة تقنية
 */
function removeTech(tech) {
    formData.technologies = formData.technologies.filter(t => t !== tech);
    
    // إلغاء تحديد الخانة
    const checkbox = document.querySelector(`.tech-option input[value="${tech}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    updateSelectedTechs();
    saveToStorage();
}

/**
 * إعداد رفع الملفات
 */
function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const filesList = document.getElementById('filesList');
    
    // سحب وإفلات الملفات
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // النقر لاختيار الملفات
    uploadZone.addEventListener('click', function() {
        fileInput.click();
    });
    
    // تغيير اختيار الملفات
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // تحديث عرض الملفات
    function updateFilesList() {
        filesList.innerHTML = '';
        
        if (formData.files.length === 0) {
            filesList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">لم تقم برفع أي ملفات</p>';
            return;
        }
        
        formData.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileSize = formatFileSize(file.size);
            const fileType = getFileType(file.name);
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="${getFileIcon(fileType)}"></i>
                    </div>
                    <div class="file-details">
                        <h5>${file.name}</h5>
                        <small>${fileSize} • ${fileType.toUpperCase()}</small>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-secondary btn-small" onclick="previewFile(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="removeFile(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            filesList.appendChild(fileItem);
        });
    }
    
    // تحديث أولي
    updateFilesList();
}

/**
 * التعامل مع الملفات المرفوعة
 */
function handleFiles(files) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const maxFiles = 10;
    
    // التحقق من عدد الملفات
    if (formData.files.length + files.length > maxFiles) {
        showAlert('error', `يمكنك رفع ${maxFiles} ملفات كحد أقصى`);
        return;
    }
    
    // التحقق من حجم الملفات
    for (let file of files) {
        if (file.size > maxSize) {
            showAlert('error', `الملف ${file.name} يتجاوز الحد الأقصى (50MB)`);
            return;
        }
        
        // إضافة الملف
        formData.files.push(file);
    }
    
    // تحديث العرض
    updateFilesList();
    saveToStorage();
    showAlert('success', `تم رفع ${files.length} ملف بنجاح`);
}

/**
 * إزالة ملف
 */
function removeFile(index) {
    formData.files.splice(index, 1);
    updateFilesList();
    saveToStorage();
}

/**
 * معاينة ملف
 */
function previewFile(index) {
    const file = formData.files[index];
    
    if (file.type.startsWith('image/')) {
        // صورة
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = `<img src="${e.target.result}" style="max-width: 100%; max-height: 400px;">`;
            showModal('معاينة الصورة', img);
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.md') || 
               file.name.endsWith('.txt') || file.name.endsWith('.html')) {
        // نص
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = `<pre style="max-height: 400px; overflow: auto;">${escapeHtml(e.target.result)}</pre>`;
            showModal('معاينة الملف النصي', content);
        };
        reader.readAsText(file);
    } else {
        // أنواع أخرى
        showModal('معلومات الملف', `
            <p><strong>اسم الملف:</strong> ${file.name}</p>
            <p><strong>النوع:</strong> ${file.type}</p>
            <p><strong>الحجم:</strong> ${formatFileSize(file.size)}</p>
            <p><strong>آخر تعديل:</strong> ${new Date(file.lastModified).toLocaleDateString('ar-SA')}</p>
        `);
    }
}

/**
 * إعداد خطوات النموذج
 */
function setupStepNavigation() {
    // تحديث الخطوات النشطة
    function updateSteps() {
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === currentStep) {
                step.classList.add('active');
            }
        });
        
        // إظهار/إخفاء الأقسام
        document.querySelectorAll('.form-section').forEach((section, index) => {
            section.style.display = index + 1 === currentStep ? 'block' : 'none';
        });
    }
    
    // تحديث أولي
    updateSteps();
}

/**
 * الانتقال للخطوة التالية
 */
function nextStep() {
    // التحقق من صحة البيانات في الخطوة الحالية
    if (!validateCurrentStep()) {
        return;
    }
    
    // حفظ البيانات من الحقول
    saveFormData();
    
    // التحديث للخطوة التالية
    if (currentStep < 3) {
        currentStep++;
        
        // إذا كنا في الخطوة 3 (المراجعة)، تحديث الملخص
        if (currentStep === 3) {
            updateReviewSummary();
        }
        
        updateSteps();
        scrollToTop();
    }
}

/**
 * العودة للخطوة السابقة
 */
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
        scrollToTop();
    }
}

/**
 * التحقق من صحة الخطوة الحالية
 */
function validateCurrentStep() {
    switch(currentStep) {
        case 1: // معلومات المشروع
            const title = document.getElementById('projectTitle').value.trim();
            const description = document.getElementById('projectDescription').value.trim();
            const level = document.getElementById('projectLevel').value;
            const category = document.getElementById('projectCategory').value;
            
            if (!title) {
                showAlert('error', 'يرجى إدخال اسم المشروع');
                document.getElementById('projectTitle').focus();
                return false;
            }
            
            if (!description) {
                showAlert('error', 'يرجى إدخال وصف المشروع');
                document.getElementById('projectDescription').focus();
                return false;
            }
            
            if (!level) {
                showAlert('error', 'يرجى اختيار المستوى الدراسي');
                document.getElementById('projectLevel').focus();
                return false;
            }
            
            if (!category) {
                showAlert('error', 'يرجى اختيار التخصص');
                document.getElementById('projectCategory').focus();
                return false;
            }
            
            if (formData.technologies.length === 0) {
                showAlert('error', 'يرجى اختيار التقنيات المستخدمة');
                return false;
            }
            
            return true;
            
        case 2: // رفع الملفات
            if (formData.files.length === 0) {
                showAlert('error', 'يرجى رفع ملفات المشروع');
                return false;
            }
            
            // التحقق من وجود ملف README
            const hasReadme = formData.files.some(file => 
                file.name.toLowerCase() === 'readme.md' || 
                file.name.toLowerCase().includes('readme')
            );
            
            if (!hasReadme) {
                if (!confirm('لم تقم برفع ملف README.md. هل تريد المتابعة دون رفعه؟')) {
                    return false;
                }
            }
            
            return true;
            
        default:
            return true;
    }
}

/**
 * حفظ البيانات من الحقول
 */
function saveFormData() {
    formData = {
        ...formData,
        title: document.getElementById('projectTitle').value.trim(),
        description: document.getElementById('projectDescription').value.trim(),
        level: document.getElementById('projectLevel').value,
        category: document.getElementById('projectCategory').value,
        projectURL: document.getElementById('projectURL').value.trim(),
        githubURL: document.getElementById('githubURL').value.trim()
    };
    
    saveToStorage();
}

/**
 * تحديث ملخص المراجعة
 */
function updateReviewSummary() {
    const projectInfoDiv = document.getElementById('reviewProjectInfo');
    const filesDiv = document.getElementById('reviewFiles');
    
    // معلومات المشروع
    projectInfoDiv.innerHTML = `
        <div class="review-info">
            <div class="info-row">
                <span class="info-label">اسم المشروع:</span>
                <span class="info-value">${formData.title}</span>
            </div>
            <div class="info-row">
                <span class="info-label">المستوى الدراسي:</span>
                <span class="info-value">${getLevelName(formData.level)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">التخصص:</span>
                <span class="info-value">${getCategoryName(formData.category)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">التقنيات:</span>
                <span class="info-value">${formData.technologies.join(', ')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">وصف المشروع:</span>
                <span class="info-value">${formData.description}</span>
            </div>
            ${formData.projectURL ? `
            <div class="info-row">
                <span class="info-label">رابط المشروع:</span>
                <span class="info-value">
                    <a href="${formData.projectURL}" target="_blank">${formData.projectURL}</a>
                </span>
            </div>
            ` : ''}
            ${formData.githubURL ? `
            <div class="info-row">
                <span class="info-label">رابط GitHub:</span>
                <span class="info-value">
                    <a href="${formData.githubURL}" target="_blank">${formData.githubURL}</a>
                </span>
            </div>
            ` : ''}
        </div>
    `;
    
    // الملفات المرفوعة
    let filesHTML = '<div class="review-info">';
    
    if (formData.files.length > 0) {
        formData.files.forEach((file, index) => {
            const fileSize = formatFileSize(file.size);
            const fileType = getFileType(file.name);
            
            filesHTML += `
                <div class="info-row">
                    <span class="info-label">الملف ${index + 1}:</span>
                    <span class="info-value">
                        <i class="${getFileIcon(fileType)}"></i>
                        ${file.name} (${fileSize})
                    </span>
                </div>
            `;
        });
    } else {
        filesHTML += '<p style="text-align: center; color: #999;">لا توجد ملفات مرفوعة</p>';
    }
    
    filesHTML += '</div>';
    filesDiv.innerHTML = filesHTML;
}

/**
 * إعداد إرسال النموذج
 */
function setupFormSubmit() {
    const form = document.getElementById('projectUploadForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // التحقق من الموافقة على الشروط
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const agreeLicense = document.getElementById('agreeLicense').checked;
        
        if (!agreeTerms || !agreeLicense) {
            showAlert('error', 'يرجى الموافقة على الشروط والرخصة');
            return;
        }
        
        // حفظ البيانات
        saveFormData();
        
        // معالجة النموذج
        processFormSubmission();
    });
}

/**
 * معالجة إرسال النموذج
 */
function processFormSubmission() {
    // محاكاة عملية الرفع
    showAlert('info', 'جاري رفع المشروع...');
    
    // في الواقع، هنا سيكون اتصال بالسيرفر
    setTimeout(() => {
        // إنشاء مشروع جديد
        const newProject = {
            id: Date.now(), // ID فريد
            title: formData.title,
            description: formData.description,
            level: formData.level,
            category: formData.category,
            technologies: formData.technologies,
            projectURL: formData.projectURL,
            githubURL: formData.githubURL,
            views: 0,
            downloads: 0,
            likes: 0,
            featured: false,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        // إضافة للمشاريع (في الواقع سيكون للسيرفر)
        projects.push(newProject);
        
        // حفظ في LocalStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // إظهار رسالة النجاح
        showAlert('success', 'تم رفع المشروع بنجاح!');
        
        // إعادة تعيين النموذج
        setTimeout(() => {
            resetForm();
            window.location.href = 'projects.html';
        }, 2000);
        
    }, 1500);
}

/**
 * إعادة تعيين النموذج
 */
function resetForm() {
    // إعادة تعيين البيانات
    formData = {
        title: '',
        description: '',
        level: '',
        category: '',
        technologies: [],
        projectURL: '',
        githubURL: '',
        files: []
    };
    
    // إعادة تعيين الحقول
    document.getElementById('projectTitle').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectLevel').value = '';
    document.getElementById('projectCategory').value = '';
    document.getElementById('projectURL').value = '';
    document.getElementById('githubURL').value = '';
    
    // إعادة تعيين التقنيات
    document.querySelectorAll('.tech-option input').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('selectedTechs').innerHTML = '<span style="color: #999;">لم تقم باختيار أي تقنيات</span>';
    
    // إعادة تعيين الملفات
    document.getElementById('filesList').innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">لم تقم برفع أي ملفات</p>';
    
    // إعادة تعيين الخطوات
    currentStep = 1;
    updateSteps();
    
    // مسح LocalStorage
    localStorage.removeItem('uploadFormData');
    
    showAlert('success', 'تم إعادة تعيين النموذج بنجاح');
}

/**
 * حفظ في LocalStorage
 */
function saveToStorage() {
    const dataToSave = {
        ...formData,
        files: [] // لا نحفظ الملفات في LocalStorage
    };
    localStorage.setItem('uploadFormData', JSON.stringify(dataToSave));
}

/**
 * تحميل من LocalStorage
 */
function loadFromStorage() {
    const savedData = localStorage.getItem('uploadFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // استعادة البيانات الأساسية
        formData = { ...formData, ...data };
        
        // تحديث الحقول
        document.getElementById('projectTitle').value = data.title || '';
        document.getElementById('projectDescription').value = data.description || '';
        document.getElementById('projectLevel').value = data.level || '';
        document.getElementById('projectCategory').value = data.category || '';
        document.getElementById('projectURL').value = data.projectURL || '';
        document.getElementById('githubURL').value = data.githubURL || '';
        
        // تحديث التقنيات
        if (data.technologies && data.technologies.length > 0) {
            formData.technologies = data.technologies;
            data.technologies.forEach(tech => {
                const checkbox = document.querySelector(`.tech-option input[value="${tech}"]`);
                if (checkbox) checkbox.checked = true;
            });
            updateSelectedTechs();
        }
        
        showAlert('info', 'تم استعادة البيانات المحفوظة مسبقاً');
    }
}

/**
 * دوال مساعدة
 */
function showAlert(type, message) {
    // إزالة أي تنبيهات سابقة
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    const form = document.querySelector('.upload-form');
    form.insertBefore(alertDiv, form.firstChild);
    
    // إزالة التنبيه بعد 5 ثواني
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image',
        'html': 'html', 'css': 'css', 'js': 'javascript',
        'txt': 'text', 'md': 'markdown',
        'zip': 'archive', 'rar': 'archive', '7z': 'archive',
        'pdf': 'pdf', 'doc': 'word', 'docx': 'word'
    };
    return types[ext] || 'file';
}

function getFileIcon(fileType) {
    const icons = {
        'image': 'fas fa-image',
        'html': 'fab fa-html5',
        'css': 'fab fa-css3-alt',
        'javascript': 'fab fa-js',
        'text': 'fas fa-file-alt',
        'markdown': 'fas fa-file-code',
        'archive': 'fas fa-file-archive',
        'pdf': 'fas fa-file-pdf',
        'word': 'fas fa-file-word',
        'file': 'fas fa-file'
    };
    return icons[fileType] || 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

// إضافة الدوال للـwindow للوصول من HTML
window.nextStep = nextStep;
window.prevStep = prevStep;
window.resetForm = resetForm;
window.removeTech = removeTech;
window.previewFile = previewFile;
window.removeFile = removeFile;