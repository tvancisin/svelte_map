<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import * as d3 from "d3";

    export let individual_info;
    export let renderedMessyData;
    const parseTime = d3.timeParse("%Y-%m-%d");

    const dispatch = createEventDispatcher();

    let messy_svg, chart;
    let gx;
    let width = 1000;
    let height = 500;
    // export let marginTop = 20;
    // export let marginRight = 20;
    // export let marginBottom = 30;
    // export let marginLeft = 40;
    let details_width, details_height, svg_height;
    let individual_peace_process_name = "Syrian Local Agreements";

    // initial data for messy timeline
    let sequence = [
        {
            key: "Cea",
            name: ["Ceasefire", "related"],
            color: d3.rgb(241, 80, 31, 0.8),
            position: 5,
        },
        {
            key: "Pre",
            name: ["Pre-negotiation", "process"],
            color: d3.rgb(251, 173, 68, 0.8),
            position: 4,
        },
        {
            key: "SubPar",
            name: ["Partial", "Framework-substantive"],
            color: d3.rgb(252, 202, 70, 0.8),
            position: 3,
        },
        {
            key: "SubComp",
            name: ["Comprehensive", "Framework-substantive"],
            color: d3.rgb(172, 176, 140, 0.8),
            position: 2,
        },
        {
            key: "Imp",
            name: ["Implementation", "Renegotiation/Renewal"],
            color: d3.rgb(74, 144, 226, 0.8),
            position: 1,
        },
        { key: "Ren", name: [], color: d3.rgb(74, 144, 226, 8), position: 1 },
    ];

    //scales & axes for messy timeline
    let scaleColor = d3
        .scaleLinear()
        .domain([-350, 0, 350])
        .range([d3.rgb("#0075FF"), d3.rgb("#555555"), d3.rgb("#FF3B00")]);

    $: messyScaleY = d3
        .scaleLinear()
        .domain(d3.extent(sequence, (d) => d.position))
        .range([20, svg_height - 20]);

    $: messyScaleX = d3.scaleTime().range([5, details_width - 15]);

    $: d3.select(gx).call(
        d3.axisBottom(messyScaleX).tickFormat(d3.timeFormat("%Y")).ticks(8),
    );

    function updateVisualization(properties) {}

    function closeVisualization() {
        dispatch("close");
    }

    onMount(() => {});

    let peace_process_data = [];
    let new_ppdata = [];

    $: if (individual_info) {
        // console.log(renderedMessyData);
        d3.select("#peace").html(individual_info.properties.peace);
        d3.select("#year").html(individual_info.properties.year);
        d3.select("#month").html(individual_info.properties.month);

        //messy visualization data
        peace_process_data = {
            [individual_peace_process_name]:
                renderedMessyData[individual_peace_process_name],
        };

        new_ppdata = Object.entries(peace_process_data);
        new_ppdata = new_ppdata[0][1];

        // console.log(peace_process_data);
        // peace_process_data = Object.entries(peace_process_data);
        // peace_process_data = peace_process_data[0][1]

        let year_array = renderedMessyData[individual_peace_process_name];
        let start_year = year_array[0].Dat;
        let end_year = year_array[year_array.length - 1].Dat;

        messyScaleX = messyScaleX.domain([
            parseTime(start_year),
            parseTime(end_year),
        ]);
    }

    let segment = function (d, i, scale) {
        if (i < peace_process_data[d.PPName].length - 1) {
            var start = {
                x: Math.round(scale(parseTime(d.Dat))),
                y: messyScaleY(sequence.find((x) => x.key == d.Stage).position),
            };
            var stop = {
                x: Math.round(
                    scale(parseTime(peace_process_data[d.PPName][i + 1].Dat)),
                ),
                y: messyScaleY(
                    sequence.find(
                        (x) =>
                            x.key == peace_process_data[d.PPName][i + 1].Stage,
                    ).position,
                ),
            };
            var distance = (stop.x - start.x) / 1.5;
            return (
                "M " +
                start.x +
                " " +
                start.y +
                " C " +
                (start.x + distance) +
                " " +
                start.y +
                ", " +
                (stop.x - distance) +
                " " +
                stop.y +
                ", " +
                stop.x +
                " " +
                stop.y
            );
        }
    };

    function logItem(item) {
        console.log(item);
        return item;
    }
