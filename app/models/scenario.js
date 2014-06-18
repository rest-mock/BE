'use strict';

var APP_CONFIG = require('../../config/app-config');
var data = require( APP_CONFIG.DATA_PATH );
var RESTMock = require('rest-mock').init(data);
var Q = require('q');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports = function(params){
    var scenarioParams = _.map(params.rawParams, function(rawParam){
        return {
            key: rawParam.name,
            value: rawParam.value
        };
    });

    this.serviceId = params.service;
    this.name = params.name;
    this.method = params.method;
    this.response = params.response;
    this.id = new Date().getTime().toString();
    this.params = scenarioParams;

    // TODO: Handle the case when the sercice doesn exists
    // this.getService = function(){
    //     return _.findWhere(data.services, {id: this.serviceId});
    // };

    this.save = function(){
        var deferred = Q.defer();

        // var service = this.getService();

        var serviceIndex;
        _.each(data.services, function(service, index){
            if( service.id === this.serviceId ){
                serviceIndex = index;
            }
        }, this);
        if( !data.services[serviceIndex] ){
            deferred.reject([
                {
                    error: 'Service ' + this.serviceId + ' could not be found.'
                }
            ]);
            return deferred.promise;
        }

        if( !data.services[serviceIndex].responses[this.method] ){
            data.services[serviceIndex].responses[this.method] = [];
        }

        data.services[serviceIndex].responses[this.method].push({
            id: this.id,
            name: this.name,
            params: this.params,
            response: this.response
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