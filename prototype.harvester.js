module.exports = function () {

    const HARVESTER_LOADING = 'LOADING';
    const HARVESTER_UNLOADING = 'UNLOADING';
    const HARVESTER_UNLOAD = 'unload';
    const HARVESTER_SOURCE = 'source';

    Harvester = function (creep) {
        this.exists = true;
        try {
            Object.assign(this, creep);
            this.loadObject(HARVESTER_UNLOAD);
            this.loadObject(HARVESTER_SOURCE);
        } catch (e) {
            this.exists = false;
        }
    };
    Harvester.prototype = Creep.prototype;
    // Don't put methods above this line !

    Harvester.prototype.findUnload = function () {
        this.storeObject(HARVESTER_UNLOAD, this.pos.findClosestByPath(
            FIND_MY_STRUCTURES,
            {filter: (s) => s.energy < s.energyCapacity}
        ));
    };

    Harvester.prototype.findSource = function () {
        this.storeObject(HARVESTER_SOURCE, this.pos.findClosestByPath(FIND_SOURCES_ACTIVE));
    };

    Harvester.prototype.isLoading = function () {
        return this.memory.state === HARVESTER_LOADING;
    };

    Harvester.prototype.isUnloading = function () {
        return this.memory.state === HARVESTER_UNLOADING;
    };

    Harvester.prototype._harvest = function () {
        if (!this.source) {
            this.findSource();
        }
        if (!this.harvesting(this.source)) {
            this.moveTo(this.source);
        }
    };

    Harvester.prototype._unload = function () {
        if (this.unload && this.unload.energyCapacity === this.unload.energy) {
            this.unload = null;
        }
        if (!this.unload) {
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
        // Switch states
        if (this.isFull() && !this.isUnloading()) {
            this.memory.state = HARVESTER_UNLOADING;
            this.memory.source = null;
        }
        if (this.isEmpty() && !this.isLoading()) {
            this.memory.state = HARVESTER_LOADING;
            this.memory.unload = null;
        }
        // Harvest or unload
        if (this.isLoading()) {
            this._harvest();
        }
        if (this.isUnloading()) {
            this._unload();
        }
    };
};