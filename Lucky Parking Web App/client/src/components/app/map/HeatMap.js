import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import {
  getCitationData,
  getMap,
  handleSidebar,
} from "../../../redux/actions/index";

import { heatMap, places, meters } from "./mapLayers";

const axios = require("axios");
const MapboxGeocoder = require("@mapbox/mapbox-gl-geocoder");

mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_TOKEN;

function mapDispatchToProps(dispatch) {
  return {
    getCitationData: (test) => dispatch(getCitationData(test)),
    getMap: (mapRef) => dispatch(getMap(mapRef)),
    handleSidebar: (isSidebarOpen) => dispatch(handleSidebar(isSidebarOpen)),
  };
}

const mapStateToProps = (state) => {
  return {
    citation: state.citation,
    mapRef: state.mapRef,
    isSidebarOpen: state.isSidebarOpen,
  };
};

const ConnectedMap = ({
  getCitationData,
  mapRef,
  isSidebarOpen,
  handleSidebar,
}) => {
  const [lng, setLng] = useState(-118.2);
  const [lat, setLat] = useState(34.05);
  const [zoom, setZoom] = useState(15);
  const [data, setData] = useState([]);
  const [map, setMap] = useState(null);
  const [mounted, setMounted] = useState(false);

  const mapContainer = useRef();
  const sideBar = document.getElementsByClassName("sidebar-container");
  const closeButton = document.getElementsByClassName(
    "sidebar__closeButton--close"
  );
  const closeButtonHandle = document.getElementsByClassName(
    "sidebar__closeButton"
  );


  //first mounted
  useEffect(() => {
    setMap(
      new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [lng, lat],
        zoom: zoom,
      })
    );
    fetchData();
    setMounted(true);
  }, []);

  //updates the map only when mounted or data is updated
  useEffect(() => {
    if (mounted) {
      updateMap();
    }
  }, [mounted, data]);

  useEffect(() => {
    if (mounted) {
      map.on("move", () => {
        setLng((preLng) => {
          if (
            Math.abs(
              Math.abs(preLng) - Math.abs(map.getCenter().lng.toFixed(4))
            ) >= 0.0001
          ) {
            return map.getCenter().lng.toFixed(4);
          } else {
            return preLng;
          }
        });

        setLat((preLat) => {
          if (
            Math.abs(
              Math.abs(preLat) - Math.abs(map.getCenter().lat.toFixed(4))
            ) >= 0.0001
          ) {
            return map.getCenter().lat.toFixed(4);
          } else {
            return preLat;
          }
        });

        setZoom((preZoom) => {
          if (
            Math.abs(Math.abs(preZoom) - Math.abs(map.getZoom().toFixed(2))) >=
            1
          ) {
            return map.getZoom().toFixed(2);
          } else {
            return preZoom;
          }
        });
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      });

      mapRef.current.appendChild(geocoder.onAdd(map));
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      //  fetchData();
      if (zoom < 13) {
        // map.removeLayer("meters");
        // map.removeSource("meters");
        handleSidebar(true);
        sideBar[0].classList.remove("--container-open");
        closeButton[0].classList.add("--closeButton-close");
      }
    }
  }, [lat, lng]);

  function fetchData() {
    axios
      .get("/api/citation", {
        params: {
          longitude: lng,
          latitude: lat,
          zoom: zoom,
        },
      })
      .then((data) => {
        setData(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function dataToGeoJson(data){
    let dataSources = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    };

    let dataFeatures = [];
    data.map((data) =>
      dataFeatures.push({
        type: "Feature",
        properties: {
          description: data,
          icon: "bicycle",
        },
        geometry: {
          type: "Point",
          coordinates: [JSON.parse(data.longitude), JSON.parse(data.latitude)],
        },
      })
    );

    dataSources.data.features = dataFeatures;
    return dataSources;
  }

  function updateMap() {
    let dataSources = dataToGeoJson(data);

    map.once("render", () => {
      if (!map.getSource("places") && !map.getSource("meters")) {
        map.addSource("places", dataSources);
        map.addSource("heat", dataSources);
        map.addSource("meters", {
          type: "vector",
          url: "mapbox://breeze094.bqlt7yn4",
        });
        map.addLayer(heatMap);
        map.addLayer(meters);
        map.addLayer(places);
      } else {
        map.removeLayer("places");
        map.removeSource("places");
        map.removeLayer("heat");
        map.removeSource("heat");

        map.addSource("places", dataSources);
        map.addLayer(places);
        map.addSource("heat", dataSources);
        map.addLayer(heatMap);
      }

      map.on("click", "places", (e) => {
        let description = e.features[0].properties.description;
        handleSidebar(false);
        closeButtonHandle[0].classList.add("--show");
        sideBar[0].classList.add("--container-open");
        closeButton[0].classList.remove("--closeButton-close");
        getCitationData(description);
      });
    });
  }

  return (
    <div className="map-container">
      <div ref={mapContainer} className="mapContainer" />
    </div>
  );
};

const Map = connect(mapStateToProps, mapDispatchToProps)(ConnectedMap);

export default Map;
