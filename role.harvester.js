module.exports = {
    init: function (creep, target) {
        this.creep = creep;
        this.target = target;
        this.source = Game.getObjectById(creep.memory.source) || creep.pos.findClosestByPath(FIND_SOURCES);
        this.debug = false;
        creep.memory.task = 'HARVESTER';
        creep.memory.source = this.source === null ? null : this.source.id;
        creep.memory.spawn = this.target === null ? null : this.target.id;
    },
    isHarvesting: function () {
        return this.creep.harvest(this.source) !== ERR_NOT_IN_RANGE;
    },
    isUnloading: function () {
        return this.creep.transfer(this.target, RESOURCE_ENERGY) !== ERR_NOT_IN_RANGE;
    },
    run: function () {
        if (!this.creep.isFull()) {
            if (this.isHarvesting()) {
                if (this.debug) console.log(this.creep + ' is harvesting ' + this.source);
                return
            }
            if (this.debug) console.log(this.creep + ' is moving to ' + this.source);
            this.target = null;
            return this.creep.moveTo(this.source);
        }
        if (this.creep.isFull()) {
            if (this.isUnloading()) {
                if (this.debug) console.log(this.creep + ' is unloading into ' + this.target);
                return;
            }
            this.creep.memory.source = null;
            if (this.target.energyCapacity === this.target.energy) {
                this.target = null;
                return this.creep.moveTo(Game.flags.EnergyUnload);
            }
            if (this.target === null) {
                this.target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES);
            }
            if (this.debug) console.log(this.creep + ' is moving to ' + this.target);
            return this.creep.moveTo(this.target);
        }
        console.log(this.creep + ' noop');
    }
}