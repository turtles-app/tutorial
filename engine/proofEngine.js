//Function that verifies if an element is in a given atmoic set (A set represented by its own name, not the result of an operation of other sets), 
//based on an array of facts, each of which is a 3 fact object as defined in setEngine.js
//Returns true if element is verifiably in the set, and false otherwise
var inAtomic = function(eName, setName, facts) {
	var res = false;
	facts.forEach(function(fact, index, sameFacts) {
		if (fact.elementName === eName){
			if(fact.isIn && fact.setSyntax === setName) {
				res = true; //Only return true if one of the facts is that element is a member of set
			} else if (!fact.simple) {
				switch(fact.setSyntax[1]) {
					case '/':
						if (fact.setSyntax[0] === setName) {
							res = true;
						}
						break;
					case 'n':
						if (fact.setSyntax[0] === setName || fact.setSyntax[2] === setName) {
							res = true;
						}
						break;
					case 'U':
						sameFacts.forEach(function(f, i) {
							if (fact.setSyntax[0] === setName) {
								if (!f.isIn && _.isEqual(f.setSyntax, fact.setSyntax[2]) ) {
									res = true;
								}
							} else if (fact.setSyntax[2] === setName) {
								if (!f.isIn && _.isEqual(f.setSyntax, fact.setSyntax[0]) ) {
									res = true;
								}
							}
						});
						break;
				}
			}
		} 
	});
	return res;
};

var notInAtomic = function(eName, setName, facts) {
	var res = false;
	facts.forEach(function(fact, index, list) {
		if (fact.elementName === eName && !fact.isIn && fact.setSyntax ===setName) {
			res = true;
		}
	});
	return res;
};

//Function checks if an element can be concluded to be in a composite set (resulting from operation between two other sets)
// based on a single fact object
var inSyntax = function(eName, syntax, fact) {
	//Check if first set in syntax matches the fact syntax
};

//Function that verifies if an element is in any set based on
//an array of facts. Element obj's are defined above, and facts are explained in the above comment.

//The Syntax argument is a 3-element array, where the first and third elements are syntactic representations
//of sets; either a string (set's name), or another syntax array. The second element is a string representing the operation.
//Syntax arrays represent the set that results from an operation sets. A U (B n C) = ['A', 'U', ['B', 'n', C]]
var contains = function(eName, syntax, facts) {
	var inFirst  = false;
	var inSecond = false;

	switch (typeof(syntax)) {
		case 'string':
			return inAtomic(eName, syntax, facts);
			break;
		case 'object':

			//Is element in the first set?
			switch (typeof(syntax[0])) {
				case 'string':
					inFirst = inAtomic(eName, syntax[0], facts);
					break;
				case 'object':
					var recurse = true;
					facts.forEach(function(fact, index, list) {
						//If the fact asserts that eName is in a composite set
						if (fact.elementName === eName && !fact.simple) { //Then check if fact asserts eName is in first set of syntax
							var syntaxMatch = _.isEqual(fact.setSyntax, syntax[0]);
							if (syntaxMatch) {
								recurse = false;
								inFirst = true;
							} 
						}
					});
					if (recurse) {
						inFirst = contains(eName, syntax[0], facts);
					}
					break;
			}

			//Is element in the second set?
			switch (typeof(syntax[2])) {
				case 'string':
					inSecond = inAtomic(eName, syntax[2], facts);
					break;
				case 'object':
					var recurse = true;
					facts.forEach(function(fact, index, list) {
						//If the fact asserts that eName is in a composite set
						if (fact.elementName === eName && !fact.simple) { //Then check if fact asserts eName is in first set of syntax
							var syntaxMatch = _.isEqual(fact.setSyntax, syntax[2]);
							if (syntaxMatch) {
								recurse = false;
								inFirst = true;
							}
						}
					});		
					if (recurse) {
						inSecond = contains(eName, syntax[2], facts);
					}
					break;
			}

			//Return true or false, based on inFirst, inSecond, and the set operator (syntax[1])
			switch (syntax[1]) {
				case 'U': //Definition of Union operator
					return inFirst || inSecond;
					break;
				case 'n': //Definition of Intersect operator
					return inFirst && inSecond;
					break;
				case '/': //Definition of Set Difference operator
					return inFirst && (!inSecond);
			}
			break;
	}

};