module.exports = function () {
    Creep.prototype.isFull = function () {
        return this.carry.energy === this.carryCapacity;
    };
    Creep.prototype.isEmpty = function () {
        return this.carry.energy === 0;
    };
    Creep.prototype.harvesting = function(target) {
        return this.harvest(target) !== ERR_NOT_IN_RANGE;
    };
    Creep.prototype.transferring = function(target, type) {
        return this.transfer(target, type) !== ERR_NOT_IN_RANGE;
    };
    Creep.prototype.withdrawing = function(target, type) {
        return this.withdraw(target, type) !== ERR_NOT_IN_RANGE;
    };
    Creep.prototype.building = function(target) {
        return this.build(target) !== ERR_NOT_IN_RANGE;
    };
};