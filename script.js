// script.js - Complete working version for main page and unit pages

// Course structure definition
const courseStructure = {
    1: { 
        name: "Intro to Godot",
        description: "Learn the fundamentals of Godot Engine and create your first project.",
        difficulty: "Beginner",
        estimatedTime: "2 hours",
        sections: 4,
        pages: {
            1: { name: "Getting Started", steps: 3 },
            2: { name: "Creating Your First Project", steps: 4 },
            3: { name: "Exploring the Godot Interface", steps: 4 },
            4: { name: "Your First Game Scene", steps: 4 }
        }
    },
    2: { 
        name: "Scenes & Nodes",
        description: "Understand the building blocks of every Godot game.",
        difficulty: "Beginner",
        estimatedTime: "2.5 hours",
        sections: 4,
        pages: {
            1: { name: "Understanding Nodes", steps: 3 },
            2: { name: "Working with Scenes", steps: 4 },
            3: { name: "Scene Tree", steps: 3 },
            4: { name: "Instancing", steps: 4 }
        }
    },
    3: { 
        name: "Scripting Basics",
        description: "Start coding with GDScript to make your games interactive.",
        difficulty: "Intermediate",
        estimatedTime: "3 hours",
        sections: 4,
        pages: {
            1: { name: "Introduction to GDScript", steps: 4 },
            2: { name: "Variables and Data Types", steps: 4 },
            3: { name: "Functions and Logic", steps: 4 },
            4: { name: "Basic Movement", steps: 4 }
        }
    },
    4: { 
        name: "Player Movement",
        description: "Create playable characters with smooth controls.",
        difficulty: "Intermediate",
        estimatedTime: "3 hours",
        sections: 4,
        pages: {
            1: { name: "Input Handling", steps: 3 },
            2: { name: "Character Movement", steps: 4 },
            3: { name: "Animation", steps: 4 },
            4: { name: "Camera Controls", steps: 3 }
        }
    }
};

// Save progress for a specific step
function saveProgress(unitId, sectionId, stepId, completed) {
    const key = `unit_${unitId}_section_${sectionId}`;
    const saved = JSON.parse(localStorage.getItem(key)) || {};
    saved[stepId] = completed;
    localStorage.setItem(key, JSON.stringify(saved));
    
    // Update all progress displays
    updateSectionProgress(unitId, sectionId);
    updateUnitProgress(unitId);
    updateOverallProgress();
}

