(function () {
  'use strict';

  angular
    .module('tickets')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tickets', {
        abstract: true,
        url: '/tickets',
        template: '<ui-view/>'
      })
      .state('tickets.list', {
        url: '',
        templateUrl: 'modules/tickets/client/views/list-tickets.client.view.html',
        controller: 'TicketsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tickets List'
        }
      })
      .state('tickets.create', {
        url: '/create',
        templateUrl: 'modules/tickets/client/views/form-ticket.client.view.html',
        controller: 'TicketsController',
        controllerAs: 'vm',
        resolve: {
          ticketResolve: newTicket
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tickets Create'
        }
      })
      .state('tickets.edit', {
        url: '/:ticketId/edit',
        templateUrl: 'modules/tickets/client/views/form-ticket.client.view.html',
        controller: 'TicketsController',
        controllerAs: 'vm',
        resolve: {
          ticketResolve: getTicket
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ticket {{ ticketResolve.name }}'
        }
      })
      .state('tickets.view', {
        url: '/:ticketId',
        templateUrl: 'modules/tickets/client/views/view-ticket.client.view.html',
        controller: 'TicketsController',
        controllerAs: 'vm',
        resolve: {
          ticketResolve: getTicket
        },
        data: {
          pageTitle: 'Ticket {{ ticketResolve.name }}'
        }
      });
  }

  getTicket.$inject = ['$stateParams', 'TicketsService'];

  function getTicket($stateParams, TicketsService) {
    return TicketsService.get({
      ticketId: $stateParams.ticketId
    }).$promise;
  }

  newTicket.$inject = ['TicketsService'];

  function newTicket(TicketsService) {
    return new TicketsService();
  }
}());
