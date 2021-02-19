(function () {
  'use strict';

  angular
    .module('tickets')
    .controller('TicketsListController', TicketsListController);

  TicketsListController.$inject = ['TicketsService'];

  function TicketsListController(TicketsService) {
    var vm = this;

    vm.tickets = TicketsService.query();
  }
}());
