import { writable } from "svelte/store";
import * as d3 from 'd3';

const data = writable([]);
const messy = writable([]);
export const selectedPolygon = writable(null);

const parseTime = d3.timeParse("%Y-%m-%d");

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

//Create Objects for Agreements in the same process
let messy_data = {
    "ideal": [
        { "Dat": "1990-01-01", "PPName": "ideal", "Stage": "Cea" },
        { "Dat": "1998-01-01", "PPName": "ideal", "Stage": "Pre" },
        { "Dat": "2006-01-01", "PPName": "ideal", "Stage": "SubPar" },
        { "Dat": "2014-01-01", "PPName": "ideal", "Stage": "SubComp" },
        { "Dat": "2022-01-01", "PPName": "ideal", "Stage": "Ren" },
        { "Dat": "2023-01-01", "PPName": "ideal", "Stage": "Ren" }]
}

async function loadData() {
    const [csvData1, csvData2, csvData3] = await Promise.all([
        d3.csv("newest_data.csv"),
        d3.csv("prog.csv"),
        d3.csv("local_v8_1.csv"),
    ]);

    let country_array = []
    let the_data = []
    csvData1.forEach(function (d) {
        const found = csvData2.find((element) => element.iso == d.iso3c);
        if (found !== undefined) {
            let index = found.c_bell;
            country_array.push(d.country_entity)
            d.Lat = +d.Lat;
            d.Long = +d.Long;
            let to_push = {
                'type': 'Feature',
                'properties': {
                    'country': d.country_entity,
                    'iso': d.iso3c,
                    'index': index,
                    'peace': d["peace process"],
                    'year': d["last year"],
                    'month': d["last month"],
                    'iconSize': [25, 25]
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [d.Long, d.Lat]
                }
            }
            the_data.push(to_push)
        }
    })
    const icon_data = {
        'type': 'FeatureCollection',
        'features': the_data
    };

    //prepare data for messy timeline
    console.log(csvData3);
    let pax = csvData3.filter((d, i) => d.Stage !== "Oth");
    pax.sort(function (a, b) {
        function getDate(d) { return parseTime(d.Dat) }
        return getDate(a) - getDate(b)
    })

    pax.forEach(function (agreement) {
        if (typeof sequence.find(x => x.key == agreement.Stage) !== 'undefined') sequence.find(x => x.key == agreement.Stage).count++
        var name = agreement["PPName"]
        if (typeof messy_data[name] === 'undefined') messy_data[name] = []
        messy_data[name].push(agreement)
    })

    data.set(icon_data);
    messy.set(messy_data);
}

loadData()

export { data, messy, loadData };