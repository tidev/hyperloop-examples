import SsdpClient from 'io.resourcepool.ssdp.client.SsdpClient';
import SsdpRequest from 'io.resourcepool.ssdp.model.SsdpRequest';
import DiscoveryListener from 'io.resourcepool.ssdp.model.DiscoveryListener';

let client;

(function(container) {
  client = SsdpClient.create();
})($.window);

function startSearch() {
  const all = SsdpRequest.discoverAll();

  client.discoverServices(all, new DiscoveryListener({
    onServiceDiscovered: (service) => {
      Ti.API.info('Found service: ' + service.getServiceType());
    },
    
    onServiceAnnouncement: (announcement) => {
      Ti.API.info('Service announced something: ' + announcement);
    },
    
    onFailed: (exception) => {
      Ti.API.error('Error: ' + exception.getMessage());
    }
  }));
}

function stopSearch() {
  client.stopDiscovery();
}
