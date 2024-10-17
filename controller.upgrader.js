var controllerUpgrader = {
    let costs = new PathFinder.CostMatrix;
    let pos = Game.structures['Spawn1'].pos;
    costs.set(pos.x, pos.y, 255); // Can't walk over a building

};

module.exports = controllerUpgrader;