// Load progress for a specific section
function loadProgress(unitId, sectionId) {
    const key = `unit_${unitId}_section_${sectionId}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}

// Get progress for entire unit
function getUnitProgress(unitId) {
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
    }
    
    return {
        completed: completedSteps,
        total: totalSteps,
        percentage: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
    };
}

// Update section progress display
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
    
    // Update section progress bar
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressPercent) {
        progressPercent.textContent = `${Math.round(percentage)}%`;
    }
    
    return percentage;
}

// Update overall unit progress (for unit overview page)
function updateUnitProgress(unitId) {
    const progress = getUnitProgress(unitId);
    
    // Update unit progress bar on overview page
    const unitFill = document.getElementById('unit-progress-fill');
    const unitStatus = document.getElementById('completion-status');
    
    if (unitFill) {
        unitFill.style.width = `${progress.percentage}%`;
    }
    if (unitStatus) {
        unitStatus.innerHTML = `Unit Progress: ${Math.round(progress.percentage)}%`;
    }
    
    // Update section progress cards on overview page
    for (let section = 1; section <= courseStructure[unitId].sections; section++) {
        const sectionProgressSpan = document.getElementById(`section${section}-progress`);
        if (sectionProgressSpan) {
            const saved = loadProgress(unitId, section);
            const sectionSteps = courseStructure[unitId].pages[section]?.steps || 0;
            const sectionCompleted = Object.values(saved).filter(v => v === true).length;
            const sectionPercent = sectionSteps > 0 ? (sectionCompleted / sectionSteps) * 100 : 0;
            sectionProgressSpan.textContent = `${Math.round(sectionPercent)}% complete`;
        }
    }
}

// Update overall course progress (for main page)
function updateOverallProgress() {
    let totalStepsAllUnits = 0;
    let completedStepsAllUnits = 0;
    
    for (const unitId in courseStructure) {
        const progress = getUnitProgress(parseInt(unitId));
        totalStepsAllUnits += progress.total;
        completedStepsAllUnits += progress.completed;
    }
    
    const overallPercentage = totalStepsAllUnits > 0 ? (completedStepsAllUnits / totalStepsAllUnits) * 100 : 0;
    
    // Update main page displays if they exist
    const overallFill = document.getElementById('overall-progress-fill');
    const overallProgressSpan = document.getElementById('overall-progress');
    const completedStepsSpan = document.getElementById('completed-steps');
    const totalStepsSpan = document.getElementById('total-steps-count');
    
    if (overallFill) {
        overallFill.style.width = `${overallPercentage}%`;
    }
    if (overallProgressSpan) {
        overallProgressSpan.textContent = `${Math.round(overallPercentage)}%`;
    }
    if (completedStepsSpan) {
        completedStepsSpan.textContent = completedStepsAllUnits;
    }
    if (totalStepsSpan) {
        totalStepsSpan.textContent = totalStepsAllUnits;
    }
    
    // Update stat cards on main page
    const totalUnitsSpan = document.getElementById('total-units');
    const totalSectionsSpan = document.getElementById('total-sections');
    
    if (totalUnitsSpan) {
        totalUnitsSpan.textContent = Object.keys(courseStructure).length;
    }
    if (totalSectionsSpan) {
        let totalSections = 0;
        for (const unitId in courseStructure) {
            totalSections += courseStructure[unitId].sections;
        }
        totalSectionsSpan.textContent = totalSections;
    }
}

// Initialize the main page (index.html)
function initializeMainPage() {
    const unitsGrid = document.getElementById('units-grid');
    if (!unitsGrid) return;
    
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
}

// Initialize checkboxes on unit section pages
function initializeCheckboxes() {
    const stepContainers = document.querySelectorAll('.steps');
    
    if (stepContainers.length === 0) return;
    
    stepContainers.forEach(container => {
        const unitId = container.getAttribute('data-unit');
        const sectionId = container.getAttribute('data-section');
        
        if (!unitId || !sectionId) return;
        
        // Load saved progress
        const saved = loadProgress(unitId, sectionId);
        
        // Initialize checkboxes
        const checkboxes = container.querySelectorAll('.step-check');
        checkboxes.forEach(checkbox => {
            const step = checkbox.getAttribute('data-step');
            if (saved[step]) {
                checkbox.checked = true;
            }
            
            // Add change listener
            checkbox.addEventListener('change', function() {
                saveProgress(unitId, sectionId, step, this.checked);
                
                // Show status message
                showStatusMessage(container, `Step ${step} ${this.checked ? 'completed' : 'unchecked'}`);
            });
        });
        
        // Update progress displays
        updateSectionProgress(unitId, sectionId);
    });
}

// Show temporary status message
function showStatusMessage(container, message) {
    const statusMsg = document.createElement('div');
    statusMsg.className = 'status-message';
    statusMsg.textContent = `✓ ${message} - Auto-saved`;
    
    // Remove old messages
    const oldMessages = document.querySelectorAll('.status-message');
    oldMessages.forEach(msg => msg.remove());
    
    container.parentNode.insertBefore(statusMsg, container.nextSibling);
    
    setTimeout(() => {
        statusMsg.remove();
    }, 2000);
}

// Initialize unit overview page (units/unitX/index.html)
function initializeUnitOverview() {
    // Get unit ID from the current path
    const pathParts = window.location.pathname.split('/');
    const unitIndex = pathParts.indexOf('unit');
    let unitId = null;
    
    if (unitIndex !== -1 && pathParts[unitIndex + 1]) {
        unitId = parseInt(pathParts[unitIndex + 1]);
    }
    
    if (unitId && courseStructure[unitId]) {
        updateUnitProgress(unitId);
    }
}

// Run the appropriate initialization based on the page
window.onload = function() {
    initializeMainPage();      // For index.html
    initializeCheckboxes();    // For unit section pages
    initializeUnitOverview();  // For unit overview pages
};