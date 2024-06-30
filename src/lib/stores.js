import { writable } from "svelte/store";
import * as d3 from 'd3';

const data = writable([]);
const messy_data = writable([]);
export const selectedPolygon = writable(null);


async function loadData() {
    const [csvData1, csvData2, csvData3] = await Promise.all([
        d3.csv("../public/newest_data.csv"),
        d3.csv("../public/prog.csv"),
        d3.csv("../public/local_v8_1.csv"),
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

      data.set(icon_data);
      messy_data.set(csvData3);
}

export { data, messy_data, loadData };