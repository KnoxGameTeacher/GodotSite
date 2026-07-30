// script.js - Complete working version with Unit 2 support

let courseStructure = {};

// Initialize course structure from global COURSE_DATA
function initCourseStructure() {
    if (typeof COURSE_DATA !== 'undefined') {
        courseStructure = COURSE_DATA;
        console.log('✅ Course data loaded:', Object.keys(courseStructure).length, 'units found');
        for (const unitId in courseStructure) {
            console.log(`   Unit ${unitId}: ${courseStructure[unitId].name} - ${courseStructure[unitId].sections} sections`);
        }
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
    
    // Update displays
    updateSectionProgress(unitId, sectionId);
    updateUnitProgress(unitId);
    updateOverallProgress();
    updateMainPageUnitCards();
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
    
    for (const [section, pageData] of Object.entries(unitData.pages)) {
        const saved = loadProgress(unitId, section);
        const sectionSteps = pageData.steps || 0;
        totalSteps += sectionSteps;
        const sectionCompleted = Object.values(saved).filter(v => v === true).length;
        completedSteps += sectionCompleted;
        
        console.log(`  Unit ${unitId}, ${section}: ${sectionCompleted}/${sectionSteps} steps`);
    }
    
    console.log(`Unit ${unitId} total: ${completedSteps}/${totalSteps} steps = ${Math.round((completedSteps/totalSteps)*100)}%`);
    
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
    const progress = getUnitTotalProgress(unitId);
    
    const unitFill = document.getElementById('unit-progress-fill');
    const unitStatus = document.getElementById('completion-status');
    
    if (unitFill) unitFill.style.width = `${progress.percentage}%`;
    if (unitStatus) unitStatus.innerHTML = `Unit Progress: ${Math.round(progress.percentage)}%`;
    
    const unitData = courseStructure[unitId];
    if (unitData && unitData.pages) {
        for (const [sectionId, pageData] of Object.entries(unitData.pages)) {
            const sectionProgressSpan = document.getElementById(`section${sectionId}-progress`);
            if (sectionProgressSpan) {
                const saved = loadProgress(unitId, sectionId);
                const sectionSteps = pageData.steps || 0;
                const sectionCompleted = Object.values(saved).filter(v => v === true).length;
                const sectionPercent = sectionSteps > 0 ? (sectionCompleted / sectionSteps) * 100 : 0;
                sectionProgressSpan.textContent = `${Math.round(sectionPercent)}% complete`;
            }
        }
    }
}

function updateOverallProgress() {
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
    
    const totalUnitsSpan = document.getElementById('total-units');
    const totalSectionsSpan = document.getElementById('total-sections');
    
    if (totalUnitsSpan) totalUnitsSpan.textContent = Object.keys(courseStructure).length;
    if (totalSectionsSpan) {
        let totalSections = 0;
        for (const unitId in courseStructure) {
            totalSections += courseStructure[unitId].sections;
        }
        totalSectionsSpan.textContent = totalSections;
    }
    updateMainPageUnitCards();
    console.log(`Overall progress: ${completedStepsAllUnits}/${totalStepsAllUnits} = ${Math.round(overallPercentage)}%`);
}

// Update individual unit cards on the main page
// Update individual unit cards on the main page
function updateMainPageUnitCards() {
    const unitsGrid = document.getElementById('units-grid');
    if (!unitsGrid) return;
    
    const unitCards = unitsGrid.querySelectorAll('.unit-card');
    const unitIds = Object.keys(courseStructure);
    
    console.log(`🔄 Updating ${unitCards.length} unit cards...`);
    
    for (let i = 0; i < unitCards.length && i < unitIds.length; i++) {
        const unitId = parseInt(unitIds[i]);
        const progress = getUnitTotalProgress(unitId);
        const card = unitCards[i];
        
        if (card) {
            // Update percentage display
            const percentSpan = card.querySelector('.unit-progress-text span:last-child');
            if (percentSpan) {
                percentSpan.textContent = `${Math.round(progress.percentage)}%`;
                console.log(`  Card ${i}: Set percent to ${Math.round(progress.percentage)}%`);
            }
            
            // Update progress bar fill
            const progressFill = card.querySelector('.unit-progress-fill');
            if (progressFill) {
                progressFill.style.width = `${progress.percentage}%`;
                console.log(`  Card ${i}: Set progress bar to ${progress.percentage}%`);
            }
            
            // Update tasks count
            const statsSpan = card.querySelector('.unit-stats span:nth-child(2)');
            if (statsSpan) {
                statsSpan.innerHTML = `✅ ${progress.completed}/${progress.total} tasks`;
                console.log(`  Card ${i}: Set tasks to ${progress.completed}/${progress.total}`);
            }
        }
    }
    
    console.log('✅ Unit cards updated on main page');
}

function initializeMainPage() {
    const unitsGrid = document.getElementById('units-grid');
    if (!unitsGrid) return false;
    
    if (Object.keys(courseStructure).length === 0) {
        unitsGrid.innerHTML = '<div class="loading">⚠️ No course data found. Please check course-data.js</div>';
        return false;
    }
    
    unitsGrid.innerHTML = '';
    
    for (const [id, unit] of Object.entries(courseStructure)) {
        const progress = getUnitTotalProgress(parseInt(id));
        
        // Calculate total sections and steps for display
        let totalSections = 0;
        let totalStepsInUnit = 0;
        for (const [sectionId, pageData] of Object.entries(unit.pages)) {
            if (sectionId !== 'test') {
                totalSections++;
                totalStepsInUnit += pageData.steps || 0;
            }
        }
        
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
                    <span>📚 ${totalSections} sections</span>
                    <span>✅ ${progress.completed}/${progress.total} tasks</span>
                    <span>⏱️ ${unit.estimatedTime}</span>
                </div>
            </div>
            <div class="unit-card-footer">
                <a href="units/unit${id}/index.html" class="start-unit-button">Start Unit ${id}: ${unit.name} →</a>
            </div>
        `;
        
        unitsGrid.appendChild(unitCard);
    }
    
    updateOverallProgress();
    return true;
}

function initializeCheckboxes() {
    const stepContainers = document.querySelectorAll('.steps');
    if (stepContainers.length === 0) return false;
    
    console.log('=== INITIALIZING CHECKBOXES ===');
    
    stepContainers.forEach(container => {
        const unitId = container.getAttribute('data-unit');
        const sectionId = container.getAttribute('data-section');
        console.log(`Container: Unit ${unitId}, Section ${sectionId}`);
        
        if (!unitId || !sectionId) return;
        
        const saved = loadProgress(unitId, sectionId);
        const checkboxes = container.querySelectorAll('.step-check');
        
        console.log(`Found ${checkboxes.length} checkboxes`);
        
        checkboxes.forEach(checkbox => {
            const step = checkbox.getAttribute('data-step');
            
            if (saved[step]) {
                checkbox.checked = true;
                console.log(`  Step ${step}: checked = true (from saved)`);
            }
            
            checkbox.onchange = function(e) {
                const isChecked = this.checked;
                const stepNum = this.getAttribute('data-step');
                console.log(`🎯 CHECKBOX ${stepNum} CHANGED to ${isChecked}`);
                
                const key = `unit_${unitId}_section_${sectionId}`;
                const currentSaved = JSON.parse(localStorage.getItem(key)) || {};
                currentSaved[stepNum] = isChecked;
                localStorage.setItem(key, JSON.stringify(currentSaved));
                
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
                
                // Only call these once - the order matters!
                if (document.querySelector('.sections-grid')) {
                    updateUnitProgress(unitId);
                }
                
                // This single call will handle both overall progress AND unit cards
                if (document.getElementById('units-grid')) {
                    updateOverallProgress(); // This already calls updateMainPageUnitCards() inside it
                }
            };
        });
        
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

function initializeUnitOverview() {
    const sectionsGrid = document.querySelector('.sections-grid');
    if (!sectionsGrid) return false;
    
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
        setTimeout(() => {
            updateUnitProgress(unitId);
        }, 100);
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

window.addEventListener('load', function() {
    console.log('Window fully loaded, refreshing progress displays...');
    if (document.getElementById('units-grid')) {
        updateOverallProgress();
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
        if (unitId) updateUnitProgress(unitId);
    }
});
