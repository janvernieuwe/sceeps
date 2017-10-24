module.exports = {
    init: function (creep, spawn) {
        this.creep = creep;
        this.source = spawn;
        this.target = Game.getObjectById(creep.memory.id) || creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        this.debug = false;
        creep.memory.id = this.target === null ? null : this.target.id;
    },
    isLoadingState: function () {
        return this.creep.memory.state === 'LOADING';
    },
    isUnloadingState: function () {
        return this.creep.memory.state === 'UNLOADING';
    },
    run: function (creep) {
        if (this.target === null) {
            if (this.debug) console.log('Nothing to build');
            return true;
        }
        if (creep.isFull()) {
            creep.memory.state = 'UNLOADING';
        }
        if (creep.isEmpty()) {
            creep.memory.state = 'LOADING';
        }
        if (this.isLoadingState() && !creep.isFull()) {
            if (creep.withdrawing(this.source, RESOURCE_ENERGY)) {
                if (this.debug) console.log(creep, 'is loading from', this.source);
                return;
            }
            if (this.debug) console.log(creep, 'is moving to', this.source);
            return creep.moveTo(this.source);
        }
        if (this.isUnloadingState() && !creep.isEmpty()) {
            if (creep.building(this.target)) {
                if (this.debug) console.log(creep, 'is building', this.target);
                return;
            }
            if (this.debug) console.log(creep, 'is moving to', this.source);
            return creep.moveTo(this.target);
        }
        if (this.debug) console.log(creep, 'noop');
    }
}