module.exports.loop = function () {
    let harvester = require('harvester');
    let upgrader = require('upgrader');
    let builder = require('builder');
    let spawner = require('spawner');
    spawner.init(Game.spawns.Spawn1, {
        HARVESTER: 40,
        UPGRADER: 15,
        BUILDER: 3,
    });
    let halt = spawner.run();
    //halt = true;
    // for every creep name in Game.creeps
    for (var name in Game.creeps) {
        switch (Memory.creeps[name].task) {
            case 'HARVESTER':
                harvester.init(Game.creeps[name], Game.spawns.Spawn1);
                harvester.run();
                break;
            case 'UPGRADER':
                upgrader.init(Game.creeps[name], Game.spawns.Spawn1);
                if (halt !== false) upgrader.run();
                break;
            case 'BUILDER':
                builder.init(Game.creeps[name], Game.spawns.Spawn1);
                if (halt !== false) builder.run();
                break;

            default:
                console.log('Unassigned creep', name);
        }
    }
    if (Game.time % 10 === 0) {
        console.log(
            'Tick',
            Game.time,
            Math.round((Game.creeps[name].room.controller.progress / Game.creeps[name].room.controller.progressTotal) * 100) + '%',
            Math.round((Game.spawns.Spawn1.energy / Game.spawns.Spawn1.energyCapacity) * 100) + '%',
            'Harvesters: ' + spawner.countTask('HARVESTER'),
            'Upgraders: ' + spawner.countTask('UPGRADER'),
            'Builders: ' + spawner.countTask('BUILDER'),
        );
    }
    for (let name in Memory.creeps) {
        if (Game.creeps[name] === undefined) {
            console.log('RIP', name);
            delete(Memory.creeps[name]);
        }
    }
}