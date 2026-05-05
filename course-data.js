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
        name: "Gem Catcher",
        description: "Build a fast-paced collection game using signals, timers, and dynamic UI!",
        difficulty: "Beginner",
        estimatedTime: "4 hours",
        sections: 7,
        pages: {
            1: { name: "Project Setup & Player Movement", steps: 3 },
            2: { name: "Creating the Gem (Area2D)", steps: 2 },
            3: { name: "Score System with UI", steps: 2 },
            4: { name: "Enemy Movement & Collision", steps: 3 },
            5: { name: "Game Over & Restart", steps: 2 },
            6: { name: "Spawning Gems with Timer", steps: 2 },
            7: { name: "Win Condition & Polish", steps: 3 },
            test: { name: "Unit 2 Test", steps: 13 }
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