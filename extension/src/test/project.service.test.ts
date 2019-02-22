var expect = require('chai').expect;
import { ProjectService } from '../extension/service/project.service';
var config = require('./../../opal.config.json');

suite("OPAL Initialization Test Suit", function () {
	this.timeout(0);
    test('assertion success', async () => {
        var projectService = new ProjectService(config.server.url);
        var request = {
			"projectId": "/bla/projects/projectX",
			"classpath":"abc"
		};
        var res : any = await projectService.load(request);
        expect(res).to.equal("100 % loaded");
		
    });
});