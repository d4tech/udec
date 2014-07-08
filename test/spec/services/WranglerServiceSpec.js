'use strict';

xdescribe('Unit: Wrangler Service', function () {
	var Wrangler;

	beforeEach(function () {
		module('udecApp');

		inject(function($injector) {
		    Wrangler = $injector.get('Wrangler');
	      	// console.log(formatter);
    	});
	});

	it('Should be initialized', function () {
		expect(Wrangler).not.toBeUndefined();
		expect(angular.isFunction(Wrangler.set)).toBeTruthy();
		expect(angular.isFunction(Wrangler.getString)).toBeTruthy();
	});

	it('Wrangler.set should return type of CryptoJS.enc.Hex.parse()', function () {
		expect(typeof Wrangler.set('Any Data')).toEqual(typeof CryptoJS.enc.Hex.parse('Any Data'));
		expect(Wrangler.set('Any Data')).toEqual(CryptoJS.enc.Hex.parse('Any Data'));
	});

	it('Wrangler.getString should return String data', function () {
		var testData = CryptoJS.enc.Hex.parse('Some Value');
		expect(Wrangler.getString(testData)).toEqual(testData.toString());
	});

});