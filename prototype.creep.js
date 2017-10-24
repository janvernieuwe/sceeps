module.exports = function () {
    Creep.prototype.isFull = function () {
        return this.carry.energy === this.carryCapacity;
    };
    Creep.prototype.isEmpty = function () {
        return this.carry.energy === 0;
    };
};