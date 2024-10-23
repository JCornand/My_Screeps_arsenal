
/** @param {healtower} healtower **/
run: function(healtower) {
    var defenseTower = {
        Game.getObjectById('TOWER_ID');
        //Crée une tour proche de l'entité à soigner
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    };
}
module.exports = defenseTower;