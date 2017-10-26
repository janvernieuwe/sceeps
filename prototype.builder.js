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
        // No walls
        this.storeObject(BUILDER_CONSTRUCTION, this.pos.findClosestByPath(
            FIND_MY_CONSTRUCTION_SITES
        ));
        // Nothing to do, fine then build walls
        if (this.construction) {
            return;
        }
        this.storeObject(BUILDER_CONSTRUCTION, this.findWeakestWall());
    };

    Builder.prototype.findWeakestWall = function() {
        let walls = this.room.find(
            FIND_STRUCTURES,
            {filter: (s) => s.structureType === STRUCTURE_WALL}
        );
        walls = walls.sort((a, b) => a.hits > b.hits ? 1 : -1);
        if(!walls.length) {
            return null;
        }
        return walls[0];
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

    Builder.prototype._repair = function () {
        if (!this.repairing(this.construction)) {
            this.moveTo(this.construction);
        }
    }

    Builder.prototype.isWall = function (object) {
        return object
            && object.structureType === STRUCTURE_WALL
            && object.energy === object.energyCapacity;
    }

    Builder.prototype._build = function () {
        if (!this.construction) {
            this.findConstructionSite();
        }
        // In case of walls, upgrade
        if (this.isWall(this.construction)) {
            return this._repair();
        }
        // Else build
        if (!this.building(this.construction, RESOURCE_ENERGY)) {
            return this.moveTo(this.construction);
        }
    };

    Builder.prototype.run = function () {
        if (this.error) {
            return;
        }
        if (this.isFull() && !this.isBuilding()) {
            this.memory.state = BUILDER_BUILDING;
        }
        if (this.isEmpty() && !this.isLoading()) {
            this.memory.state = BUILDER_LOADING;
            this.deleteObject(BUILDER_CONSTRUCTION);
        }
        if (this.isLoading()) {
            this._load();
        }
        if (this.isBuilding()) {
            this._build();
        }
    };
};