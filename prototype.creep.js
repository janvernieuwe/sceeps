module.exports = function () {
    Creep.prototype.halt = false;

    Creep.prototype.isFull = function () {
        return this.carry.energy === this.carryCapacity;
    };

    Creep.prototype.isEmpty = function () {
        return this.carry.energy === 0;
    };

    Creep.prototype.harvesting = function (target) {
        return this.harvest(target) === OK;
    };

    Creep.prototype.transferring = function (target, type) {
        return this.transfer(target, type) === OK;
    };

    Creep.prototype.repairing = function (target) {
        return this.repair(target) === OK;
    };

    Creep.prototype.withdrawing = function (target, type) {
        if (this.halt) {
            this.say('HALT!');
            return true;
        }
        return this.withdraw(target, type) === OK;
    };

    Creep.prototype.building = function (target) {
        return this.build(target) !== ERR_NOT_IN_RANGE;
    };

    Creep.prototype.storeObject = function (key, object) {
        this.memory[key] = !object ? null : object.id;
        this[key] = object;
    }

    Creep.prototype.loadObject = function (key) {
        if (this.memory[key] === undefined) {
            return null;
        }
        if (this[key] === undefined) {
            this[key] = Game.getObjectById(this.memory[key]);
        }
        if (this[key] === undefined) {
            return null;
        }
        return this[key];
    }

    Creep.prototype.deleteObject = function (key) {
        delete this.memory[key];
        delete this[key];
    };
};