var expect = require('chai').expect;
import { ProjectService } from '../extension/service/project.service';
import ClassDAO from '../extension/model/class.dao';
import ContextService from '../extension/service/context.service';
import { CommandService } from '../extension/service/command.service';

let serverUrl = 'http://localhost:8080';

suite("OPAL Initialization Test Suit", function () {
    this.timeout(20000);
    test('opal load project no fail', (done) => {
        let contextService = new ContextService("");
        let classDAO = new ClassDAO(contextService);
        let projectService = new ProjectService(serverUrl, "/bla/projects/projectX", classDAO);
        var message = {
			"projectId": "/bla/projects/projectX",
			"targets":["./../../../dummy/Test.class"],
            "libraries": [],
            "config" : {}
		};
        projectService.load(message).then(function (res : any) {
            var message = {
                "projectId" : "/bla/projects/projectX",
                "target" : "",
                "config" : {}
            };
            projectService.requestLOG(message).then(function (res : any) {
                done();
            }).catch(function (error : any) {
                console.log(error);
            });

            let commandService = new CommandService(serverUrl);
            let tacForClassMessage = {
                "projectId" : "/bla/projects/projectX",
                "fqn" : "Test",
                "className" : "Test",
                "version" : ""
            };
            commandService.loadTAC(tacForClassMessage).then((res) => {
                console.log(res);
                done();
            }).catch(function (error : any) {
                console.log(error);
            });
        });
    });

    test("opal project load libs", (done) => {
        let contextService = new ContextService("");
        let classDAO = new ClassDAO(contextService);
        var projectService = new ProjectService(serverUrl, "/bla/projects/projectX", classDAO);
        projectService.addLibraries("./../../../").then(function () {
            done();
            expect(projectService.libraries).to.equal("Test.jar");
        });
    });
});