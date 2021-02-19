(function () {
  'use strict';

  angular
    .module('tickets')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Posts',
      state: 'tickets',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tickets', {
      title: 'List Posts',
      state: 'tickets.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'tickets', {
      title: 'Create Post',
      state: 'tickets.create',
      roles: ['user']
    });
  }
}());
