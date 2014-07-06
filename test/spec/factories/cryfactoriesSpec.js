'use strict';

describe('Unit test of factories', function () {
  var passKey, 
      $rootscope,
      $scope,
      controller,
      formatter;
  beforeEach(function (){
    module('udecApp');

    inject(function($injector) {
      passKey = $injector.get('passKey');
      formatter = $injector.get('formatHandler');
    });
  });

  describe( 'Passkey' ,function () {

    //it('should
    it('Should have the value 123456', function (){
      expect(passKey).toEqual('123456');
    });
  });

  describe("Initialization" , function () {
    it('there should be the format Handler', function () {
      expect(formatter).not.toBeUndefined();
    });
  });
});

