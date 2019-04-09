var expect = require('chai').expect;
import { ProjectService } from '../extension/service/project.service';
var config = require('./../../opal.config.json');

suite("OPAL Initialization Test Suit", function () {
    this.timeout(20000);
    test('opal load project no fail', (done) => {
        var projectService = new ProjectService(config.server.url, "/bla/projects/projectX");
        var message = {
			"projectId": "/bla/projects/projectX",
			"targets":["C:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\dummy\\Test.class"],
            "libraries": [],
            "config" : {}
		};
        projectService.load(message).then(function (res) {
            expect(res).to.equal("Project loaded");

            var message = {
                "projectId" : "/bla/projects/projectX",
                "target" : "",
                "config" : {}
            };
            projectService.requestLOG(message).then(function (res) {
                expect(res).to.have.string("creating the project took");
                done();
            }).catch(function (error) {
                console.log(error);
            });
        });
    });

    test("opal project load libs", (done) => {
        var projectService = new ProjectService(config.server.url, "/bla/projects/projectX");
        projectService.addLibraries("c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\lib\\OPALTACDisassembler.jar").then(function () {
            done();
            expect(projectService.libraries).to.equal("c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\lib\\OPALTACDisassembler.jar");
        });
    });
});