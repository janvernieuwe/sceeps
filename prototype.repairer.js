module.exports = function () {

    const REPAIRER_REPAIRING = 'REPAIRING';
    const REPAIRER_LOADING = 'LOADING';
    const REPAIRER_TARGET = 'target';
    const REPAIRER_SOURCE = 'source';

    Repairer = function (creep, halt) {
        this.halt = halt;
        this.error = false;
        try {
            Object.assign(this, creep);
            this.loadObject(REPAIRER_TARGET);
            this.loadObject(REPAIRER_SOURCE);
        } catch (e) {
            this.error = true;
        }
    };
    Repairer.prototype = Creep.prototype;
    // Don't put methods above this line !

    Repairer.prototype.findTargetSite = function () {
        // No walls
        this.storeObject(REPAIRER_TARGET, this.findWeakestStructure());
        // Nothing to do, fine then build walls
        if (this.target) {
            return;
        }
        this.storeObject(REPAIRER_TARGET, this.findWeakestWall());
    };

    Repairer.prototype.findWeakestWall = function () {
        return this.findSorted(
            FIND_STRUCTURES,
            (s) => s.structureType === STRUCTURE_WALL && s.hits < s.hitsMax,
            'hits'
        )[0];
    };

    Repairer.prototype.findWeakestStructure = function () {
        return this.findSorted(
            FIND_STRUCTURES,
            (s) => s.structureType !== STRUCTURE_WALL && s.hits < s.hitsMax,
            'hits'
        )[0];
    };

    Repairer.prototype.findSource = function () {
        this.storeObject(REPAIRER_SOURCE, this.pos.findClosestByPath(FIND_MY_SPAWNS));
    };

    Repairer.prototype.isLoading = function () {
        return this.memory.state === REPAIRER_LOADING;
    };

    Repairer.prototype.isRepairing = function () {
        return this.memory.state === REPAIRER_REPAIRING;
    };

    Repairer.prototype._load = function () {
        if (!this.source) {
            this.findSource();
        }
        if (!this.withdrawing(this.source, RESOURCE_ENERGY)) {
            this.moveTo(this.source);
        }
    };

    Repairer.prototype._repair = function () {
        // Repair complete
        if (this.target && this.target.hits === this.target.hitsMax) {
            this.target = null;
        }
        // Look for target
        if (!this.target) {
            this.findTargetSite();
        }
        // Repair
        if (!this.repairing(this.target)) {
            this.moveTo(this.target);
        }
    }

    Repairer.prototype.run = function () {
        if (this.error) {
            return;
        }
        if (this.isFull() && !this.isRepairing()) {
            this.memory.state = REPAIRER_REPAIRING;
        }
        if (this.isEmpty() && !this.isLoading()) {
            this.memory.state = REPAIRER_LOADING;
            this.deleteObject(REPAIRER_TARGET);
        }
        if (this.isLoading()) {
            this._load();
        }
        if (this.isRepairing()) {
            this._repair();
        }
    };
};