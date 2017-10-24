module.exports = {
    init: function (creep, spawn) {
        this.creep = creep;
        this.spawn = spawn;
        this.site = Game.getObjectById(creep.memory.id) || creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        this.debug = false;
        creep.memory.task = 'BUILDER';
        creep.memory.id = this.site === null ? null : this.site.id;
    },
    isUpgrading: function () {
        return this.creep.build(this.site) !== ERR_NOT_IN_RANGE;
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
        if (this.site === null) {
            if (this.debug) console.log('Nothing to build');
            return true;
        }
        if (this.creep.isFull()) {
            this.creep.memory.state = 'UNLOADING';
        }
        if (this.creep.isEmpty()) {
            this.creep.memory.state = 'LOADING';
        }
        if (this.isLoadingState() && !this.creep.isFull()) {
            if (this.isLoading()) {
                if (this.debug) console.log(this.creep, 'is loading from', this.spawn);
                return;
            }
            if (this.debug) console.log(this.creep, 'is moving to', this.spawn);
            return this.creep.moveTo(this.spawn);
        }
        if (this.isUnloadingState() && !this.creep.isEmpty()) {
            if (this.isUpgrading()) {
                if (this.debug) console.log(this.creep, 'is building', this.site);
                return;
            }
            if (this.debug) console.log(this.creep, 'is moving to', this.spawn);
            return this.creep.moveTo(this.site);
        }
        if (this.debug) console.log(this.creep, 'noop');
    }
}