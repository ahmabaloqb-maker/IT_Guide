/**
 * JavaScript لصفحة "عن المنصة"
 */

document.addEventListener('DOMContentLoaded', function() {
    setupFAQ();
    setupContactForm();
});

function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Close other FAQs
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.nextElementSibling.classList.remove('active');
                    q.querySelector('i').classList.remove('fa-chevron-up');
                    q.querySelector('i').classList.add('fa-chevron-down');
                }
            });
            
            answer.classList.toggle('active');
            if (answer.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        if (!name || !email || !subject || !message) {
            showMessage('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('البريد الإلكتروني غير صالح', 'error');
            return;
        }
        
        // Save message to localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push({
            name: name,
            email: email,
            subject: subject,
            message: message,
            date: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
        contactForm.reset();
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(message, type) {
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message alert alert-${type}`;
    messageDiv.style.cssText = 'margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px;';
    messageDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    messageDiv.style.color = type === 'success' ? '#155724' : '#721c24';
    messageDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    
    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => {
        if (messageDiv.parentNode) messageDiv.remove();
    }, 4000);
}