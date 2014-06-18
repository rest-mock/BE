var APP_CONFIG = require('../../config/app-config');
var data = require( APP_CONFIG.DATA_PATH );

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

    var services = _.map(data.services, function(service){
        if( !serviceId || serviceId === service.id ){
            return _.pick(service, 'id', 'name', 'responses');
        }

        return null;
    });

    res.json({services: _.compact(services)});
};

exports.addService = function(req, res){
    var body = req.body;

    var params = {
        name: body.name,
        path: body.path.slice(0,1) !== '/' ? '/'+body.path : body.path,
        mode: body.mode
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
        response: body.response
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