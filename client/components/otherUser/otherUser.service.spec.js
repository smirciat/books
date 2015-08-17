'use strict';

describe('Service: otherUser', function () {

  // load the service's module
  beforeEach(module('workspaceApp'));

  // instantiate service
  var otherUser;
  beforeEach(inject(function (_otherUser_) {
    otherUser = _otherUser_;
  }));

  it('should do something', function () {
    expect(!!otherUser).toBe(true);
  });

});
