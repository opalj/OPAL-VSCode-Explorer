var expect = require('chai').expect;
import { InitService } from '../extension/service/init.service';
var config = require('./../../opal.config.json');

suite("OPAL Initialization Test Suit", function () {
	this.timeout(0);
    test('assertion success', async () => {
        var initService = new InitService(config.server.url);
        var request = {
			"projectId": "/bla/projects/projectX",
			"classpath":"abc"
		};
        var res : any = await initService.init(request);
        expect(res).to.equal("100 % loaded");
		
    });
});