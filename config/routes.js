module.exports = function(app){

    var appCtrl = require('../app/controllers/app');
    
    app.all('*',function(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
        next();
    });

    app.get(/^\/api(.*)$/, appCtrl.getResponse);

    app.post('/services', appCtrl.addService); //add a service
    app.get('/services', appCtrl.getServices); //get services
    app.post('/services/:serviceId/scenarios', appCtrl.addScenario); //add a scenario

    /*
    app.get('/services'); // get all services
    app.get('/services/:serviceId/scenarios'); // get all scenarios for all methods for a specific service
    app.get('/services/:serviceId/scenarios?method=get'); // get all scenarios for a specific method for a specific service
    app.get('/services/:serviceId/scenarios/scenarioId'); //get scenario data
    
    app.post('/services'); //add a service
    app.update('/services/:serviceId'); //update a service
    app.delete('/services/:serviceId'); //delete a service

    app.post('/services/:serviceId/sccearios'); //add a scenario
    app.update('/services/:serviceId/scenarios/scenarioId'); //update a scenario
    app.delete('/services/:serviceId/scenarios/scenarioId'); //delete a scenario
    */
};
