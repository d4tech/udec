'use strict';

describe('Unit: JSONFormatter', function () {
  var passKey, 
      JSONformatter;
  beforeEach(function (){
    module('udecApp');

    inject(function($injector) {
      passKey = $injector.get('passKey');
      JSONformatter = $injector.get('JSONFormatter');
      // console.log(formatter);
    });
  });

  xdescribe('Initialization' , function () {
    it('Should have the value 123456', function (){
      expect(passKey).toEqual('123456');
    });

    it('there should be the JSONFormatter factory', function () {
      expect(JSONformatter).not.toBeUndefined();
    });

    it('The Factory should have two methods', function () {
      expect(angular.isFunction(JSONformatter.stringify)).toBeTruthy();
      expect(angular.isFunction(JSONformatter.parse)).toBeTruthy();
    });
  });

  describe('Data Handling',function () {
    describe('Checks for stringify',function () {
      it('Should return a string', function () {
        expect(typeof JSONformatter.stringify(CryptoJS.AES.encrypt('Some Message', 'some Key'))).toBe(typeof '');
      });

      xit('Should return the Correct data', function () {
        expect(JSONformatter.stringify(
          CryptoJS.AES.encrypt('Some Message', 'some key')
        )).toEqual('{"ct":"0e689437404192dc6c0b563e18bc48d8","iv":"f02f265e2f98f7889aa97898943726ee","s":"910d20bab84380fc"}');
      });
    });

    describe('Checks for parse', function () {
      it('Should return an Object', function () {
        expect(JSONformatter.parse('{"ct":"0e689437404192dc6c0b563e18bc48d8","iv":"f02f265e2f98f7889aa97898943726ee","s":"910d20bab84380fc"}'))
        .toEqual(
          {
            ct: CryptoJS.enc.Hex.parse("0e689437404192dc6c0b563e18bc48d8"),
            iv: CryptoJS.enc.Hex.parse("f02f265e2f98f7889aa97898943726ee"),
            s: CryptoJS.enc.Hex.parse("910d20bab84380fc")
          }
        );
      });

      it('If the key is 123456 new key should not be generated', function () {
        expect(JSONformatter.parse({key:passKey})).toEqual({
          key: CryptoJS.enc.Hex.parse(passKey)
        });
      });
    });
  });
});

