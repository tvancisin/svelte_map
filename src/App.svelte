<script>
  import { data, messy, loadData } from "./lib/stores";
  import Map from "./Map.svelte";
  import Visualization from "./Visualization.svelte";
  import * as d3 from "d3";

  let width, height;

  $: renderedData = $data;
  $: renderedMessyData = $messy;

  let mapRef;
  let selectedProperties;
  let individual_info;

  function handlePolygonClick(event) {
    selectedProperties = event.detail.ADMIN;
    d3.select(".visualization").style("right", "0px");
  }

  function handleClose() {
    d3.select(".visualization").style("right", "-100%");
    mapRef.flyToInitialPosition();
  }

  $: if (selectedProperties) {
    let the_info = renderedData.features;
    individual_info = the_info.find(function (d) {
      return d.properties.country == selectedProperties;
    });
  }
</script>

<main bind:clientWidth={width} bind:clientHeight={height}>
  <h1>Conflict and Peace Process Map</h1>
  <Map bind:this={mapRef} on:polygonClick={handlePolygonClick} />
  <Visualization {individual_info} {renderedMessyData} on:close={handleClose} />
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    font-family: "Montserrat";
  }
  h1 {
    position: absolute;
    top: 0px;
    font-size: 2em;
    width: 100%;
    margin: 0px;
    text-align: center;
    color: white;
    z-index: 999;
    background-color: black;
  }

  @media only screen and (max-width: 1450px) {
    h1 {
      font-size: 1.8em;
    }
  }

  @media only screen and (max-width: 1024px) {
    h1 {
      font-size: 1.6em;
    }
  }

  @media only screen and (max-width: 768px) {
    h1 {
      font-size: 1.4em;
    }
  }
</style>
