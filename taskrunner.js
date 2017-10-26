module.exports = {
    run: function (halt) {
        let noBuildWork = null;
        let roles = {
            harvester: function (creep) {
                require('prototype.harvester')();
                (new Harvester(creep)).run();
            },
            upgrader: function (creep, halt) {
                require('prototype.upgrader')();
                (new Upgrader(creep, halt)).run();
            },
            builder: function (creep, halt) {
                require('prototype.builder')();
                (new Builder(creep, halt)).run();
            },
            repairer: function (creep, halt) {
                require('prototype.repairer')();
                (new Repairer(creep, halt)).run();
            }
        };
        for (let roleName in roles) {
            let lazyRunner = roles[roleName];
            let task = roleName.toUpperCase();
            _.filter(Game.creeps, (c) => c.memory.task === task).forEach(function (creep) {
                lazyRunner(creep, halt);
            });
        }
    }
};