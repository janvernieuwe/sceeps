module.exports = {
    init: function (spawn, config) {
        this.config = config;
        this.spawn = spawn;
        this.debug = true;
    },
    countTask: function (task) {
        return _.filter(Game.creeps, (c) => c.memory.task === task).length;
    },
    taskToName: function (string) {
        string = string.toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1) + Game.time;
    },
    populate: function (spawnConfig) {
        if (this.spawn.spawning !== null) {
            return true;
        }
        for (let task in spawnConfig) {
            let config = spawnConfig[task];
            if (!config.parts.length) {
                console.log('WARNING: No parts configured for', task);
                continue;
            }
            if (this.countTask(task) < config.min || 0) {
                return this.spawnType(task, config.parts, config.memory);
            }
        }
        return true;
    },
    spawnType: function (task, parts, memory) {
        memory = memory || {};
        memory.task = task;
        if (!parts.length) {
            console.log('Spawn error: no parts', task, parts, memory);
            return true;
        }
        if (!task.length) {
            console.log('Spawn error: no task', task, parts, memory);
            return true;
        }
        let name = this.taskToName(task);
        if (this.spawn.spawnCreep(parts, name, {memory: memory}) === 0) {
            console.log('Hooray', name, 'is born');
            return true;
        }
        return ['HARVESTER', 'UPGRADER'].indexOf(task) === false;
    },
    garbageCollection: function () {
        for (let name in Memory.creeps) {
            if (Game.creeps[name] === undefined) {
                console.log('RIP', name);
                delete(Memory.creeps[name]);
            }
        }
    }
};