var SsdpClient = require('io.resourcepool.ssdp.client.SsdpClient');
var SsdpRequest = require('io.resourcepool.ssdp.model.SsdpRequest');
var DiscoveryListener = require('io.resourcepool.ssdp.model.DiscoveryListener');

var client;

(function(container) {
  client = SsdpClient.create();
})($.window);

function startSearch() {
  var all = SsdpRequest.discoverAll();
  client.discoverServices(all, new DiscoveryListener({
    onServiceDiscovered: function (service) {
      Ti.API.info('Found service: ' + service.getServiceType());
    },
    
    onServiceAnnouncement: function (announcement) {
      Ti.API.info('Service announced something: ' + announcement);
    },
    
    onFailed: function (exception) {
      Ti.API.error('Error: ' + exception.getMessage());
    }
  }));
}

function stopSearch() {
  client.stopDiscovery();
}
