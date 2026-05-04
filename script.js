// script.js - Complete working version with proper progress propagation
// Detect if we're on GitHub Pages and set base path
const isGitHubPages = window.location.hostname.includes('github.io');
const repoName = isGitHubPages ? window.location.pathname.split('/')[1] : '';
const basePath = isGitHubPages ? `/${repoName}/` : './';

console.log(`Base path: ${basePath}`);
let courseStructure = {};

// Initialize course structure from global COURSE_DATA
function initCourseStructure() {
    if (typeof COURSE_DATA !== 'undefined') {
        courseStructure = COURSE_DATA;
        console.log('✅ Course data loaded:', Object.keys(courseStructure).length, 'units found');
        return true;
    } else {
        console.error('❌ COURSE_DATA not found!');
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
    
    console.log(`💾 Saved: Unit ${unitId}, Section ${sectionId}, Step ${stepId} = ${completed}`);
    
    // Update all displays
    updateSectionProgressDisplay(unitId, sectionId);
    
    // If we're on a unit overview page, update that too
    if (document.querySelector('.sections-grid')) {
        updateUnitOverviewProgress(unitId);
    }
    
    // If we're on the main page, update that too
    if (document.getElementById('units-grid')) {
        updateMainPageProgress();
    }
}

function loadProgress(unitId, sectionId) {
    const key = `unit_${unitId}_section_${sectionId}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}

// Get total progress for a unit
function getUnitTotalProgress(unitId) {
    const unitData = courseStructure[unitId];
    if (!unitData) return { completed: 0, total: 0, percentage: 0 };
    
    let totalSteps = 0;
    let completedSteps = 0;
    
    for (let section = 1; section <= unitData.sections; section++) {
        const saved = loadProgress(unitId, section);
        const sectionSteps = unitData.pages[section]?.steps || 0;
        totalSteps += sectionSteps;
        const sectionCompleted = Object.values(saved).filter(v => v === true).length;
        completedSteps += sectionCompleted;
        
        console.log(`  Section ${section}: ${sectionCompleted}/${sectionSteps} steps`);
    }
    
    console.log(`Unit ${unitId} total: ${completedSteps}/${totalSteps} steps = ${Math.round((completedSteps/totalSteps)*100)}%`);
    
    return {
        completed: completedSteps,
        total: totalSteps,
        percentage: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
    };
}

// Update section progress bar on the current page
function updateSectionProgressDisplay(unitId, sectionId) {
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
    
    console.log(`Section ${sectionId} progress: ${completedSteps}/${totalSteps} = ${Math.round(percentage)}%`);
}

// Update unit overview page (units/unitX/index.html)
function updateUnitOverviewProgress(unitId) {
    console.log(`📊 Updating Unit ${unitId} overview page...`);
    
    const unitData = courseStructure[unitId];
    if (!unitData) return;
    
    // Calculate total progress
    let totalSteps = 0;
    let completedSteps = 0;
    
    for (let section = 1; section <= unitData.sections; section++) {
        const saved = loadProgress(unitId, section);
        const sectionSteps = unitData.pages[section]?.steps || 0;
        totalSteps += sectionSteps;
        const sectionCompleted = Object.values(saved).filter(v => v === true).length;
        completedSteps += sectionCompleted;
    }
    
    const unitPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    
    // Update main unit progress bar
    const unitFill = document.getElementById('unit-progress-fill');
    const unitStatus = document.getElementById('completion-status');
    
    if (unitFill) {
        unitFill.style.width = `${unitPercentage}%`;
        console.log(`  Unit progress bar set to ${Math.round(unitPercentage)}%`);
    }
    if (unitStatus) {
        unitStatus.innerHTML = `Unit Progress: ${Math.round(unitPercentage)}%`;
    }
    
    // Update each section card
    for (let section = 1; section <= unitData.sections; section++) {
        const sectionSpan = document.getElementById(`section${section}-progress`);
        if (sectionSpan) {
            const saved = loadProgress(unitId, section);
            const sectionSteps = unitData.pages[section]?.steps || 0;
            const sectionCompleted = Object.values(saved).filter(v => v === true).length;
            const sectionPercent = sectionSteps > 0 ? (sectionCompleted / sectionSteps) * 100 : 0;
            sectionSpan.textContent = `${Math.round(sectionPercent)}% complete`;
            console.log(`  Section ${section}: ${Math.round(sectionPercent)}% complete`);
        }
    }
}

// Update main page (index.html)
function updateMainPageProgress() {
    console.log(`📊 Updating main page progress...`);
    
    const unitsGrid = document.getElementById('units-grid');
    if (!unitsGrid) return;
    
    // Update each unit card
    const unitCards = unitsGrid.querySelectorAll('.unit-card');
    
    for (const [index, unitId] of Object.keys(courseStructure).entries()) {
        const progress = getUnitTotalProgress(parseInt(unitId));
        const card = unitCards[index];
        
        if (card) {
            // Update percentage display
            const percentSpan = card.querySelector('.unit-progress-text span:last-child');
            if (percentSpan) percentSpan.textContent = `${Math.round(progress.percentage)}%`;
            
            // Update progress bar
            const progressFill = card.querySelector('.unit-progress-fill');
            if (progressFill) progressFill.style.width = `${progress.percentage}%`;
            
            // Update tasks count
            const statsSpan = card.querySelector('.unit-stats span:nth-child(2)');
            if (statsSpan) statsSpan.innerHTML = `✅ ${progress.completed}/${progress.total} tasks`;
        }
    }
    
    // Update overall progress
    let totalStepsAllUnits = 0;
    let completedStepsAllUnits = 0;
    
    for (const unitId in courseStructure) {
        const progress = getUnitTotalProgress(parseInt(unitId));
        totalStepsAllUnits += progress.total;
        completedStepsAllUnits += progress.completed;
    }
    
    const overallPercentage = totalStepsAllUnits > 0 ? (completedStepsAllUnits / totalStepsAllUnits) * 100 : 0;
    
    const overallFill = document.getElementById('overall-progress-fill');
    const overallProgressSpan = document.getElementById('overall-progress');
    const completedStepsSpan = document.getElementById('completed-steps');
    const totalStepsSpan = document.getElementById('total-steps-count');
    const totalStepsCardSpan = document.getElementById('total-steps');
    
    if (overallFill) overallFill.style.width = `${overallPercentage}%`;
    if (overallProgressSpan) overallProgressSpan.textContent = `${Math.round(overallPercentage)}%`;
    if (completedStepsSpan) completedStepsSpan.textContent = completedStepsAllUnits;
    if (totalStepsSpan) totalStepsSpan.textContent = totalStepsAllUnits;
    if (totalStepsCardSpan) totalStepsCardSpan.textContent = totalStepsAllUnits;
    
    console.log(`Overall progress: ${completedStepsAllUnits}/${totalStepsAllUnits} = ${Math.round(overallPercentage)}%`);
}

// Initialize main page (index.html)
function initializeMainPage() {
    const unitsGrid = document.getElementById('units-grid');
    if (!unitsGrid) return false;
    
    if (Object.keys(courseStructure).length === 0) {
        unitsGrid.innerHTML = '<div class="loading">⚠️ No course data found.</div>';
        return false;
    }
    
    unitsGrid.innerHTML = '';
    
    for (const [id, unit] of Object.entries(courseStructure)) {
        const progress = getUnitTotalProgress(parseInt(id));
        
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
    
    updateMainPageProgress();
    return true;
}

// Initialize checkboxes on section pages
function initializeCheckboxes() {
    const stepContainers = document.querySelectorAll('.steps');
    if (stepContainers.length === 0) return false;
    
    console.log('=== INITIALIZING CHECKBOXES ===');
    
    stepContainers.forEach(container => {
        const unitId = container.getAttribute('data-unit');
        const sectionId = container.getAttribute('data-section');
        console.log(`Container: Unit ${unitId}, Section ${sectionId}`);
        
        if (!unitId || !sectionId) return;
        
        // Load and apply saved progress
        const saved = loadProgress(unitId, sectionId);
        const checkboxes = container.querySelectorAll('.step-check');
        
        console.log(`Found ${checkboxes.length} checkboxes`);
        
        checkboxes.forEach(checkbox => {
            const step = checkbox.getAttribute('data-step');
            
            // Apply saved state
            if (saved[step]) {
                checkbox.checked = true;
                console.log(`  Step ${step}: checked = true (from saved)`);
            }
            
            // Direct event binding
            checkbox.onchange = function(e) {
                const isChecked = this.checked;
                const stepNum = this.getAttribute('data-step');
                console.log(`🎯 CHECKBOX ${stepNum} CHANGED to ${isChecked}`);
                
                // Save immediately
                const key = `unit_${unitId}_section_${sectionId}`;
                const currentSaved = JSON.parse(localStorage.getItem(key)) || {};
                currentSaved[stepNum] = isChecked;
                localStorage.setItem(key, JSON.stringify(currentSaved));
                
                // Update progress bar on current page
                const allCheckboxes = container.querySelectorAll('.step-check');
                let completed = 0;
                allCheckboxes.forEach(cb => {
                    if (cb.checked) completed++;
                });
                const percent = (completed / allCheckboxes.length) * 100;
                
                const progressFill = container.querySelector('.progress-fill');
                const progressPercent = document.getElementById('progress-percent');
                
                if (progressFill) progressFill.style.width = `${percent}%`;
                if (progressPercent) progressPercent.textContent = `${Math.round(percent)}%`;
                
                // Show status message
                let statusMsg = container.parentNode.querySelector('.status-message');
                if (!statusMsg) {
                    statusMsg = document.createElement('div');
                    statusMsg.className = 'status-message';
                    container.parentNode.insertBefore(statusMsg, container.nextSibling);
                }
                statusMsg.textContent = `✓ Step ${stepNum} ${isChecked ? 'completed' : 'unchecked'} - Auto-saved`;
                statusMsg.style.display = 'block';
                
                setTimeout(() => {
                    statusMsg.style.display = 'none';
                }, 2000);
                
                // Update unit overview if we're on that page (but we're not, we're on section page)
                // This will update localStorage only, the other pages will read it when loaded
            };
        });
        
        // Set initial progress bar
        const allCheckboxes = container.querySelectorAll('.step-check');
        let completed = 0;
        allCheckboxes.forEach(cb => {
            if (cb.checked) completed++;
        });
        const percent = allCheckboxes.length > 0 ? (completed / allCheckboxes.length) * 100 : 0;
        
        const progressFill = container.querySelector('.progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressPercent) progressPercent.textContent = `${Math.round(percent)}%`;
    });
    
    return true;
}

// Initialize unit overview page (units/unitX/index.html)
function initializeUnitOverview() {
    const sectionsGrid = document.querySelector('.sections-grid');
    if (!sectionsGrid) return false;
    
    console.log('=== INITIALIZING UNIT OVERVIEW PAGE ===');
    
    // Extract unit ID from the path
    const pathParts = window.location.pathname.split('/');
    let unitId = null;
    
    for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === 'unit' && pathParts[i + 1]) {
            unitId = parseInt(pathParts[i + 1]);
            break;
        }
    }
    
    if (!unitId) {
        const unitHeader = document.querySelector('.unit-header h1');
        if (unitHeader) {
            const match = unitHeader.textContent.match(/Unit\s+(\d+)/);
            if (match) unitId = parseInt(match[1]);
        }
    }
    
    if (unitId && courseStructure[unitId]) {
        updateUnitOverviewProgress(unitId);
        return true;
    }
    return false;
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initCourseStructure();
    initializeMainPage();
    initializeCheckboxes();
    initializeUnitOverview();
});

// Also run when page is fully loaded (for any dynamic content)
window.addEventListener('load', function() {
    console.log('Window fully loaded, refreshing progress displays...');
    if (document.getElementById('units-grid')) {
        updateMainPageProgress();
    }
    if (document.querySelector('.sections-grid')) {
        const pathParts = window.location.pathname.split('/');
        let unitId = null;
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === 'unit' && pathParts[i + 1]) {
                unitId = parseInt(pathParts[i + 1]);
                break;
            }
        }
        if (unitId) updateUnitOverviewProgress(unitId);
    }
});