module.exports = {
    run: function (halt) {
        let roles = {
            harvester: require('role.harvester'),
            upgrader: require('role.upgrader'),
            builder: require('role.builder'),
            spawner: require('spawner')
        };
        for (let roleName in roles) {
            let role = roles[roleName];
            let task = roleName.toUpperCase();
            _.filter(Game.creeps, (c) => c.memory.task === task).forEach(function (creep) {
                role.init(creep, Game.spawns.Spawn1);
                role.run(creep, halt);
            });
        }
    }
};