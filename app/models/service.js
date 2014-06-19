var APP_CONFIG = require('../../config/app-config');
var data = require( APP_CONFIG.DATA_PATH );
var RESTMock = require('rest-mock').init(data);
var Q = require('q');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports = function(servicePath, method, query){
    if( typeof servicePath === 'string' ){
        this.path = servicePath;
        this.method = method;
        this.query = query;
    }
    
    if( typeof servicePath === 'object' ){
        this.path = servicePath.path;
        this.name = servicePath.name;
        this.mode = servicePath.mode;
        this.id = new Date().getTime().toString();
        this.params = _.map(servicePath.rawParams, function(rawParam){
            return _.pick(rawParam, 'type', 'key');
        });
    }

    this.getResponse = function(){
        return RESTMock.getResponse({
            path: this.path,
            query: this.query,
            method: this.method
        });
    };

    this.exists = function(){
        var existing = _.where(data.services, {
            path: this.path
        });

        return existing.length > 0;
    };

    // saves to disk the current service
    // TODO: Might need to check if this service already exists on disk and override it if that's
    // the case
    this.save = function(){
        var deferred = Q.defer();

        // check if we have a service with this path. If we do, notify the error and return.
        if( this.exists() ){
            deferred.reject({
                errors: [
                    {
                        error: 'This service already exists.',
                        data: {
                            service: {
                                name: this.name,
                                id: this.id
                            }
                        }
                    }
                ]
            });
            return deferred.promise;
        }

        data.services.push({
            id: this.id,
            name: this.name,
            mode: this.mode,
            path: this.path,
            params: this.params,
            responses: {}
        });

        try{
            fs.writeFileSync( APP_CONFIG.DATA_PATH , JSON.stringify(data));
            deferred.resolve(this);
        }catch(e){
            deferred.reject([
                {
                    error: 'Data could not be written to file.'
                }
            ]);
        }

        return deferred.promise;
    };
};