</script>

<div
    class="visualization"
    bind:clientWidth={details_width}
    bind:clientHeight={details_height}
>
    <button class="btn close" on:click={closeVisualization}
        ><i class="fa fa-close"></i></button
    >

    <div id="peace_title_div">
        <h3>Peace Process</h3>
    </div>

    <div id="peace_content">
        <pre id="peace"></pre>
        <br />
        <pre id="year"></pre>
        <br />
        <pre id="month"></pre>
    </div>

    <div id="peace_title_div">
        <h3>Timeline</h3>
    </div>

    <div id="chart" bind:clientHeight={svg_height}>
        <svg width={details_width} height={svg_height}>
            <!-- <g
                bind:this={gx}
                transform="translate(0,{svg_height - marginBottom})"
            /> -->
            <g>
                {#each sequence as { position }}
                    <line
                        stroke="white"
                        stroke-width="0.5"
                        stroke-dasharray="5 5"
                        opacity="0.5"
                        x1="10"
                        x2={details_width}
                        y1={messyScaleY(position)}
                        y2={messyScaleY(position)}
                    ></line>
                {/each}
            </g>
            <g
                class="processes"
                clip-path="url(#ellipse-clip)"
                pointer-events="all"
                transform="translate(5,0)"
            >
                <g>
                    {#each new_ppdata as d, i}
                        <path
                            d={segment(d, i, messyScaleX)}
                            stroke="gray"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-opacity="1"
                            fill-opacity="0"
                        ></path>
                    {/each}
                </g>
            </g>
        </svg>
    </div>
</div>

<style>
    .visualization {
        color: white;
        position: fixed;
        right: -100%;
        bottom: 0px;
        width: 500px;
        height: calc(100% - 45px);
        transition: right 0.3s ease;
        background: black;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
        border-radius: 3px;
        overflow: hidden;
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
            height: 50%;
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

    h3 {
        color: white;
        border-radius: 3px;
        margin: auto;
        font-size: 1.2em;
        padding: 5px;
    }

    @media only screen and (max-width: 1450px) {
        h3 {
            font-size: 1.1em;
        }
    }

    @media only screen and (max-width: 1024px) {
        h3 {
            font-size: 1em;
        }
    }

    @media only screen and (max-width: 768px) {
        h3 {
            font-size: 0.9em;
        }
    }

    #chart {
        background-color: #171d26;
        height: 45%;
        margin: 5px;
        border-radius: 2px;
    }

    #peace_content {
        height: 45%;
        position: relative;
        overflow-y: auto;
        font-size: 14px;
        background-color: #171d26;
        margin: 5px;
        border-radius: 2px;
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

    .btn {
        border: none;
        box-shadow: none;
        border-radius: 2px;
        font-size: 1.1em;
        font-family: "Montserrat";
        color: black;
        padding: 0.2em 1em;
        cursor: pointer;
        background: #fdd92f;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
    }

    @media only screen and (max-width: 1450px) {
        .btn {
            font-size: 1em;
        }
    }

    @media only screen and (max-width: 1024px) {
        .btn {
            font-size: 0.9em;
        }
    }

    pre {
        margin-top: 2px;
        margin-bottom: 2px;
        font-family: "Montserrat";
        direction: ltr;
        text-align: left;
        padding-left: 15px;
        padding-right: 15px;
        font-size: 0.9em;
        white-space: pre-wrap;
    }

    @media only screen and (max-width: 1450px) {
        pre {
            font-size: 0.75em;
        }
    }

    @media only screen and (max-width: 1024px) {
        pre {
            font-size: 0.63em;
        }
    }

    :global(a) {
        color: yellow;
        cursor: pointer;
    }
</style>
