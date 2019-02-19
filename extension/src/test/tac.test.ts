var expect = require('chai').expect;
import { TacService } from '../extension/service/tac.service';

/**
 * Tests for TAC Features
 */
suite("TAC Test Suit", function () {

    test('assertion success short1.txt', async () => {
        var tacService = new TacService("http://localhost:8080/tac/");
        var id = 'short1.txt';


            var res : any = await tacService.loadTAC(id);    
            expect(res).to.have.property('tac');
            expect(res).to.have.property('id');
            expect(res.id).to.equal(id);
            expect(res.tac).to.have.string('void <init>(){');
            expect(res.tac).to.have.string('param0: useSites={0} (origin=-1)');
            expect(res.tac).to.have.string('// ⚡️ <uncaught exception ⇒ abnormal return>');

      });

	test('assertion success severalMethods.txt', async () => {
        var tacService = new TacService("http://localhost:8080/tac/");
        var id = 'severalMethods.txt';


            var res : any = await tacService.loadTAC(id);    
            expect(res).to.have.property('tac');
            expect(res).to.have.property('id');
            expect(res.id).to.equal(id);
            expect(res.tac).to.have.string('void a(java.lang.String){');
            expect(res.tac).to.have.string('7:/*pc=24:*/ lv7 = {param0}/*com.android.volley.VolleyLog$a*/.b');
            expect(res.tac).to.have.string('30:/*pc=96:*/ lv1e = "(%-4d ms) %s"');

      });

	test('assertion success intermediate2.txt', async () => {
        var tacService = new TacService("http://localhost:8080/tac/");
        var id = 'intermediate2.txt';


            var res : any = await tacService.loadTAC(id);    
            expect(res).to.have.property('tac');
            expect(res).to.have.property('id');
            expect(res.id).to.equal(id);
            expect(res.tac).to.have.string('4:/*pc=14:*/ lv4 = "volley/0"');
            expect(res.tac).to.have.string('1:/*pc=5:*/');
            expect(res.tac).to.have.string('static com.android.volley');

      });
});
