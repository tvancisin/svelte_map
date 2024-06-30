<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { createEventDispatcher } from "svelte";

    export let selectedProperties;
    export let my_data;
    const dispatch = createEventDispatcher();

    let svg, chart;
    let width = 1000;
    let height = 500;
    let details_width, details_height, svg_height;

    const the_data = [
        { a: 155, b: 384, r: 20, fill: "#0000FF" },
        { a: 340, b: 238, r: 52, fill: "#FF0AAE" },
        { a: 531, b: 151, r: 20, fill: "#00E1FF" },
        { a: 482, b: 307, r: 147, fill: "#7300FF" },
        { a: 781, b: 91, r: 61, fill: "#0FFB33" },
        { a: 668, b: 229, r: 64, fill: "#D400FF" },
    ];

    $: xScale = d3.scaleLinear().domain([0, 1000]).range([0, details_width]);
    $: yScale = d3.scaleLinear().domain([0, 500]).range([svg_height, 0]);

    function updateVisualization(properties) {
        // chart.text(selectedProperties);
        console.log(my_data, properties);

        let the_info = my_data.features;
        let individual_info = the_info.find(function (d) {
            return d.properties.country == selectedProperties;
        });

        console.log(individual_info);

        if (individual_info !== undefined) {
            console.log("here");
            d3.select("#peace").html(individual_info.properties.peace);
            d3.select("#year").html(individual_info.properties.year);
            d3.select("#month").html(individual_info.properties.month);
        }
    }

    function closeVisualization() {
        dispatch("close");
    }

    onMount(() => {
        //     // svg = d3
        //     //     .select("#chart")
        //     //     .append("svg")
        //     //     .attr("width", 500)
        //     //     .attr("height", 300);
        //     // chart = svg
        //     //     .append("text")
        //     //     .attr("x", 250)
        //     //     .attr("y", 150)
        //     //     .attr("text-anchor", "middle")
        //     //     .style("font-size", "24px")
        //     //     .style("fill", "steelblue")
        //     //     .text(selectedProperties || "No data");
        updateVisualization(selectedProperties);
    });

    $: if (selectedProperties) {
        // if (chart) {
        updateVisualization(selectedProperties);
        // }
    }
</script>

<div
    class="visualization"
    bind:clientWidth={details_width}
    bind:clientHeight={details_height}
>
    <button class="close" on:click={closeVisualization}><i class="fa fa-close"></i></button>

    <div id="peace_title_div">
        <h2>Peace Process</h2>
    </div>

    <div id="peace_content">
        <pre id="peace"></pre>
        <br />
        <pre id="year"></pre>
        <br />
        <pre id="month"></pre>
    </div>

    <div id="chart" bind:clientHeight={svg_height}>
        <svg width={details_width} height={svg_height}>
            {#each the_data as { a, b, r, fill }}
                <circle cx={xScale(a)} cy={yScale(b)} {r} {fill} />
            {/each}
        </svg>
    </div>
</div>

<style>
    .visualization {
        color: white;
        position: fixed;
        right: 0;
        bottom: 0px;
        width: 500px;
        height: 90%;
        background: black;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
        border-radius: 3px;
        overflow-y: hidden;
        z-index: 5;
        font-family: "Montserrat";
    }

    @media (max-width: 1500px) {
        .visualization {
            width: 450px;
        }
    }

    @media (max-width: 1200px) {
        .visualization {
            width: 400px;
        }
    }

    @media (max-width: 768px) {
        .visualization {
            width: 100%;
            height: 40%;
            bottom: 0px;
            font-size: 0.8em;
        }
    }

    #peace_title_div {
        text-align: center;
        position: relative;
        border-radius: 5px;
    }

    .close {
        position: absolute;
        z-index: 5;
        top: 4px;
        left: 4px;
        background: #fdd900;
        color: black;
        border: none;
        padding: 2px 12px;
        border-radius: 2px;
        font-size: 20px;
        cursor: pointer;
        font-family: "Montserrat";
    }

    h2 {
        color: white;
        border-radius: 3px;
        margin: auto;
        /* background-color: #091f40; */
        font-size: 22px;
        padding: 5px;
    }

    #chart {
        background-color: black;
        height: 45%;
    }

    #peace_content {
        height: 45%;
        position: relative;
        overflow-y: auto;
        font-size: 14px;
        background-color: #171d26;
    }

    /* width */
    #peace_content::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    #peace_content::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    /* Handle */

    #peace_content::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */
    #peace_content::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    button {
        background: #fdd900;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-size: 14px;
        font-family: "Montserrat";
    }

    pre {
        margin-top: 2px;
        margin-bottom: 2px;
        font-size: 14px;
        direction: ltr;
        padding-left: 15px;
        padding-right: 15px;
        overflow-x: visible;
        white-space: pre-wrap;
        font-family: "Montserrat";
    }

    :global(a) {
        color: yellow;
        cursor: pointer;
    }
</style>
