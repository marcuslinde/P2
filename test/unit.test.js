/**
 * Get a greeting
 * @param  {String} name The name of the person to greet
 * @return {String}      The greeting
 */
function sayHi (name) {
	return `Hi ${name}!`;
}

test(("returns"), ()=>{
    expect(typeof sayHi("hi")).toBe('string');

})
