var expect = require('chai').expect;
import { InitService } from '../extension/service/init.service';
var config = require('./../../opal.config.json');

suite("OPAL Initialization Test Suit", function () {
    test('assertion success', async () => {
        var initService = new InitService(config.server.url);
        
        var res : any = await initService.init(config.opal);
        expect(res).to.have.property('classpath');
		expect(res).to.have.property('status');
    });
});