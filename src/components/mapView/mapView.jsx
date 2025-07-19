import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { fromLonLat } from "ol/proj";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ } from "ol/source";
import { Vector as VectorSource } from "ol/source";
import { LineString, Point } from "ol/geom";
import { Feature } from "ol";
import { Style, Stroke, Circle as CircleStyle, Fill } from "ol/style";
import Overlay from "ol/Overlay";

const TrailMap = ({ data, darkMode }) => {
  const mapRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: darkMode
              ? "https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat(data[0].position),
        zoom: 6,
      }),
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });
    map.addLayer(vectorLayer);

    const overlay = new Overlay({
      element: tooltipRef.current,
      offset: [10, 0],
      positioning: "bottom-left",
    });
    map.addOverlay(overlay);

    const getColor = (power) => {
      if (power < 50) return "green";
      if (power < 100) return "orange";
      return "red";
    };

    const coordinates = [];

    data.forEach((point, index) => {
      const coord = fromLonLat(point.position);
      coordinates.push(coord);

      if (index > 0) {
        const prevCoord = fromLonLat(data[index - 1].position);
        const line = new LineString([prevCoord, coord]);
        const lineFeature = new Feature({ geometry: line });

        lineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: getColor(point.power),
              width: 3,
            }),
          })
        );

        vectorSource.addFeature(lineFeature);
      }

      const pointFeature = new Feature({ geometry: new Point(coord) });

      pointFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({ color: getColor(point.power) }),
            stroke: new Stroke({ color: "#fff", width: 1 }),
          }),
        })
      );

      pointFeature.setProperties({
        power: point.power,
        consumption: point.consumption,
      });

      vectorSource.addFeature(pointFeature);
    });

    map.on("pointermove", (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const { power, consumption } = feature.getProperties();
        tooltipRef.current.innerHTML = `
          <div>
            <strong>Power:</strong> ${power?.toFixed(2)}<br/>
            <strong>Consumption:</strong> ${consumption?.toFixed(2)}
          </div>
        `;
        overlay.setPosition(evt.coordinate);
        tooltipRef.current.style.display = "block";
      } else {
        tooltipRef.current.style.display = "none";
      }
    });

    return () => {
      map.setTarget(null); // Cleanup
    };
  }, [data, darkMode]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: darkMode ? "#121212" : "#ffffff",
        position: "relative",
      }}
    >
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: "4px",
          display: "none",
          pointerEvents: "none",
          fontSize: "13px",
          zIndex: 1000,
        }}
      ></div>
    </div>
  );
};

export default TrailMap;
