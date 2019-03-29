var expect = require('chai').expect;
import { CommandService } from '../extension/service/command.service';

/**
 * Tests for Command Service Features
 */
suite("Command Test Suit", function() {
  test("get fqn from path",  () => {
    var filePath = "\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\scala-2.12\\classes\\opal\\extension\\vscode\\OPALProject.class";
    var targetsDir = "c:\\Users\\Alexander\\Documents\\asep\\vscode_plugin\\opal-vscode-explorer\\server\\target\\scala-2.12\\classes";

    var cmdService = new CommandService("");
    var fqn = cmdService.getFQN(filePath, targetsDir);
    expect(fqn).to.equal("opal/extension/vscode/OPALProject");
  });
});
