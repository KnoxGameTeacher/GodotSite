// script.js - Complete working version with proper unit page updates

let courseStructure = {};

// Initialize course structure from global COURSE_DATA
function initCourseStructure() {
    if (typeof COURSE_DATA !== 'undefined') {
        courseStructure = COURSE_DATA;
        console.log('✅ Course data loaded:', Object.keys(courseStructure).length, 'units found');
        return true;
    } else {
        console.error('❌ COURSE_DATA not found! Make sure course-data.js is loaded first.');
        courseStructure = {};
        return false;
    }
}

// Save progress for a specific step
function saveProgress(unitId, sectionId, stepId, completed) {
    const key = `unit_${unitId}_section_${sectionId}`;
    const saved = JSON.parse(localStorage.getItem(key)) || {};
    saved[stepId] = completed;
    localStorage.setItem(key, JSON.stringify(saved));
    
    // Update displays
    updateSectionProgress(unitId, sectionId);
    updateUnitProgress(unitId);
    updateOverallProgress();
}

function loadProgress(unitId, sectionId) {
    const key = `unit_${unitId}_section_${sectionId}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}

function getUnitProgress(unitId) {
    const unitData = courseStructure[unitId];
    if (!unitData) return { completed: 0, total: 0, percentage: 0 };
    
    let totalSteps = 0;
    let completedSteps = 0;
    
    // Count steps from pages
    if (unitData.pages) {
        for (let section = 1; section <= unitData.sections; section++) {
            const saved = loadProgress(unitId, section);
            const sectionSteps = unitData.pages[section]?.steps || 0;
            totalSteps += sectionSteps;
            const sectionCompleted = Object.values(saved).filter(v => v === true).length;
            completedSteps += sectionCompleted;
        }
    } else {
        // Fallback: count from sections
        for (let section = 1; section <= unitData.sections; section++) {
            const saved = loadProgress(unitId, section);
            totalSteps += 3; // Assume 3 steps per section
            const sectionCompleted = Object.values(saved).filter(v => v === true).length;
            completedSteps += sectionCompleted;
        }
    }
    
    return {
        completed: completedSteps,
        total: totalSteps,
        percentage: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
    };
}

function updateSectionProgress(unitId, sectionId) {
    const saved = loadProgress(unitId, sectionId);
    const checkboxes = document.querySelectorAll('.step-check');
    const totalSteps = checkboxes.length;
    let completedSteps = 0;
    
    checkboxes.forEach(checkbox => {
        const step = checkbox.getAttribute('data-step');
        if (saved[step]) {
            completedSteps++;
            checkbox.checked = true;
        }
    });
    
    const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressPercent) progressPercent.textContent = `${Math.round(percentage)}%`;
}

function updateUnitProgress(unitId) {
    const progress = getUnitProgress(unitId);
    console.log(`Updating Unit ${unitId} progress: ${Math.round(progress.percentage)}%`);
    
    // Update main unit progress bar on unit index page
    const unitFill = document.getElementById('unit-progress-fill');
    const unitStatus = document.getElementById('completion-status');
    
    if (unitFill) {
        unitFill.style.width = `${progress.percentage}%`;
    }
    if (unitStatus) {
        unitStatus.innerHTML = `Unit Progress: ${Math.round(progress.percentage)}%`;
    }
    
    // Update each section's progress card on the unit index page
    const unitData = courseStructure[unitId];
    if (unitData && unitData.pages) {
        for (let section = 1; section <= unitData.sections; section++) {
            const sectionProgressSpan = document.getElementById(`section${section}-progress`);
            if (sectionProgressSpan) {
                const saved = loadProgress(unitId, section);
                const sectionSteps = unitData.pages[section]?.steps || 0;
                const sectionCompleted = Object.values(saved).filter(v => v === true).length;
                const sectionPercent = sectionSteps > 0 ? (sectionCompleted / sectionSteps) * 100 : 0;
                sectionProgressSpan.textContent = `${Math.round(sectionPercent)}% complete`;
                console.log(`  Section ${section}: ${Math.round(sectionPercent)}% (${sectionCompleted}/${sectionSteps} steps)`);
            }
        }
    }
}

function updateOverallProgress() {
    let totalStepsAllUnits = 0;
    let completedStepsAllUnits = 0;
    
    for (const unitId in courseStructure) {
        const progress = getUnitProgress(parseInt(unitId));
        totalStepsAllUnits += progress.total;
        completedStepsAllUnits += progress.completed;
    }
    
    const overallPercentage = totalStepsAllUnits > 0 ? (completedStepsAllUnits / totalStepsAllUnits) * 100 : 0;
    
    // Update main page displays
    const overallFill = document.getElementById('overall-progress-fill');
    const overallProgressSpan = document.getElementById('overall-progress');
    const completedStepsSpan = document.getElementById('completed-steps');
    const totalStepsSpan = document.getElementById('total-steps-count');
    
    if (overallFill) overallFill.style.width = `${overallPercentage}%`;
    if (overallProgressSpan) overallProgressSpan.textContent = `${Math.round(overallPercentage)}%`;
    if (completedStepsSpan) completedStepsSpan.textContent = completedStepsAllUnits;
    if (totalStepsSpan) totalStepsSpan.textContent = totalStepsAllUnits;  // This is the "tasks" number
    
    // Update the stats cards
    const totalUnitsSpan = document.getElementById('total-units');
    const totalSectionsSpan = document.getElementById('total-sections');
    const totalStepsCardSpan = document.getElementById('total-steps');  // This is the "Tasks" stat card
    
    if (totalUnitsSpan) totalUnitsSpan.textContent = Object.keys(courseStructure).length;
    
    if (totalSectionsSpan) {
        let totalSections = 0;
        for (const unitId in courseStructure) {
            totalSections += courseStructure[unitId].sections;
        }
        totalSectionsSpan.textContent = totalSections;
    }
    
    // THIS IS THE KEY FIX - Update the Tasks stat card
    if (totalStepsCardSpan) {
        totalStepsCardSpan.textContent = totalStepsAllUnits;
    }
    
    console.log(`📊 Overall stats: ${totalStepsAllUnits} total tasks, ${completedStepsAllUnits} completed, ${Math.round(overallPercentage)}%`);
}

function initializeMainPage() {
    const unitsGrid = document.getElementById('units-grid');
    if (!unitsGrid) {
        console.log('Not on main page, skipping unit grid initialization');
        return false;
    }
    
    console.log('Initializing main page with', Object.keys(courseStructure).length, 'units');
    
    if (Object.keys(courseStructure).length === 0) {
        unitsGrid.innerHTML = '<div class="loading">⚠️ No course data found. Please check course-data.js</div>';
        return false;
    }
    
    unitsGrid.innerHTML = '';
    
    for (const [id, unit] of Object.entries(courseStructure)) {
        const progress = getUnitProgress(parseInt(id));
        
        const unitCard = document.createElement('div');
        unitCard.className = 'unit-card';
        unitCard.innerHTML = `
            <div class="unit-card-header">
                <div class="unit-number">UNIT ${id}</div>
                <h3>${unit.name}</h3>
                <p class="unit-description">${unit.description}</p>
            </div>
            <div class="unit-card-body">
                <div class="unit-progress-info">
                    <div class="unit-progress-text">
                        <span>Progress</span>
                        <span>${Math.round(progress.percentage)}%</span>
                    </div>
                    <div class="unit-progress-bar">
                        <div class="unit-progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                </div>
                <div class="unit-stats">
                    <span>📚 ${unit.sections} sections</span>
                    <span>✅ ${progress.completed}/${progress.total} tasks</span>
                    <span>⏱️ ${unit.estimatedTime}</span>
                </div>
            </div>
            <div class="unit-card-footer">
                <a href="units/unit${id}/index.html" class="start-unit-button">Start Unit ${id} →</a>
            </div>
        `;
        
        unitsGrid.appendChild(unitCard);
    }
    
    updateOverallProgress();
    console.log('✅ Main page initialized with', unitsGrid.children.length, 'unit cards');
    return true;
}

function initializeCheckboxes() {
    const stepContainers = document.querySelectorAll('.steps');
    if (stepContainers.length === 0) return false;
    
    console.log('Initializing checkboxes for', stepContainers.length, 'sections');
    
    stepContainers.forEach(container => {
        const unitId = container.getAttribute('data-unit');
        const sectionId = container.getAttribute('data-section');
        if (!unitId || !sectionId) return;
        
        const saved = loadProgress(unitId, sectionId);
        const checkboxes = container.querySelectorAll('.step-check');
        
        checkboxes.forEach(checkbox => {
            const step = checkbox.getAttribute('data-step');
            if (saved[step]) checkbox.checked = true;
            
            checkbox.addEventListener('change', function() {
                saveProgress(unitId, sectionId, step, this.checked);
                showStatusMessage(container, `Step ${step} ${this.checked ? 'completed' : 'unchecked'}`);
            });
        });
        
        updateSectionProgress(unitId, sectionId);
    });
    return true;
}

function showStatusMessage(container, message) {
    const statusMsg = document.createElement('div');
    statusMsg.className = 'status-message';
    statusMsg.textContent = `✓ ${message} - Auto-saved`;
    
    const oldMessages = document.querySelectorAll('.status-message');
    oldMessages.forEach(msg => msg.remove());
    
    container.parentNode.insertBefore(statusMsg, container.nextSibling);
    setTimeout(() => statusMsg.remove(), 2000);
}

function initializeUnitOverview() {
    // Check if we're on a unit index page (has sections-grid)
    const sectionsGrid = document.querySelector('.sections-grid');
    if (!sectionsGrid) {
        console.log('Not on a unit overview page, skipping');
        return false;
    }
    
    // Extract unit ID from the path
    const pathParts = window.location.pathname.split('/');
    let unitId = null;
    
    // Look for unit pattern in path
    for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === 'unit' && pathParts[i + 1]) {
            unitId = parseInt(pathParts[i + 1]);
            break;
        }
    }
    
    // Also check for unit number in the page content
    if (!unitId) {
        const unitHeader = document.querySelector('.unit-header h1');
        if (unitHeader) {
            const match = unitHeader.textContent.match(/Unit\s+(\d+)/);
            if (match) unitId = parseInt(match[1]);
        }
    }
    
    if (unitId && courseStructure[unitId]) {
        console.log(`🎯 Updating unit overview for Unit ${unitId}`);
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            updateUnitProgress(unitId);
        }, 100);
        return true;
    } else if (unitId) {
        console.warn(`Unit ${unitId} not found in course structure`);
    }
    
    return false;
}

// Force update unit progress after any checkbox change
function forceUpdateUnitPage() {
    const sectionsGrid = document.querySelector('.sections-grid');
    if (sectionsGrid) {
        const pathParts = window.location.pathname.split('/');
        let unitId = null;
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === 'unit' && pathParts[i + 1]) {
                unitId = parseInt(pathParts[i + 1]);
                break;
            }
        }
        if (unitId && courseStructure[unitId]) {
            updateUnitProgress(unitId);
        }
    }
}

// Override saveProgress to also update unit page if needed
const originalSaveProgress = saveProgress;
saveProgress = function(unitId, sectionId, stepId, completed) {
    originalSaveProgress(unitId, sectionId, stepId, completed);
    forceUpdateUnitPage();
};

// Add loading styles if not present
const loadingStyles = `
    .loading {
        text-align: center;
        padding: 50px;
        color: var(--retro-cyan);
        font-family: monospace;
        font-size: 1.2rem;
    }
    .loading::before {
        content: "📚";
        display: inline-block;
        margin-right: 10px;
        animation: pulse 1s infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
    }
`;

if (!document.querySelector('#loading-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize course data
    const dataLoaded = initCourseStructure();
    
    if (dataLoaded) {
        // Run all initializers
        initializeMainPage();
        initializeCheckboxes();
        initializeUnitOverview();
        
        // Extra check for unit overview pages - run again after a short delay
        setTimeout(() => {
            if (document.querySelector('.sections-grid')) {
                console.log('🔄 Running delayed unit overview update');
                initializeUnitOverview();
            }
        }, 500);
    } else {
        console.error('Failed to load course data, retrying...');
        // Retry after a short delay
        setTimeout(() => {
            if (initCourseStructure()) {
                initializeMainPage();
                initializeCheckboxes();
                initializeUnitOverview();
            }
        }, 500);
    }
});

// Also run when page is fully loaded (for images, etc.)
window.addEventListener('load', function() {
    console.log('Window fully loaded, checking for unit overview...');
    if (document.querySelector('.sections-grid') && Object.keys(courseStructure).length > 0) {
        initializeUnitOverview();
    }
});