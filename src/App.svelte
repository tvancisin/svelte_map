<script>
  import { data, messy, loadData } from "./lib/stores";
  import Map from "../Map.svelte";
  import Visualization from "../Visualization.svelte";
  import * as d3 from "d3";

  $: renderedData = $data;
  $: renderedMessyData = $messy;
  export let mapboxToken =
    "pk.eyJ1Ijoic2FzaGFnYXJpYmFsZHkiLCJhIjoiY2xyajRlczBlMDhqMTJpcXF3dHJhdTVsNyJ9.P_6mX_qbcbxLDS1o_SxpFg";
  let mapRef;
  let selectedProperties;
  let individual_info;

  function handlePolygonClick(event) {
    selectedProperties = event.detail.ADMIN;
    d3.select(".visualization").style("right", "0px");
  }

  function handleClose() {
    d3.select(".visualization").style("right", "-500px")
    mapRef.flyToInitialPosition();
  }

  $: if (selectedProperties) {
        let the_info = renderedData.features;
        individual_info = the_info.find(function (d) {
            return d.properties.country == selectedProperties;
        });
  }

</script>

<main>
  <h1>Conflict and Peace Process Map</h1>
  <Map bind:this={mapRef} {mapboxToken} on:polygonClick={handlePolygonClick} />
  <Visualization {individual_info} {renderedMessyData} on:close={handleClose} />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  h1 {
    position: absolute;
    width: 100%;
    margin: 0px;
    text-align: center;
    color: white;
    z-index: 999;
    top: 0px;
    background-color: black;
    font-family: "Montserrat";
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5em;
    }
  }
</style>
