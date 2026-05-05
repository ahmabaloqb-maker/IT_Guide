/**
 * JavaScript لصفحة رفع المشروع
 */

let selectedTechnologies = [];

document.addEventListener('DOMContentLoaded', function() {
    setupTechSelector();
    setupFormSubmit();
});

function setupTechSelector() {
    const checkboxes = document.querySelectorAll('.tech-option input');
    const selectedContainer = document.getElementById('selectedTechs');
    
    function updateSelectedTechs() {
        selectedContainer.innerHTML = '';
        if (selectedTechnologies.length === 0) {
            selectedContainer.innerHTML = '<span style="color: #999;">لم تختر أي تقنية</span>';
            return;
        }
        
        selectedTechnologies.forEach(tech => {
            const tag = document.createElement('div');
            tag.className = 'tech-tag';
            tag.innerHTML = `${tech} <span class="remove" onclick="removeTech('${tech}')" style="cursor:pointer;">&times;</span>`;
            selectedContainer.appendChild(tag);
        });
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const tech = this.value;
            if (this.checked) {
                if (!selectedTechnologies.includes(tech)) {
                    selectedTechnologies.push(tech);
                }
            } else {
                selectedTechnologies = selectedTechnologies.filter(t => t !== tech);
            }
            updateSelectedTechs();
        });
    });
    
    updateSelectedTechs();
}

function removeTech(tech) {
    selectedTechnologies = selectedTechnologies.filter(t => t !== tech);
    const checkbox = document.querySelector(`.tech-option input[value="${tech}"]`);
    if (checkbox) checkbox.checked = false;
    const selectedContainer = document.getElementById('selectedTechs');
    if (selectedTechnologies.length === 0) {
        selectedContainer.innerHTML = '<span style="color: #999;">لم تختر أي تقنية</span>';
    } else {
        const tag = document.createElement('div');
        tag.className = 'tech-tag';
        tag.innerHTML = `${tech} <span class="remove" onclick="removeTech('${tech}')">&times;</span>`;
    }
    location.reload(); // Simple refresh to update
}

function showAlert(message, type) {
    const form = document.querySelector('.upload-form');
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    form.insertBefore(alertDiv, form.firstChild);
    
    setTimeout(() => {
        if (alertDiv.parentNode) alertDiv.remove();
    }, 3000);
}

function setupFormSubmit() {
    const form = document.getElementById('uploadForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const level = document.getElementById('projectLevel').value;
        const category = document.getElementById('projectCategory').value;
        const projectURL = document.getElementById('projectURL').value.trim();
        const githubURL = document.getElementById('githubURL').value.trim();
        
        if (!title) {
            showAlert('يرجى إدخال اسم المشروع', 'error');
            return;
        }
        if (!description) {
            showAlert('يرجى إدخال وصف المشروع', 'error');
            return;
        }
        if (!level) {
            showAlert('يرجى اختيار المستوى الدراسي', 'error');
            return;
        }
        if (!category) {
            showAlert('يرجى اختيار التخصص', 'error');
            return;
        }
        if (selectedTechnologies.length === 0) {
            showAlert('يرجى اختيار التقنيات المستخدمة', 'error');
            return;
        }
        
        const newProject = {
            title: title,
            description: description,
            level: level,
            category: category,
            technologies: selectedTechnologies,
            projectURL: projectURL,
            githubURL: githubURL,
            icon: "fas fa-code",
            views: 0,
            downloads: 0,
            likes: 0
        };
        
        addProject(newProject);
        showAlert('تم رفع المشروع بنجاح!', 'success');
        
        setTimeout(() => {
            window.location.href = 'projects.html';
        }, 1500);
    });
}

function resetForm() {
    document.getElementById('uploadForm').reset();
    selectedTechnologies = [];
    document.querySelectorAll('.tech-option input').forEach(cb => cb.checked = false);
    document.getElementById('selectedTechs').innerHTML = '<span style="color: #999;">لم تختر أي تقنية</span>';
    showAlert('تم إعادة تعيين النموذج', 'success');
}

window.removeTech = removeTech;
window.resetForm = resetForm;