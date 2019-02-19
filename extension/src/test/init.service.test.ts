var expect = require('chai').expect;
import { InitService } from '../extension/service/init.service';
var config = require('./../../opal.config.json');

suite("Extension Tests", function () {
    test('assertion success', async () => {
        var initService = new InitService(config.server.url);
        
        try {
            var res : any = await initService.init(config.opal);
            expect(res).to.have.property('tac');
            expect(res).to.have.property('id');
            
        } catch(error) {
            console.log(error);
        }
    });
});