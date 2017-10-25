module.exports = function () {
    const UPGRADER_UPGRADING = 'UPGRADING';
    const UPGRADER_LOADING = 'LOADING';
    Upgrader = function (creep) {
        this.error = false;
        try {
            Object.assign(this, creep);
            this.loadObjects();
        } catch (e) {
            this.error = true;
        }
    };
    Upgrader.prototype = Creep.prototype;
    // Don't put methods above this line !

    Upgrader.prototype.loadObjects = function () {
        this.controller = Game.getObjectById(this.memory.controller);
        this.source = Game.getObjectById(this.memory.source);
    };

    Upgrader.prototype.findController = function () {
        this.controller = this.room.controller;
        this.memory.controller = this.controller;
        this.memory.controller = this.controller === null ? null : this.controller.id;
    };

    Upgrader.prototype.findSource = function () {
        this.source = this.pos.findClosestByPath(FIND_MY_SPAWNS);
        this.memory.source = this.source === null ? null : this.source.id;
    };

    Upgrader.prototype.isLoading = function () {
        return this.memory.state === UPGRADER_LOADING;
    };

    Upgrader.prototype.isUpgrading = function () {
        return this.memory.state === UPGRADER_UPGRADING;
    };

    Upgrader.prototype._load = function () {
        if (this.source === null) {
            this.findSource();
        }
        if (!this.withdrawing(this.source, RESOURCE_ENERGY)) {
            this.moveTo(this.source);
        }
    };

    Upgrader.prototype._upgrade = function () {
        if (this.controller === null) {
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