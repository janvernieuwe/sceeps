module.exports = function () {

    const BUILDER_BUILDING = 'BUILDING';
    const BUILDER_LOADING = 'LOADING';
    const BUILDER_CONSTRUCTION = 'construction';
    const BUILDER_SOURCE = 'source';

    Builder = function (creep, halt) {
        this.halt = halt;
        this.error = false;
        try {
            Object.assign(this, creep);
            this.loadObject(BUILDER_CONSTRUCTION);
            this.loadObject(BUILDER_SOURCE);
        } catch (e) {
            this.error = true;
        }
    };
    Builder.prototype = Creep.prototype;
    // Don't put methods above this line !

    Builder.prototype.findConstructionSite = function () {
        this.storeObject(BUILDER_CONSTRUCTION, this.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES));
    };

    Builder.prototype.findSource = function () {
        this.storeObject(BUILDER_SOURCE, this.pos.findClosestByPath(FIND_MY_SPAWNS));
    };

    Builder.prototype.isLoading = function () {
        return this.memory.state === BUILDER_LOADING;
    };

    Builder.prototype.isBuilding = function () {
        return this.memory.state === BUILDER_BUILDING;
    };

    Builder.prototype._load = function () {
        if (!this.source) {
            this.findSource();
        }
        if (!this.withdrawing(this.source, RESOURCE_ENERGY)) {
            this.moveTo(this.source);
        }
    };

    Builder.prototype._build = function () {
        if (!this.construction) {
            this.findConstructionSite();
        }
        if (!this.building(this.construction, RESOURCE_ENERGY)) {
            this.moveTo(this.construction);
        }
    };

    Builder.prototype.run = function () {
        if (this.error) {
            return;
        }
        if (this.isFull()) {
            this.memory.state = BUILDER_BUILDING;
        }
        if (this.isEmpty()) {
            this.memory.state = BUILDER_LOADING;
            this.construction = null;
        }
        if (this.isLoading()) {
            this._load();
        }
        if (this.isBuilding()) {
            this._build();
        }
    };
};