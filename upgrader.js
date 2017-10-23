module.exports = {
    init: function (creep, spawn) {
        this.creep = creep;
        this.spawn = spawn;
        this.controller = creep.room.controller;
        this.debug = false;
        creep.memory.task = 'UPGRADER';
    },
    isFull: function () {
        return this.creep.carry.energy === this.creep.carryCapacity;
    },
    isEmpty: function () {
        return this.creep.carry.energy === 0;
    },
    isUpgrading: function () {
        return this.creep.upgradeController(this.controller) !== ERR_NOT_IN_RANGE;
    },
    isLoading: function () {
        return this.creep.withdraw(this.spawn, 'energy') !== ERR_NOT_IN_RANGE
    },
    isLoadingState: function () {
        return this.creep.memory.state === 'LOADING';
    },
    isUnloadingState: function () {
        return this.creep.memory.state === 'UNLOADING';
    },
    run: function () {
        if (this.isFull()) {
            this.creep.memory.state = 'UNLOADING';
        }
        if (this.isEmpty()) {
            this.creep.memory.state = 'LOADING';
        }
        if (this.isLoadingState() && !this.isFull()) {
            if (this.isLoading()) {
                if (this.debug) console.log(this.creep + ' is loading from ' + this.spawn);
                return;
            }
            if (this.debug) console.log(this.creep + ' is moving to ' + this.spawn);
            if(this.spawn.energy === 0) {
                return;
            }
            return this.creep.moveTo(this.spawn);
        }
        if (this.isUnloadingState() && !this.isEmpty()) {
            if (this.isUpgrading()) {
                if (this.debug) console.log(this.creep + ' is upgrading to ' + this.controller);
                return;
            }
            if (this.debug) console.log(this.creep + ' is moving to ' + this.spawn);
            return this.creep.moveTo(this.controller);
        }
        if (this.debug) console.log(this.creep, 'noop');
    }
}