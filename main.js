const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const defenseTower = require('defense.tower');

// Constantes pour les rôles et les limites
const ROLE_HARVESTER = 'harvester';
const ROLE_UPGRADER = 'upgrader';
const ROLE_BUILDER = 'builder';
const MIN_HARVESTERS = 2; // Nombre minimum de harvesters nécessaires
const MIN_UPGRADERS = 2; // Nombre minimum d'upgraders nécessaires
const MIN_BUILDERS = 2; // Nombre minimum d'upgraders nécessaires

/**
 * Fonction pour créer un creep d'un rôle spécifique.
 * @param {string} role - Le rôle du creep à créer (harvester, upgrader, etc.).
 */
function spawnCreep(role) {
    // Génération d'un nom unique pour le creep
    const newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
    console.log(`Spawning new ${role}: ${newName}`);
    
    // Création du creep avec le rôle spécifié
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: role } });
}

/**
 * Fonction pour gérer la création de creeps en fonction de leurs rôles.
 */
function manageCreeps() {
    // Récupération des creeps de chaque rôle
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === ROLE_HARVESTER);
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === ROLE_UPGRADER);
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === ROLE_BUILDER);

    // Affichage du nombre de creeps de chaque rôle
    console.log(`Harvesters: ${harvesters.length}, Upgraders: ${upgraders.length}, Builders: ${builders.length}`);

    // Création d'un nouveau harvester si le nombre est inférieur au minimum requis
    if (harvesters.length < MIN_HARVESTERS) {
        spawnCreep(ROLE_HARVESTER);
    }

    // Création d'un upgrader seulement si au moins 2 harvesters existent
    if (harvesters.length >= MIN_HARVESTERS && upgraders.length < MIN_UPGRADERS) {
        spawnCreep(ROLE_UPGRADER);
    }
    
    // Création d'un builder seulement si au moins 2 harvesters et 2 upgraders existent
    if (harvesters.length >= MIN_HARVESTERS && upgraders.length >= MIN_UPGRADERS && builders.length < MIN_BUILDERS) {
        spawnCreep(ROLE_BUILDER);
    }
}

/**
 * Fonction pour exécuter les actions de chaque creep en fonction de leur rôle.
 */
function runCreeps() {
    // Parcours de tous les creeps
    for (const creep of Object.values(Game.creeps)) {
        // Exécution de l'action appropriée en fonction du rôle du creep
        switch (creep.memory.role) {
            case ROLE_HARVESTER:
                roleHarvester.run(creep);
                break;
            case ROLE_UPGRADER:
                roleUpgrader.run(creep);
                break;
            case ROLE_BUILDER:
                roleBuilder.run(creep);
                break;
        }
    }
}

module.exports.loop = function () {
    // Gestion de la création des creeps
    manageCreeps();

    // Affichage de l'état du spawn si un creep est en train d'être créé
    const spawning = Game.spawns['Spawn1'].spawning;
    if (spawning) {
        const spawningCreep = Game.creeps[spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role, // Affiche le rôle du creep en cours de spawn
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 }
        );
    }

    // Exécution de la logique de la tour de défense
    defenseTower.run();

    // Exécution des rôles des creeps
    runCreeps();

    // Nettoyage de la mémoire pour les creeps qui n'existent plus
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]; // Suppression de la mémoire du creep
            console.log('Clearing non-existing creep memory:', name);
        }
    }
};