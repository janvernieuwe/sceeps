module.exports = function () {
    const BUILDER_BUILDING = 'BUILDING';
    const BUILDER_LOADING = 'LOADING';
    Builder = function (creep, halt) {
        this.halt = halt;
        this.error = false;
        try {
            Object.assign(this, creep);
            this.loadObjects();
        } catch (e) {
            this.error = true;
        }
    };
    Builder.prototype = Creep.prototype;
    // Don't put methods above this line !

    Builder.prototype.loadObjects = function () {
        this.construction = Game.getObjectById(this.memory.construction);
        this.source = Game.getObjectById(this.memory.source);
    };

    Builder.prototype.findConstructionSite = function () {
        this.construction = this.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        this.memory.construction = this.construction;
        this.memory.construction = this.construction === null ? null : this.construction.id;
    };

    Builder.prototype.findSource = function () {
        this.source = this.pos.findClosestByPath(FIND_MY_SPAWNS);
        this.memory.source = this.source === null ? null : this.source.id;
    };

    Builder.prototype.isLoading = function () {
        return this.memory.state === BUILDER_LOADING;
    };

    Builder.prototype.isBuilding = function () {
        return this.memory.state === BUILDER_BUILDING;
    };

    Builder.prototype._load = function () {
        if (this.source === null) {
            this.findSource();
        }
        if (!this.withdrawing(this.source, RESOURCE_ENERGY)) {
            this.moveTo(this.source);
        }
    };

    Builder.prototype._build = function () {
        if (this.construction === null) {
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