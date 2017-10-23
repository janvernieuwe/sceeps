module.exports = {
    init: function (spawn, config) {
        this.config = config;
        this.spawn = spawn;
        this.debug = true;
    },
    countTask: function (task) {
        let count = 0;
        for (let creep in Game.creeps) {
            count += Game.creeps[creep].memory.task === task;
        }
        return count;
    },
    spawnWorker: function (type) {
        let creep = null;
        let name = '';
        if (type === 'HARVESTER') {
            console.log('Spawn new harvester');
            let attr = [WORK, MOVE, CARRY, CARRY];
            name = 'Harvester' + Game.time;
            creep = this.spawn.spawnCreep(attr, name, {memory: {task: 'HARVESTER'}});
        }
        if (type === 'UPGRADER') {
            console.log('Spawn new upgrader');
            let attr = [WORK, WORK, MOVE, CARRY];
            name = 'Upgrader' + Game.time;
            creep = this.spawn.spawnCreep(attr, name, {
                memory: {
                    task: 'UPGRADER',
                    state: 'LOADING'
                }
            });
        }
        if (type === 'BUILDER') {
            console.log('Spawn new builder');
            let attr = [WORK, WORK, MOVE, CARRY];
            name = 'Builder' + Game.time;
            creep = this.spawn.spawnCreep(attr, name, {
                memory: {
                    task: 'BUILDER',
                    state: 'LOADING'
                }
            });
        }
        if (creep === 0) {
            console.log('Hooray', name, 'is born');
            return true;
        }
        console.log('Not enough energy');
        return false;

    },
    run: function () {
        if (this.spawn.spawning !== null) {
            return true;
        }
        for (let type in this.config) {
            let min = this.config[type];
            let current = this.countTask(type);
            if (current < min) {
                return this.spawnWorker(type);
            }
        }
        return true;
    }
};