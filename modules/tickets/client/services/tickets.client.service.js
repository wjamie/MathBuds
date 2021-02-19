// Tickets service used to communicate Tickets REST endpoints
(function () {
  'use strict';

  angular
    .module('tickets')
    .factory('TicketsService', TicketsService);

  TicketsService.$inject = ['$resource'];

  function TicketsService($resource) {
    return $resource('/api/tickets/:ticketId', {
      ticketId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
