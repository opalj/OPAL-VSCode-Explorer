// var expect = require('chai').expect;
import BCDocument from './../extension/document/bc.document';
import { Uri } from 'vscode';
import { EventEmitter } from 'vscode';


suite("Byte Code Document Test Suit", function () {
    this.timeout(20000);
    test('byte code json will be parsed correct', (done) => {
        var bcDoc = new BCDocument(Uri.parse("bc:bla/test"),new EventEmitter<Uri>(), "", Uri.parse("bc:bla/test"), { get : function() {return "test";}}, "");

        var bcJSON = {"example" : { "instructions":"Array((0,ICONST_2), (1,ISTORE_1), (2,ILOAD_1), (3,SIPUSH(1000)), (6,IF_ICMPGE(38)), (9,ICONST_2), (10,ISTORE_2), (11,ILOAD_2), (12,ILOAD_1), (13,IF_ICMPGE(18)), (16,ILOAD_1), (17,ILOAD_2), (18,IREM), (19,IFEQ(19)), (22,NOP), (23,NOP), (24,NOP), (25,IINC(lvIndex=2, 1)), (28,GOTO(-17)), (31,get static java.lang.System.out : java.io.PrintStream), (34,ILOAD_1), (35,INVOKEVIRTUAL(java.io.PrintStream{ void println(int) })), (38,IINC(lvIndex=1, 1)), (41,GOTO(-39)), (44,RETURN))","exceptions":"RefArray()","attributes":"RefArray(CompactLineNumber({ LineNumber(0,10), LineNumber(9,11), LineNumber(16,12), LineNumber(22,13), LineNumber(25,11), LineNumber(31,15), LineNumber(38,10), LineNumber(44,17) }), StackMapTable(RefArray(AppendFrame(252,2,RefArray(IntegerVariableInfo)), AppendFrame(252,8,RefArray(IntegerVariableInfo)), SameFrame(13), ChopFrame250(5), SameFrame(6), ChopFrame250(5))))"} };

        var bc = bcDoc.parseBCJson(bcJSON);
        
        console.log(bc);
    });
});

