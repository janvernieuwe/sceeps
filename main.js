require('prototype.creep')();
module.exports.loop = function () {
    let spawner = require('spawner');
    let roles = {
        harvester: require('role.harvester'),
        upgrader: require('role.upgrader'),
        builder: require('role.builder'),
        spawner: require('spawner')
    };
    spawner.init(Game.spawns.Spawn1, {
        HARVESTER: 10,
        UPGRADER: 6,
        BUILDER: 2,
    });
    let halt = !spawner.run();
    for (let roleName in roles) {
        let role = roles[roleName];
        let task = roleName.toUpperCase();
        _.filter(Game.creeps, (c) => c.memory.task === task).forEach(function (creep) {
            if (!halt || roleName === 'harvester') {
                role.init(creep, Game.spawns.Spawn1);
                role.run();
            }
        });
    }
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
    for (let name in Memory.creeps) {
        if (Game.creeps[name] === undefined) {
            console.log('RIP', name);
            delete(Memory.creeps[name]);
        }
    }
}