// course-data.js - Edit when you add new units
const COURSE_DATA = {
    1: { 
        name: "Intro to Godot",
        description: "Learn the fundamentals of Godot Engine and create your first project.",
        difficulty: "Beginner",
        estimatedTime: "3 hours",
        sections: 7,
        pages: {
            1: { name: "Getting Started", steps: 3 },
            2: { name: "Creating The A-Maze-Ball Project", steps: 4 },
            3: { name: "Creating the Player (CharacterBody2D)", steps: 5 },
            4: { name: "Creating a Test Level with TileMapLayer", steps: 6 },
            5: { name: "Adding Collision to Walls", steps: 6 },
            6: { name: "Designing the Maze", steps: 6 },
            7: { name: "Start Scene, Win Scene & Game Loop", steps: 6 }
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
    }
    // Add new units here when you create them:
    // 3: { 
    //     name: "Scripting Basics",
    //     description: "Start coding with GDScript",
    //     difficulty: "Intermediate",
    //     estimatedTime: "3 hours",
    //     sections: 4,
    //     pages: {
    //         1: { name: "Introduction to GDScript", steps: 4 },
    //         2: { name: "Variables", steps: 4 }
    //     }
    // }
};