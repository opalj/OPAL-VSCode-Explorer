var expect = require('chai').expect;
import { ProjectService } from '../extension/service/project.service';
var config = require('./../../opal.config.json');

suite("OPAL Initialization Test Suit", function () {
//    this.timeout(5000);
    test('assertion success', (done) => {
        var projectService = new ProjectService(config.server.url);
        var request = {
			"projectId": "/bla/projects/projectX",
			"targets":["C:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\dummy\\Test.class"],
            "libraries": [],
            "config" : {}
		};
        projectService.load(request).then(function (res) {
            expect(res).to.equal("Project loaded");
            done();
        });
    })
});