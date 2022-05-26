/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9821428571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET  https://api.kraken.com/0/public/AssetPairs?pair=XX..."], "isController": false}, {"data": [1.0, 500, 1500, "GET  https://api.kraken.com/0/public/Ticker?pair=XBTUSD"], "isController": false}, {"data": [1.0, 500, 1500, "Tc_03_Get information about the assets that are available for deposit, withdrawal, trading and staking."], "isController": true}, {"data": [1.0, 500, 1500, "GET  https://api.kraken.com/0/public/Trades?pair=XBTUSD"], "isController": false}, {"data": [1.0, 500, 1500, "Tc_06_Get OHLC Data"], "isController": true}, {"data": [1.0, 500, 1500, "Tc_05_Get Ticker Information"], "isController": true}, {"data": [1.0, 500, 1500, "Tc_07_Get Order Book"], "isController": true}, {"data": [0.875, 500, 1500, "Tc_01_Get the server\\'s time"], "isController": true}, {"data": [1.0, 500, 1500, "Tc_02_Get the current system status"], "isController": true}, {"data": [0.875, 500, 1500, "GET  https://api.kraken.com/0/public/Time"], "isController": false}, {"data": [1.0, 500, 1500, "Tc_04_Get tradable asset pair"], "isController": true}, {"data": [1.0, 500, 1500, "GET  https://api.kraken.com/0/public/OHLC?pair=XBTUSD"], "isController": false}, {"data": [1.0, 500, 1500, "GET  https://api.kraken.com/0/public/Assets?asset=XBT,E..."], "isController": false}, {"data": [1.0, 500, 1500, "GET  https://api.kraken.com/0/public/SystemStatus"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28, 0, 0.0, 161.2857142857143, 30, 599, 151.0, 220.5, 430.6999999999989, 599.0, 0.12391573729863693, 2.0998643634382193, 0.06693662595149584], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET  https://api.kraken.com/0/public/AssetPairs?pair=XX...", 4, 0, 0.0, 158.5, 132, 211, 145.5, 211.0, 211.0, 211.0, 0.01780341469493849, 0.030269282210828037, 0.010257826826185264], "isController": false}, {"data": ["GET  https://api.kraken.com/0/public/Ticker?pair=XBTUSD", 4, 0, 0.0, 51.25, 30, 101, 37.0, 101.0, 101.0, 101.0, 0.017817451302678408, 0.014998674827059364, 0.010004916502968832], "isController": false}, {"data": ["Tc_03_Get information about the assets that are available for deposit, withdrawal, trading and staking.", 4, 0, 0.0, 150.75, 131, 181, 145.5, 181.0, 181.0, 181.0, 0.017800958581619623, 0.012903087409381996, 0.010308562928613705], "isController": true}, {"data": ["GET  https://api.kraken.com/0/public/Trades?pair=XBTUSD", 4, 0, 0.0, 118.0, 107, 130, 117.5, 130.0, 130.0, 130.0, 0.01781316660209394, 1.031876383303719, 0.010002510543167982], "isController": false}, {"data": ["Tc_06_Get OHLC Data", 4, 0, 0.0, 177.25, 163, 198, 174.0, 198.0, 198.0, 198.0, 0.017809756184437836, 0.9978855088692585, 0.009965810833674687], "isController": true}, {"data": ["Tc_05_Get Ticker Information", 4, 0, 0.0, 51.25, 30, 101, 37.0, 101.0, 101.0, 101.0, 0.01781753066842466, 0.014998741636896544, 0.01000496106869549], "isController": true}, {"data": ["Tc_07_Get Order Book", 4, 0, 0.0, 118.0, 107, 130, 117.5, 130.0, 130.0, 130.0, 0.017813087275221105, 1.0318717880777006, 0.010002465999269664], "isController": true}, {"data": ["Tc_01_Get the server\\'s time", 4, 0, 0.0, 315.0, 216, 599, 222.5, 599.0, 599.0, 599.0, 0.01776104292844076, 0.014795087517539031, 0.0068858730884677555], "isController": true}, {"data": ["Tc_02_Get the current system status", 4, 0, 0.0, 158.25, 138, 181, 157.0, 181.0, 181.0, 181.0, 0.01780040406917237, 0.010030110496008259, 0.00989104483921785], "isController": true}, {"data": ["GET  https://api.kraken.com/0/public/Time", 4, 0, 0.0, 315.0, 216, 599, 222.5, 599.0, 599.0, 599.0, 0.017764829191167324, 0.01479824150397044, 0.00688734100477874], "isController": false}, {"data": ["Tc_04_Get tradable asset pair", 4, 0, 0.0, 158.5, 132, 211, 145.5, 211.0, 211.0, 211.0, 0.017803493935684877, 0.030269416935573605, 0.010257872482474685], "isController": true}, {"data": ["GET  https://api.kraken.com/0/public/OHLC?pair=XBTUSD", 4, 0, 0.0, 177.25, 163, 198, 174.0, 198.0, 198.0, 198.0, 0.017809756184437836, 0.9978855088692585, 0.009965810833674687], "isController": false}, {"data": ["GET  https://api.kraken.com/0/public/Assets?asset=XBT,E...", 4, 0, 0.0, 150.75, 131, 181, 145.5, 181.0, 181.0, 181.0, 0.017800958581619623, 0.012903087409381996, 0.010308562928613705], "isController": false}, {"data": ["GET  https://api.kraken.com/0/public/SystemStatus", 4, 0, 0.0, 158.25, 138, 181, 157.0, 181.0, 181.0, 181.0, 0.01780040406917237, 0.010030110496008259, 0.00989104483921785], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
