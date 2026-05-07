// course-data.js - Course structure data

const COURSE_DATA = {
    1: { 
        name: "A-Maze-Ball",
        description: "Learn the fundamentals of Godot Engine and create your first playable maze game!",
        difficulty: "Beginner",
        estimatedTime: "4 hours",
        sections: 7,
        pages: {
            1: { name: "Getting Started", steps: 3 },
            2: { name: "Creating A-Maze-Ball Project", steps: 4 },
            3: { name: "Creating the Player (CharacterBody2D)", steps: 5 },
            4: { name: "Creating a Test Level with TileMapLayer", steps: 6 },
            5: { name: "Adding Collision to Walls", steps: 6 },
            6: { name: "Designing the Maze", steps: 6 },
            7: { name: "Start Scene, Win Scene & Game Loop", steps: 6 },
            test: { name: "Unit 1 Test", steps: 16 }
        }
    },
    2: {
        name: "Plenty o' Platforms",
        description: "Build a classic 2D platformer with gravity, jumping, and multiple levels. Choose your own visual theme from Kenney's platformer asset packs!",
        difficulty: "Beginner/Intermediate",
        estimatedTime: "4 hours",
        sections: 7,
        pages: {
            1: { name: "Project Setup & Character Selection", steps: 4 },
            2: { name: "Player Scene & Gravity", steps: 4 },
            3: { name: "Jump Mechanic & Ground Detection", steps: 4 },
            4: { name: "Animated Character", steps: 5 },
            5: { name: "Platform TileMap & Camera", steps: 5 },
            6: { name: "Collectibles & Scoring", steps: 4 },
            7: { name: "Goal, UI & Game Flow", steps: 5 },
            test: { name: "Unit 2 Test", steps: 12 }
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