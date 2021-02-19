(function () {
  'use strict';

  // Tickets controller
  angular
    .module('tickets')
    .controller('TicketsController', TicketsController);

  TicketsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'ticketResolve'];

  function TicketsController ($scope, $state, $window, Authentication, ticket) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ticket = ticket;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ticket
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.ticket.$remove($state.go('tickets.list'));
      }
    }

    // Save Ticket
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ticketForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ticket._id) {
        vm.ticket.$update(successCallback, errorCallback);
      } else {
        vm.ticket.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tickets.view', {
          ticketId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
