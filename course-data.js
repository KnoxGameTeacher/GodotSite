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
            6: { name: "Designing the Maze", steps: 5 },
            7: { name: "Start Scene, Win Scene & Game Loop", steps: 6 },
            8: { name: "Multiple Levels & the Global Autoload", steps: 6 },
            test: { name: "Unit 1 Test", steps: 19 }
        }
    },
    2: {
        name: "Plenty o' Platforms",
        description: "Build a classic 2D platformer with gravity, jumping, and multiple levels. Choose your own visual theme!",
        difficulty: "Beginner",
        estimatedTime: "5-10 hours",
        sections: 7,
        pages: {
            1: { name: "Project Setup", steps: 4 },
            2: { name: "Player Scene", steps: 5 },
            3: { name: "Player Animation with AnimatedSprite2D", steps: 5 },
            4: { name: "Game Scene Architecture & Level Design", steps: 6 },
            5: { name: "Enemy Scene with Animation & Patrol", steps: 6 },
            6: { name: "Health, Score & HUD", steps: 6 },
            7: { name: "Level Transitions & Game Flow", steps: 7 },
            test: { name: "Unit 2 Test", steps: 27 }
        }
    },
    3: {
        name: "Forage Fever",
        description: "Create a 3D survival game where you hunt animals for food while managing hunger and avoiding predators!",
        difficulty: "Intermediate",
        estimatedTime: "6 hours",
        sections: 10,
        pages: {
            1: { name: "Game Design Document", steps: 8 },
            2: { name: "3D Project Setup & Environment", steps: 5 },
            3: { name: "Player Movement", steps: 8 },
            4: { name: "Third-Person Camera", steps: 6 },
            5: { name: "Hunger & Health Systems", steps: 5 },
            6: { name: "Prey AI (Flee)", steps: 6 },
            7: { name: "Predator AI (Chase)", steps: 5 },
            8: { name: "Hunting Mechanic", steps: 6 },
            9: { name: "Character Select Screen", steps: 9 },
            10: { name: "Game Loop & Polish", steps: 10 },
            test: { name: "Unit 3 Test", steps: 16 }
        }
    },
    4: {
        name: "Blocky Blocks",
        description: "Build an endless 3D tower defense game with custom towers, state machines, and persistent high scores!",
        difficulty: "Intermediate",
        estimatedTime: "8 hours",
        sections: 15,
        pages: {
            1: { name: "Game Design Document", steps: 8 },
            2: { name: "Project Setup & Environment", steps: 6 },
            3: { name: "Custom Tower Assets", steps: 6 },
            4: { name: "Creating the Enemy Scene", steps: 4 },
            5: { name: "Path Following with Path3D", steps: 5 },
            6: { name: "Placement Zones & Preview", steps: 5 },
            7: { name: "Click-to-Place & Validation", steps: 5 },
            8: { name: "State Machine Fundamentals", steps: 6 },
            9: { name: "Attacking & Cooldown States", steps: 6 },
            10: { name: "Projectiles & Damage", steps: 5 },
            11: { name: "Wave Manager Basics", steps: 5 },
            12: { name: "Infinite Scaling & Difficulty", steps: 5 },
            13: { name: "Gold Economy", steps: 5 },
            14: { name: "Save System with JSON", steps: 6 },
            15: { name: "High Score Tracking", steps: 5 },
            test: { name: "Unit 4 Test", steps: 0 }
        }
    }

    // Add new units here when you create them:
    // 4: { 
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