const expect = require("chai").expect;
import { ProjectService } from "../../extension/service/project.service";
import ClassDAO from "../../extension/model/class.dao";
import ContextService from "../../extension/service/context.service";
import { CommandService } from "../../extension/service/command.service";

const serverUrl = "http://localhost:8080";

suite("OPAL Initialization Test Suit", function () {
  this.timeout(20000);
  test("opal load project no fail", (done) => {
    const contextService = new ContextService("");
    const classDAO = new ClassDAO(contextService);
    const projectService = new ProjectService(
      serverUrl,
      "/bla/projects/projectX",
      classDAO
    );
    const message = {
      projectId: "/bla/projects/projectX",
      targets: ["./../../../dummy/Test.class"],
      libraries: [],
      config: {},
    };
    projectService.load(message).then(function (res: any) {
      const message = {
        projectId: "/bla/projects/projectX",
        target: "",
        config: {},
      };
      projectService
        .requestLOG(message)
        .then(function (res: any) {
          done();
        })
        .catch(function (error: any) {
          console.log(error);
        });

      const commandService = new CommandService(serverUrl);
      const tacForClassMessage = {
        projectId: "/bla/projects/projectX",
        fqn: "Test",
        className: "Test",
        version: "",
      };
      commandService
        .loadTAC(tacForClassMessage)
        .then((res) => {
          console.log(res);
          done();
        })
        .catch(function (error: any) {
          console.log(error);
        });
    });
  });

  test("opal project load libs", (done) => {
    const contextService = new ContextService("");
    const classDAO = new ClassDAO(contextService);
    const projectService = new ProjectService(
      serverUrl,
      "/bla/projects/projectX",
      classDAO
    );
    projectService.addLibraries("./../../../").then(function () {
      done();
      expect(projectService.libraries).to.equal("Test.jar");
    });
  });
});
