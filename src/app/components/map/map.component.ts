import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {

  @Output() coordinatesChanged = new EventEmitter<{ latitude: number | null, longitude: number | null }>();
  @Input() latitude: number | null = null;
  @Input() longitude: number | null = null;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  ngAfterViewInit(): void {

    if(this.latitude && this.longitude){
      this.initMap();
      // navigator.geolocation.getCurrentPosition((position) => {
      //   const userLat = position.coords.latitude;
      //   const userLng = position.coords.longitude;

      //   L.Routing.control({
      //     waypoints: [
      //       L.latLng(userLat, userLng),
      //       L.latLng(this.latitude!, this.longitude!)
      //     ],
      //     routeWhileDragging: true
      //   }).addTo(this.map!);
      // });
      
    }
    this.map = L.map('map').setView([0, 0], 2); // Vue initiale centrée sur le monde

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    const provider = new OpenStreetMapProvider();
    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      keepResult: true,
    });
    this.map.addControl(searchControl);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.latitude = lat;
      this.longitude = lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map!);
      }

      console.log('Localisation choisie:', lat, lng);
    });

    this.map.on('geosearch/showlocation', (result: any) => {
      const { x, y } = result.location;
      this.latitude = y;
      this.longitude = x;
      this.coordinatesChanged.emit({latitude: this.latitude, longitude: this.longitude})
      if (this.marker) {
        this.marker.setLatLng(result.latlng);
      } else {
        this.marker = L.marker(result.latlng).addTo(this.map!);
      }
    });
  }
  getCoordinates(): { latitude: number | null; longitude: number | null } {
    return { latitude: this.latitude, longitude: this.longitude };
  }

  setCoordinates(lat: number, lng: number): void {
    this.latitude = lat;
    this.longitude = lng;
    if (this.map && this.marker) {
      this.marker.setLatLng([lat, lng]);
      this.map.setView([lat, lng], 13); // Zoom sur la localisation choisie
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([this.latitude!, this.longitude!], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.latitude!, this.longitude!]).addTo(this.map);
  }
}
