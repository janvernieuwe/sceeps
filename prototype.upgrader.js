module.exports = function () {

    const UPGRADER_UPGRADING = 'UPGRADING';
    const UPGRADER_LOADING = 'LOADING';
    const UPGRADER_CONTROLLER = 'controller';
    const UPGRADER_SOURCE = 'source';

    Upgrader = function (creep, halt) {
        this.halt = halt;
        this.error = false;
        try {
            Object.assign(this, creep);
            this.loadObject(UPGRADER_CONTROLLER);
            this.loadObject(UPGRADER_SOURCE);
        } catch (e) {
            this.error = true;
        }
    };
    Upgrader.prototype = Creep.prototype;
    // Don't put methods above this line !

    Upgrader.prototype.findController = function () {
        this.storeObject(UPGRADER_CONTROLLER, this.room.controller);
    };

    Upgrader.prototype.findSource = function () {
        this.storeObject(UPGRADER_SOURCE, this.pos.findClosestByPath(FIND_MY_SPAWNS));
    };

    Upgrader.prototype.isLoading = function () {
        return this.memory.state === UPGRADER_LOADING;
    };

    Upgrader.prototype.isUpgrading = function () {
        return this.memory.state === UPGRADER_UPGRADING;
    };

    Upgrader.prototype._load = function () {
        if (!this.source) {
            this.findSource();
        }
        if (!this.withdrawing(this.source, RESOURCE_ENERGY)) {
            this.moveTo(this.source);
        }
    };

    Upgrader.prototype._upgrade = function () {
        if (!this.controller) {
            this.findController();
        }
        if (!this.transferring(this.controller, RESOURCE_ENERGY)) {
            this.moveTo(this.controller);
        }
    };

    Upgrader.prototype.run = function () {
        if (this.error) {
            return;
        }
        if (this.isFull()) {
            this.memory.state = UPGRADER_UPGRADING;
        }
        if (this.isEmpty()) {
            this.memory.state = UPGRADER_LOADING;
        }
        if (this.isLoading()) {
            this._load();
        }
        if (this.isUpgrading()) {
            this._upgrade();
        }
    };
};