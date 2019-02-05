{
	"$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
	"name": "three-address-code",
	"patterns": [
		{
			"include": "#keyword"
		},
		{
			"include": "#support"
		},
		{
			"include": "string"
		},
		{
			"include": "comment"
		}
	],
	"repository": {
		"keyword": {
			"patterns": [
				{	
					"name" : "keyword.control",
					"match" : "\\b(if|goto)\\b"
				},
				{	
					"name" : "keyword.operator",
					"match" : "\\b(new)\\b"
				}
			]
		},
		"support": {
			"patterns" : [
						{	
							"name" : "support.constant",
							"match" : "^\\s+\\d+:"
						},
						{	
							"name" : "support.constant",
							"match" : "^\\s+\/\/\\s(\\d)+(, \\d+)* \u2192"
						},
						{	
							"name" : "support.constant",
							"match" : "\/\\*pc=\\d+:\\*\/"
						}
			]
		},
		"string": {
			"name": "string.quoted.double.untitled",
			"begin": "\"",
			"end": "\"",
			"patterns": [
				{
					"name": "constant.character.escape.untitled",
					"match": "\\."
				}
			]
		},
		"comment":
		{
			"patterns": [{
				"name": "comment",
				"match": "\/\\*(\\s|\\.|\\w)*\\*\/"
			}]
		}
	},
	"scopeName": "source.tac"
}