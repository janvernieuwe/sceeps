module.exports = function () {
    const HARVESTER_LOADING = 'LOADING';
    const HARVESTER_UNLOADING = 'UNLOADING';
    Harvester = function (creep) {
        this.exists = true;
        try {
            Object.assign(this, creep);
            this.loadObjects();
        } catch (e) {
            this.exists = false;
        }
        ;
    };
    Harvester.prototype = Creep.prototype;
    // Don't put methods above this line !

    Harvester.prototype.loadObjects = function () {
        this.unload = Game.getObjectById(this.memory.unload);
        this.source = Game.getObjectById(this.memory.source);
    };

    Harvester.prototype.findUnload = function () {
        this.unload = this.pos.findClosestByPath(
            FIND_MY_STRUCTURES,
            {filter: (s) => s.energy < s.energyCapacity}
        );
        this.memory.unload = this.unload;
        this.memory.unload = this.unload === null ? null : this.unload.id;
    };

    Harvester.prototype.findSource = function () {
        this.source = this.pos.findClosestByPath(FIND_SOURCES);
        this.memory.source = this.source === null ? null : this.source.id;
    };

    Harvester.prototype.isLoading = function () {
        return this.memory.state === HARVESTER_LOADING;
    };

    Harvester.prototype.isUnloading = function () {
        return this.memory.state === HARVESTER_UNLOADING;
    };

    Harvester.prototype._harvest = function () {
        if (this.source === null) {
            this.findSource();
        }
        if (!this.harvesting(this.source)) {
            this.moveTo(this.source);
        }
    };

    Harvester.prototype._unload = function () {
        if (this.unload !== null && this.unload.energyCapacity === this.unload.energy) {
            this.unload = null;
        }
        if (this.unload === null) {
            this.findUnload();
        }
        if (!this.transferring(this.unload, RESOURCE_ENERGY)) {
            this.moveTo(this.unload);
        }
    };

    Harvester.prototype.run = function () {
        // Building creep
        if (!this.exists) {
            return;
        }
        // Switch stats
        if (this.isFull() && !this.isUnloading()) {
            this.memory.state = HARVESTER_UNLOADING;
            this.memory.source = null;
        }
        if (this.isEmpty() && !this.isLoading()) {
            this.memory.state = HARVESTER_LOADING;
            this.memory.unload = null;
        }
        // Harvest or load
        if (this.isLoading()) {
            this._harvest();
        }
        if (this.isUnloading()) {
            this._unload();
        }
    };
};