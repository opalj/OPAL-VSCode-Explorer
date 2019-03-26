//var expect = require('chai').expect;
//import  { LinkParser }  from '../extension/provider/tac.document';
//import * as vscode from 'vscode';
//var expect = require('chai').expect;

suite("tac document Test Suit", function () {
    test('match line index', () => {
        //var path: vscode.Uri = vscode.Uri.parse("file:C:/Users/Alexander/Documents/asep/vscode_plugin/opal-vscode-explorer/extension/src/severalMethods.tac");
        //var linkParser = new LinkParser("");
        //var lineIndex = linkParser.matchLineIndex("    3:/*pc=12:*/ {param0}/*com.android.volley.VolleyLog$a*/.b = {lv1}\r");
        //expect(lineIndex).to.eql('3');
    });

    test('match caller', () => {        
        //var linkParser = new LinkParser("");
        //var matchCaller = linkParser.matchCaller("      // 1, 7 →");
        //expect(matchCaller).to.eql(["1", "7"]);
    });

    test('match goto', () => {
        //var linkParser = new LinkParser("");
        //var gotoLine = linkParser.matchGOTO("    1:/*pc=4:*/ if({lv0} != 0) goto 8");
        //expect(gotoLine).to.eql("8");
    });
});