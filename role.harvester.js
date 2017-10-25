module.exports = {
    init: function (creep, target) {
        this.spawn = target;
        this.target = target;
        if (typeof creep.memory.target !== undefined) {
            this.target = Game.getObjectById(creep.memory.target);
        }
        this.source = Game.getObjectById(creep.memory.source) || creep.pos.findClosestByPath(FIND_SOURCES);
        this.debug = false;
        creep.memory.source = this.source === null ? null : this.source.id;
        creep.memory.spawn = this.target === null ? null : this.target.id;
        this.state = 'HARVESTING';
    },
    findUnload: function (creep) {
        if(this.target === this.spawn) {
            return this.spawn;
        }
        let targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.energy < s.energyCapacity
        });
        if(!targets.length) {
            return this.spawn;
        }
        return creep.pos.findClosestByPath(targets);
    },
    run: function (creep, halt) {
        let targetFull = false;
        if (this.target !== null) {
            targetFull = this.target.energy === this.target.energyCapacity;
        }
        if (creep.isEmpty()) {
            creep.memory.state = 'HARVESTING';
        }
        if (creep.isFull()) {
            creep.memory.state = 'TRANSFER';
            creep.memory.target = targetFull ? this.spawn : this.findUnload(creep).id;
        }
        if (!creep.isFull()) {
            if (creep.harvesting(this.source)) {
                if (this.debug) console.log(creep + ' is harvesting ' + this.source);
                return
            }
            if (this.debug) console.log(creep + ' is moving to ' + this.source);
            this.target = null;
            return creep.moveTo(this.source);
            memory.task = task;
        }
        if (creep.isFull()) {
            if (creep.transferring(this.target, RESOURCE_ENERGY)) {
                if (this.debug) console.log(creep + ' is transferring into ' + this.target);
                return;
            }
            creep.memory.source = null;
            if (this.target.energyCapacity === this.target.energy) {
                this.target = null;
                return creep.moveTo(Game.flags.EnergyUnload);
            }
            if (this.target === null) {
                this.target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES);
            }
            if (this.debug) console.log(creep + ' is moving to ' + this.target);
            return creep.moveTo(this.target);
        }
        console.log(creep + ' noop');
    }
}