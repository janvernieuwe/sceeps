module.exports = function () {
    Creep.prototype.isFull = function () {
        return this.carry.energy === this.carryCapacity;
    };
    Creep.prototype.isEmpty = function () {
        return this.carry.energy === 0;
    };
    Creep.prototype.harvesting = function(target) {
        return this.harvest(target) === OK;
    };
    Creep.prototype.transferring = function(target, type) {
        return this.transfer(target, type) === OK;
    };
    Creep.prototype.withdrawing = function(target, type) {
        return this.withdraw(target, type) === OK;
    };
    Creep.prototype.building = function(target) {
        return this.build(target) !== ERR_NOT_IN_RANGE;
    };
};