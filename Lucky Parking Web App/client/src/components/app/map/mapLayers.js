//// Heat Map Layer////
export const heatMap = {
  id: "heat",
  type: "heatmap",
  source: "heat",
  maxzoom: 13,
  paint: {
    // increase weight as diameter breast height increases
    "heatmap-weight": {
      property: "dbh",
      type: "exponential",
      stops: [
        [1, 0],
        [62, 1],
      ],
    },
    // increase intensity as zoom level increases
    "heatmap-intensity": {
      stops: [
        [11, 1],
        [13, 3],
      ],
    },
    // assign color values be applied to points depending on their density
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(236,222,239,0)",
      0.2,
      "rgb(208,209,230)",
      0.4,
      "rgb(166,189,219)",
      0.6,
      "rgb(103,169,207)",
      0.8,
      "rgb(28,144,153)",
    ],
    // increase radius as zoom increases
    "heatmap-radius": {
      stops: [
        [11, 15],
        [13, 20],
      ],
    },
    // decrease opacity to transition into the circle layer
    "heatmap-opacity": {
      default: 1,
      stops: [
        [13, 1],
        [14, 0],
      ],
    },
  },
};

////Places Layer////
export const places = {
  id: "places",
  type: "symbol",
  source: "places",
  layout: {
    "icon-image": "{icon}-15",
    "icon-allow-overlap": true,
  },
};

////Meter Layer////
export const meters = {
  id: "meters",
  source: "meters",
  type: "line",
  "source-layer": "meter_lines-1l60am",
  paint: {
    "line-color": "#e50cff",
    "line-width": 2,
  },
};
