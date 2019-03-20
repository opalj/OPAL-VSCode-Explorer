var expect = require('chai').expect;
import  TACDocument  from '../extension/provider/tac.document';


suite("tac document Test Suit", function () {
    
    test('parse document', (done) => {
        var test = "// 1, 7 → \n 8:/*pc=22:*/ return";
        var res = TACDocument._parseDoc(test);
        expect(res).to.equal("");
    });
});