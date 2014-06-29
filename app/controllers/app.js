var APP_CONFIG = require('../../config/app-config');
var data = require('../models/data.js').getInstance( APP_CONFIG.DATA_PATH );

var _ = require('underscore');

var Service = require('../models/service.js');
var Scenario = require('../models/scenario.js');

exports.getResponse = function(req, res){
    var method = req.method.toLowerCase();
    var path = req.params[0];
    var query = req.query;

    var service = new Service(path, method, query);

    res.json( service.getResponse() );
};

exports.getServices = function(req, res){
    var serviceId = req.query.serviceId || undefined;
    var services = _.map(data.getServices(), function(service){

        if( !serviceId || serviceId === service.id ){
            return _.pick(service, 'id', 'name', 'path', 'mode', 'responses', 'params');
        }
        return null;
    });
    services = _.compact(services);

    var response;
    switch(services.length){
        // This is a edge case. In a normal situation, this shouldn't happen, but in case we fail to find
        // the service data, we return an empty object instead of an empty array as before.
        case 0:
            response = {};
            break;
        case 1: 
            response = services[0];
            break;
        default:
            response = services;
            break;
    }

    res.json( response );
};

exports.addService = function(req, res){
    var body = req.body;

    var params = {
        name: body.name,
        path: body.path.slice(0,1) !== '/' ? '/'+body.path : body.path,
        mode: body.mode,
        rawParams: body.params
    };

    var service = new Service(params);

    service.save().then(function(response){
        res.json({
            name: response.name,
            id: response.id
        });
    }, function(response){
        if( response.errors.length > 0 ){
            res.json({
                name: response.errors[0].data.service.name,
                id: response.errors[0].data.service.id
            });
            return;
        }
        res.status(400);
        res.json({
            error: true
        });
    });
};

exports.addScenario = function(req, res){
    var body = req.body;

    var params = {
        service: body.service,
        name: body.name,
        method: body.method,
        response: body.response,
        rawParams: body.params
    };

    var scenario = new Scenario(params);

    scenario.save().then(function(response){
        res.json({
            name: response.name,
            id: response.id
        });
    }, function(response){
        res.status(400);
        res.json({
            error: true,
            data: response
        });
    });
};