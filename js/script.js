// Portfolio Application - Interactive Features
class PortfolioApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.projects = [];
        this.filteredProjects = [];
        this.currentSort = 'date';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.updateGreeting();
        this.loadProjects();
        this.setupFormValidation();
    }

    // Theme Management
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Mobile menu
        document.querySelector('.hamburger').addEventListener('click', () => this.toggleMobileMenu());
        
        // Expandable sections
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleExpandable(e));
        });
        
        // Project controls
        document.getElementById('project-search').addEventListener('input', (e) => this.handleSearch(e));
        document.getElementById('project-filter').addEventListener('change', (e) => this.handleFilter(e));
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSort(e));
        });
        document.getElementById('reset-filters').addEventListener('click', () => this.resetFilters());
        
        // Form submission
        document.getElementById('contact-form').addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Update theme icon
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    loadTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    // Personalized Greeting
    updateGreeting() {
        const greetingElement = document.getElementById('personalized-greeting');
        const subtitleElement = document.getElementById('greeting-subtitle');
        const hour = new Date().getHours();
        let greeting = '';
        let subtitle = '';

        if (hour < 12) {
            greeting = 'Good Morning!';
            subtitle = 'Ready to start the day?';
        } else if (hour < 18) {
            greeting = 'Good Afternoon!';
            subtitle = 'Hope you\'re having a productive day';
        } else {
            greeting = 'Good Evening!';
            subtitle = 'Time to unwind and explore';
        }

        // Add animation
        greetingElement.style.animation = 'none';
        subtitleElement.style.animation = 'none';
        
        setTimeout(() => {
            greetingElement.textContent = greeting;
            subtitleElement.textContent = subtitle;
            greetingElement.style.animation = 'slideInLeft 0.5s ease-out';
            subtitleElement.style.animation = 'slideInLeft 0.5s ease-out 0.1s both';
        }, 100);
    }

    // Navigation
    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update active section
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        // Close mobile menu if open
        this.closeMobileMenu();
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        document.querySelector('.nav-menu').classList.remove('active');
    }

    // Expandable Sections
    toggleExpandable(e) {
        const button = e.currentTarget;
        const targetId = button.getAttribute('data-target');
        const content = document.getElementById(targetId);
        const icon = button.querySelector('.expand-icon');

        content.classList.toggle('active');
        icon.textContent = content.classList.contains('active') ? '−' : '+';
    }

    // Project Management
    async loadProjects() {
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Sample project data - in a real app, this would come from an API
            this.projects = [
                {
                    id: 1,
                    title: 'E-commerce Website',
                    category: 'web',
                    description: 'A fully responsive e-commerce platform with shopping cart and payment integration.',
                    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                    date: '2024-01-15',
                    image: 'project1.jpg'
                },
                {
                    id: 2,
                    title: 'Mobile Fitness App',
                    category: 'mobile',
                    description: 'Cross-platform mobile application for tracking workouts and nutrition.',
                    technologies: ['React Native', 'Firebase', 'Redux'],
                    date: '2024-02-20',
                    image: 'project2.jpg'
                },
                {
                    id: 3,
                    title: 'Portfolio Website Design',
                    category: 'design',
                    description: 'Modern UI/UX design for a personal portfolio website.',
                    technologies: ['Figma', 'Adobe XD', 'Illustrator'],
                    date: '2024-01-05',
                    image: 'project3.jpg'
                },
                {
                    id: 4,
                    title: 'Task Management System',
                    category: 'web',
                    description: 'Web-based task management system with real-time updates.',
                    technologies: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
                    date: '2023-12-10',
                    image: 'project4.jpg'
                },
                {
                    id: 5,
                    title: 'Weather Dashboard',
                    category: 'web',
                    description: 'Real-time weather dashboard with data visualization.',
                    technologies: ['JavaScript', 'Chart.js', 'Weather API'],
                    date: '2023-11-25',
                    image: 'project5.jpg'
                },
                {
                    id: 6,
                    title: 'Social Media Analytics',
                    category: 'other',
                    description: 'Analytics platform for social media performance tracking.',
                    technologies: ['Python', 'Django', 'D3.js', 'Redis'],
                    date: '2023-10-15',
                    image: 'project6.jpg'
                }
            ];

            this.filteredProjects = [...this.projects];
            this.renderProjects();
            this.hideLoadingSpinner();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('Failed to load projects. Please try again later.');
            this.hideLoadingSpinner();
        }
    }

    renderProjects() {
        const grid = document.getElementById('projects-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (this.filteredProjects.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        grid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        grid.innerHTML = this.filteredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <h3>${project.title}</h3>
                <span class="category">${this.getCategoryLabel(project.category)}</span>
                <div class="date">${new Date(project.date).toLocaleDateString()}</div>
                <p class="description">${project.description}</p>
                <div class="tech-stack">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    getCategoryLabel(category) {
        const labels = {
            'web': 'Web Development',
            'mobile': 'Mobile App',
            'design': 'UI/UX Design',
            'other': 'Other'
        };
        return labels[category] || category;
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        this.filterProjects(searchTerm);
    }

    handleFilter(e) {
        const filterValue = e.target.value;
        this.filterProjects('', filterValue);
    }

    handleSort(e) {
        const sortBy = e.currentTarget.getAttribute('data-sort');
        
        // Update active sort button
        document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        this.currentSort = sortBy;
        this.sortProjects();
        this.renderProjects();
    }

    filterProjects(searchTerm = '', filterValue = 'all') {
        this.filteredProjects = this.projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                                project.description.toLowerCase().includes(searchTerm) ||
                                project.technologies.some(tech => tech.toLowerCase().includes(searchTerm));
            
            const matchesFilter = filterValue === 'all' || project.category === filterValue;
            
            return matchesSearch && matchesFilter;
        });
        
        this.sortProjects();
        this.renderProjects();
    }

    sortProjects() {
        this.filteredProjects.sort((a, b) => {
            if (this.currentSort === 'date') {
                return new Date(b.date) - new Date(a.date);
            } else if (this.currentSort === 'name') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    }

    resetFilters() {
        document.getElementById('project-search').value = '';
        document.getElementById('project-filter').value = 'all';
        this.filteredProjects = [...this.projects];
        this.sortProjects();
        this.renderProjects();
    }

    hideLoadingSpinner() {
        document.getElementById('loading-spinner').classList.add('hidden');
    }

    showError(message) {
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // Form Validation and Submission
    setupFormValidation() {
        const form = document.getElementById('contact-form');
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearError(e.target));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        this.displayFieldError(field, isValid, errorMessage);
        return isValid;
    }

    displayFieldError(field, isValid, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (!isValid) {
            field.style.borderColor = 'var(--accent-color)';
            errorElement.textContent = message;
        } else {
            field.style.borderColor = 'var(--border-color)';
            errorElement.textContent = '';
        }
    }

    clearError(field) {
        field.style.borderColor = 'var(--border-color)';
        document.getElementById(`${field.name}-error`).textContent = '';
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = document.getElementById('submit-btn');
        const formMessage = document.getElementById('form-message');

        // Validate all fields
        let isFormValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormMessage('Please fix the errors above', 'error');
            return;
        }

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span>Sending...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate successful submission
            this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            
            // Save form data to local storage (simulated)
            this.saveFormData(new FormData(form));
            
        } catch (error) {
            this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    }

    showFormMessage(message, type) {
        const formMessage = document.getElementById('form-message');
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.classList.remove('hidden');

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }

    saveFormData(formData) {
        const formEntries = Object.fromEntries(formData);
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
            ...formEntries,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});