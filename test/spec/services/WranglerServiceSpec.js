'use strict';

describe('Unit: Wrangler Service', function () {
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
		expect(angular.isFunction(Wrangler.getRand)).toBeTruthy();
		expect(angular.isFunction(Wrangler.setKey)).toBeTruthy();
	});

	it('Wrangler.set should return type of CryptoJS.enc.Hex.parse()', function () {
		expect(typeof Wrangler.set('Any Data')).toEqual(typeof CryptoJS.enc.Hex.parse('Any Data'));
		expect(Wrangler.set('Any Data')).toEqual(CryptoJS.enc.Hex.parse('Any Data'));
	});

	it('Wrangler.getString should return String data', function () {
		var testData = CryptoJS.enc.Hex.parse('Some Value');
		expect(Wrangler.getString(testData)).toEqual(testData.toString());
	});

	it('Wrangler.getRand should return some Random value', function () {
		expect(Wrangler.getRand()).not.toBeUndefined();
	});

	it('Wrangler.setKey should return some Value', function() {
		expect(Wrangler.setKey()).not.toBeUndefined();
	});
});