module.exports = {
    init: function (creep, spawn) {
        this.creep = creep;
        this.spawn = spawn;
        this.resource = Game.getObjectById(creep.memory.resource) || creep.pos.findClosestByPath(FIND_SOURCES);
        this.debug = false;
        creep.memory.task = 'HARVESTER';
        creep.memory.resource = this.resource.id;
    },
    isHarvesting: function () {
        return this.creep.harvest(this.resource) !== ERR_NOT_IN_RANGE;
    },
    isUnloading: function () {
        return this.creep.transfer(this.spawn, RESOURCE_ENERGY) !== ERR_NOT_IN_RANGE;
    },
    isFull: function () {
        return this.creep.carry.energy === this.creep.carryCapacity;
    },
    isEmpty: function () {
        return this.creep.carry.energy === 0;
    },
    run: function () {
        if (!this.isFull()) {
            if (this.isHarvesting()) {
                if (this.debug) console.log(this.creep + ' is harvesting ' + this.resource);
                return
            }
            if (this.debug) console.log(this.creep + ' is moving to ' + this.resource);
            return this.creep.moveTo(this.resource);
        }
        if (this.isFull()) {
            if (this.isUnloading()) {
                if (this.debug) console.log(this.creep + ' is unloading into ' + this.spawn);
                return;
            }
            this.creep.memory.resource = null;
            if (this.spawn.energyCapacity === this.spawn.energy) {
                return this.creep.moveTo(Game.flags.EnergyUnload);
            }
            if (this.debug) console.log(this.creep + ' is moving to ' + this.spawn);
            return this.creep.moveTo(this.spawn);
        }
        console.log(this.creep + ' noop');
    }
}