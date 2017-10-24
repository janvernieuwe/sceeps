module.exports = {
    init: function (creep, spawn) {
        this.creep = creep;
        this.spawn = spawn;
        this.controller = creep.room.controller;
        this.debug = false;
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
    run: function (creep, halt) {
        if (creep.isFull()) {
            creep.memory.state = 'UNLOADING';
        }
        if (creep.isEmpty()) {
            creep.memory.state = 'LOADING';
        }
        if (this.isLoadingState() && !creep.isFull()) {
            if(halt) {
                return;
            }
            if (creep.withdrawing(this.spawn, RESOURCE_ENERGY)) {
                if (this.debug) console.log(creep + ' is loading from ' + this.spawn);
                return;
            }
            if (this.debug) console.log(creep + ' is moving to ' + this.spawn);
            if(this.spawn.energy === 0) {
                return;
            }
            return creep.moveTo(this.spawn);
        }
        if (this.isUnloadingState() && !creep.isEmpty()) {
            if (creep.transferring(this.controller, RESOURCE_ENERGY)) {
                if (this.debug) console.log(creep + ' is upgrading to ' + this.controller);
                return;
            }
            if (this.debug) console.log(creep + ' is moving to ' + this.spawn);
            return creep.moveTo(this.controller);
        }
        if (this.debug) console.log(creep, 'noop');
    }
}