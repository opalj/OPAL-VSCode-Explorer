//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

var expect = require('chai').expect;
import { TacService } from '../extension/service/tac.service';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    test('assertion success short1.txt', async () => {
        var tacService = new TacService("http://localhost:8080/tac/");
        var id = 'short1.txt';

        try {
            var res : any = await tacService.loadTAC(id);    
            expect(res).to.have.property('tac');
            expect(res).to.have.property('id');
            expect(res.id).to.equal(id);
            expect(res.tac).to.have.string('void <init>(){');
            expect(res.tac).to.have.string('param0: useSites={0} (origin=-1)');
            expect(res.tac).to.have.string('// ⚡️ <uncaught exception ⇒ abnormal return>');
        } catch(error) {
            console.log(error);
        }
      });

	test('assertion success severalMethods.txt', async () => {
        var tacService = new TacService("http://localhost:8080/tac/");
        var id = 'severalMethods.txt';

        try {
            var res : any = await tacService.loadTAC(id);    
            expect(res).to.have.property('tac');
            expect(res).to.have.property('id');
            expect(res.id).to.equal(id);
            expect(res.tac).to.have.string('void a(java.lang.String){');
            expect(res.tac).to.have.string('7:/*pc=24:*/ lv7 = {param0}/*com.android.volley.VolleyLog$a*/.b');
            expect(res.tac).to.have.string('30:/*pc=96:*/ lv1e = "(%-4d ms) %s"');
        } catch(error) {
            console.log(error);
        }
      });

	test('assertion success intermediate2.txt', async () => {
        var tacService = new TacService("http://localhost:8080/tac/");
        var id = 'intermediate2.txt';

        try {
            var res : any = await tacService.loadTAC(id);    
            expect(res).to.have.property('tac');
            expect(res).to.have.property('id');
            expect(res.id).to.equal(id);
            expect(res.tac).to.have.string('4:/*pc=14:*/ lv4 = "volley/0"');
            expect(res.tac).to.have.string('1:/*pc=5:*/');
            expect(res.tac).to.have.string('static com.android.volley');
        } catch(error) {
            console.log(error);
        }
      });
});
