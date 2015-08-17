'use strict';

describe('Controller: ProposedTradesCtrl', function () {

  // load the controller's module
  beforeEach(module('workspaceApp'));

  var ProposedTradesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProposedTradesCtrl = $controller('ProposedTradesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
