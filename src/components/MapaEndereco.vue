<template>
  <div class="map-card">
    <div :id="mapId" style="height: 220px; width: 100%"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapaEndereco",
  props: {
    query: { type: String, required: true },
    mapId: { type: String, default: "map" },
  },
  data() {
    return { map: null, marker: null };
  },
  watch: {
    query(newQ) {
      if (!newQ) return;
      this.geocodeAndShow(newQ);
    },
  },
  mounted() {
    this.map = L.map(this.mapId, { scrollWheelZoom: false }).setView(
      [-23.55, -46.63],
      13
    );
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      attribution: "",
    }).addTo(this.map);
    if (this.query) this.geocodeAndShow(this.query);
  },
  methods: {
    async geocodeAndShow(q) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}`
        );
        const data = await res.json();
        if (!data || !data.length) return;
        const lat = parseFloat(data[0].lat),
          lon = parseFloat(data[0].lon);
        if (this.marker) this.marker.remove();
        this.marker = L.marker([lat, lon]).addTo(this.map);
        this.map.setView([lat, lon], 16);
      } catch (e) {
        console.log("geo fail", e);
      }
    },
  },
};
</script>

<style scoped>
.map-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>
