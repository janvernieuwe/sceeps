require('prototype.creep')();
module.exports.loop = function () {
    let spawner = require('spawner');
    let taskRunner = require('taskrunner');
    let population = {
        HARVESTER: {min: 12, parts: [MOVE, CARRY, WORK, WORK, WORK]},
        UPGRADER: {min: 5, parts: [WORK, WORK, MOVE, CARRY], memory: {state: 'LOADING'}},
        BUILDER: {min: 2, parts: [WORK, CARRY, MOVE, WORK], memory: {state: 'LOADING'}},
    };
    spawner.init(Game.spawns.Spawn1);
    spawner.garbageCollection();
    let halt = !spawner.populate(population);
    taskRunner.run(halt);
    if (Game.time % 10 === 0) {
        console.log(
            'Tick',
            Game.time,
            //Math.round((controller.progress / controller.progressTotal) * 100) + '%',
            Math.round((Game.spawns.Spawn1.energy / Game.spawns.Spawn1.energyCapacity) * 100) + '%',
            'Harvesters: ' + spawner.countTask('HARVESTER'),
            'Upgraders: ' + spawner.countTask('UPGRADER'),
            'Builders: ' + spawner.countTask('BUILDER')
        );
    }
}