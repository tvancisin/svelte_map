<script>
  import { onMount } from "svelte";
  import Map from "../Map.svelte";
  import Visualization from "../Visualization.svelte";
  import { writable } from "svelte/store";
  import { data, messy_data, loadData } from "./lib/stores";
  import { get } from "svelte/store";

  export let mapboxToken =
    "pk.eyJ1Ijoic2FzaGFnYXJpYmFsZHkiLCJhIjoiY2xyajRlczBlMDhqMTJpcXF3dHJhdTVsNyJ9.P_6mX_qbcbxLDS1o_SxpFg";
  let mapRef;
  const showVisualization = writable(false);
  let selectedProperties = "Ukraine";

  function handlePolygonClick(event) {
    selectedProperties = event.detail.ADMIN;
    showVisualization.set(true);
  }

  function handleClose() {
    showVisualization.set(false);
    mapRef.flyToInitialPosition()
  }

  let my_data;

  onMount(async () => {
    await loadData();
    my_data = get(data);
  });
</script>

<main>
  <Map bind:this={mapRef} {mapboxToken} on:polygonClick={handlePolygonClick} />
  {#if $showVisualization}
    <Visualization
      {selectedProperties}
      {my_data}
      on:close={handleClose}
    />
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>
