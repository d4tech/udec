'use strict';

describe('Unit: FileOps', function(){
  var FileOps,$httpBackend;

  beforeEach( function(){
    module('udecApp');

    inject(function($injector) {
      FileOps = $injector.get('FileOps');

      $httpBackend = $injector.get('$httpBackend');
      /*getFileRequestHandler = $httpBackend.when('GET','/rest/home')
                                    .respond(
                                        {
                                          "file_name": "VL3oM4scmSyd8sieaLmMvg==",
                                          "modified_date": "2014-09-24 10:43:03.375081",
                                          "blob_key": "K2_n8hNArB1C1ujXaXVQsw=="
                                        });*/
    });
  });

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

  describe('Initialization', function (){
    it('There should be a FileOps factory', function () {
      expect(FileOps).not.toBeUndefined();
    });

    it('The factory should have two methods', function () {
      expect(angular.isFunction(FileOps.getFileList)).toBeTruthy();
      expect(angular.isFunction(FileOps.getFile)).toBeTruthy();
    });
  });
  
  describe('should send requests to server', function () {
    it('Should request /rest/home', function () {
      $httpBackend.expectGET('/rest/home');
      expect(FileOps.getFileList()).not.toBeUndefined();
    });
  
  });

});
