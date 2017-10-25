module.exports = {
    run: function (halt) {
        let roles = {
            harvester: function(creep) {
                require('prototype.harvester')();
                (new Harvester(creep)).run();
            },
            upgrader: function(creep) {
                require('prototype.upgrader')();
                (new Upgrader(creep)).run();
            },
            builder: require('role.builder'),
            spawner: require('spawner')
        };
        for (let roleName in roles) {
            let role = roles[roleName];
            let task = roleName.toUpperCase();
            _.filter(Game.creeps, (c) => c.memory.task === task).forEach(function (creep) {
                if(typeof(role) === "function") {
                    return role(creep);
                }
                // Legacy
                role.init(creep, Game.spawns.Spawn1);
                role.run(creep, halt);
            }.bind(this));
        }
    }
};