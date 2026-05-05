/**
 * JavaScript لصفحة "عن المنصة"
 */

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('ℹ️ صفحة "عن المنصة" جاهزة');
    
    // إعداد الأسئلة الشائعة
    setupFAQ();
    
    // إعداد نموذج الاتصال
    setupContactForm();
    
    // تحديث تاريخ السنة في الفوتر
    updateCurrentYear();
});

/**
 * إعداد الأسئلة الشائعة
 */
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // إغلاق جميع الإجابات الأخرى
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                    const answer = q.nextElementSibling;
                    answer.classList.remove('active');
                }
            });
            
            // تبديل الإجابة الحالية
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
}

/**
 * إعداد نموذج الاتصال
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع بيانات النموذج
        const formData = {
            name: this.querySelector('input[type="text"]').value.trim(),
            email: this.querySelector('input[type="email"]').value.trim(),
            subject: this.querySelectorAll('input[type="text"]')[1].value.trim(),
            message: this.querySelector('textarea').value.trim()
        };
        
        // التحقق من البيانات
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showMessage('error', 'يرجى ملء جميع الحقول');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showMessage('error', 'البريد الإلكتروني غير صالح');
            return;
        }
        
        // محاكاة إرسال الرسالة
        showMessage('info', 'جاري إرسال رسالتك...');
        
        setTimeout(() => {
            // حفظ الرسالة في localStorage (محاكاة)
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push({
                ...formData,
                timestamp: new Date().toISOString(),
                read: false
            });
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            // إعادة تعيين النموذج
            this.reset();
            
            // عرض رسالة النجاح
            showMessage('success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
            
            // إرسال إشعار لأحمد (محاكاة)
            notifyFounder(formData);
            
        }, 1500);
    });
}

/**
 * إشعار المؤسس (أحمد) برسالة جديدة
 */
function notifyFounder(formData) {
    // محاكاة إرسال إشعار
    console.log('📨 إشعار جديد لأحمد:', {
        from: formData.name,
        email: formData.email,
        subject: formData.subject,
        time: new Date().toLocaleTimeString('ar-SA')
    });
    
    // في الواقع: إرسال بريد إلكتروني أو إشعار في النظام
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * عرض رسالة للمستخدم
 */
function showMessage(type, text) {
    // إزالة أي رسائل سابقة
    const existingMessages = document.querySelectorAll('.message-toast');
    existingMessages.forEach(msg => msg.remove());
    
    // إنشاء الرسالة الجديدة
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    messageDiv.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${text}</span>
    `;
    
    // إضافة الأنماط
    messageDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        border-right: 4px solid ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#2D5BFF'};
    `;
    
    // إضافة الأنيميشن
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة بعد 5 ثواني
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * تحديث السنة الحالية في الفوتر
 */
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('.footer-bottom p');
    yearElements.forEach(element => {
        element.textContent = element.textContent.replace('2024', new Date().getFullYear());
    });
}

/**
 * دالة لفتح صفحة التواصل
 */
function openContactPage() {
    window.location.href = 'about.html#contact';
}

/**
 * دالة لمشاركة المنصة
 */
function sharePlatform() {
    const url = window.location.href.replace('/about.html', '');
    const text = 'تعرف على منصة IT Guide - منصة مشاريع طلاب التقنية!';
    
    if (navigator.share) {
        navigator.share({
            title: 'IT Guide',
            text: text,
            url: url
        });
    } else {
        // نسخ الرابط
        navigator.clipboard.writeText(url).then(() => {
            showMessage('success', 'تم نسخ رابط المنصة');
        });
    }
}

// إضافة الدوال للـwindow للوصول من HTML
window.openContactPage = openContactPage;
window.sharePlatform = sharePlatform;