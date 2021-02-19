'use strict';

describe('Tickets E2E Tests:', function () {
  describe('Test Tickets page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tickets');
      expect(element.all(by.repeater('ticket in tickets')).count()).toEqual(0);
    });
  });
});
