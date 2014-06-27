var instance;

function dataService( filePath ){
    var data = require( filePath );
    var dirty;

    this.setDirty = function(){
        dirty = true;
    };

    this.setPristine = function(){
        dirty = false;
    };

    this.get = function(){
        if( dirty ){
            data = require(filePath);
        }

        return data;
    };

    this.getServices = function(){
        var _data = this.get();
        return _data.services;
    };

    this.getServiceByIndex = function(serviceIndex){
        var services = this.getServices();
        return services[serviceIndex] || null;
    };

    this.addService = function(newService){
        data.services.push( newService );
        // this.setDirty();
    };

    this.updateService = function(serviceIndex, service){
        var _data = this.get();
        _data.services[serviceIndex] = service;
        // this.setDirty();
    };
}

module.exports.getInstance = function(filePath){
    if( !instance ){
        instance = new dataService(filePath);
    }

    return instance;
};