// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

    var DataOnDetailReport = function (ExpSetup, timeUnits, tempUnits, weightUnits, humidityUnits, pressureUnits, volumeUnits, gasUnits, angleUnit) {

        let exp_setup = "", env_setup = "", exp_result = "", operator = "", events = "";

        var rows = '', brandfileName, regimefileName, expresultfileName;

		function loadJson(fileName, channel, level, channelNo, divID, SUBRUN_INDEX, PIECE_INDEX) {

            TcHmi.Symbol.readEx2(fileName, function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    // Handle result value... 
                    var channelJSON = JSON.parse(data.value);
                    var parameterCalls = [];
                    level = level + 1;

                    channelJSON.parameters.forEach(parameter => {

                        var par = {};
                        par.name = parameter.name;
                        par.value = parameter.value;
                        channel.parameters.push(par);

                        // 1st level inside experiment Result
                        if (parameter.parameterName === 'ExperimentResultSubruns' && level === 1) {
                            var call = {};

                            call.fileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${channelNo}]::stExperimentResultChannel::aExperimentResultSubruns[FIRST_INDEX]::wsData%/s%`;
                            call.resultDivID = "#channel" + channelNo;
                            call.title = 'Experiment Result Subrun';
                            call.parameterValue = 'ExperimentResultSubrun_' + level;
                            call.firstLoop = 5;
                            call.secondLoop = 1;
                            call.thirdLoop = 1;
                            parameterCalls.push(call);
                        }
                        else if (parameter.parameterName === 'ExperimentResultPuffs' && level === 1) {
                            var call = {};

                            call.fileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${channelNo}]::stExperimentResultChannel::aExperimentResultPuffs[FIRST_INDEX]::wsData%/s%`;
                            call.resultDivID = "#channel" + channelNo;
                            call.title = 'Experiment Result Puff';
                            call.parameterValue = 'ExperimentResultPuff_' + level;
                            call.firstLoop = 5;
                            call.secondLoop = 1;
                            call.thirdLoop = 1;
                            parameterCalls.push(call);

                        } else if (parameter.parameterName === 'GasAnalysisResults' && level === 1) {
                            var call = {};

                            call.fileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${channelNo}]::stExperimentResultChannel::aGasAnalysisResults[FIRST_INDEX]::wsData%/s%`;
                            call.resultDivID = "#channel" + channelNo;
                            call.title = 'Gas Analysis Result';
                            call.parameterValue = 'GasAnalysisResult_' + level;
                            call.firstLoop = 2;
                            call.secondLoop = 1;
                            call.thirdLoop = 1;
                            parameterCalls.push(call);
                        }
                            // inside Subruns
                        else if (parameter.parameterName === 'ExperimentResultPieces' && level === 2) {
                            var call = {};

                            call.fileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${channelNo}]::stExperimentResultChannel::aExperimentResultSubruns[${SUBRUN_INDEX}]::aExperimentResultPieces[SECOND_INDEX]::wsData%/s%`;
                            call.resultDivID = "#channel" + channelNo;
                            call.title = 'Experiment Result Product';
                            call.parameterValue = 'ExperimentResultPiece_' + level;
                            call.firstLoop = 1;
                            call.secondLoop = 5;
                            call.thirdLoop = 1;
                            parameterCalls.push(call);
                        }
                        else if (parameter.parameterName === 'ExperimentResultPuffs' && level === 3) {
                            var call = {};

                            call.fileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${channelNo}]::stExperimentResultChannel::aExperimentResultSubruns[${SUBRUN_INDEX}]::aExperimentResultPieces[${PIECE_INDEX}]::aExperimentResultPuffs[THIRD_INDEX]::wsData%/s%`;
                            call.resultDivID = "#channel" + channelNo;
                            call.title = 'Experiment Result Piece Puff';
                            call.parameterValue = 'ExperimentResultPuff_' + level;
                            call.firstLoop = 1;
                            call.secondLoop = 1;
                            call.thirdLoop = 20;
                            parameterCalls.push(call);
                        } else {
                            rows = preparedRow(parameter);
                            if (divID) {
                                $("#" + divID).append(rows);
                            } else {
                                $("#channel" + channelNo).append(rows);
                            }
                        }
                    });

                    parameterCalls.forEach((call, counter) => {
                        var generatedChannelDivId = null;

                        for (let i = call.firstLoop - 1; i >= 0; i--) {
                            for (let j = call.secondLoop - 1; j >= 0 ; j--) {
                                for (let k = call.thirdLoop - 1; k >= 0 ; k--) {
                                    let JSON_FILE_PATH = call.fileName.replace('FIRST_INDEX', i).replace('SECOND_INDEX', j).replace('THIRD_INDEX', k);

                                    TcHmi.Symbol.readEx2(JSON_FILE_PATH, function (data) {

                                        if (data.error === TcHmi.Errors.NONE) {
                                            if (divID) {
                                                generatedChannelDivId = divID + '_' + counter + '_' + call.parameterValue + '_' + i + '_' + j + '_' + k;
                                            }
                                            var dataJSON = JSON.parse(data.value);
                                            if (dataJSON.parameters && dataJSON.parameters.length > 0) {
                                                $("#" + divID).after('<table  id=' + generatedChannelDivId + ' cellspacing="0" cellpadding="10"><tr class="subtable"><th colspan="2">' + call.title + ' <span class="sign"></span></th></tr></table>');
                                                if (call.parameterValue.indexOf('ExperimentResultSubrun') >= 0) {
                                                    loadJson(JSON_FILE_PATH, channel, level, channelNo, generatedChannelDivId, i);
                                                } else if (call.parameterValue.indexOf('ExperimentResultPiece') >= 0) {
                                                    loadJson(JSON_FILE_PATH, channel, level, channelNo, generatedChannelDivId, SUBRUN_INDEX, j);
                                                } else {
                                                    loadJson(JSON_FILE_PATH, channel, level, channelNo, generatedChannelDivId);
                                                }
                                            }

                                        }
                                    });
                                }
                            }
                        }

                    });
                }
            });
        }

        var preparedRow = function (item) {
            var data_rows = '';

            if (item.parameterName != 'StepName' && item.parameterName != 'Created' && item.parameterName != 'SampleID' && item.parameterName != 'ReplicateID' && item.parameterName != 'Sequence' && item.parameterName != 'Active' && !item.metadata.ui) {
                if (item.metadata.type == 'ENTITY') {
                    return;
                }
                else {

                    if (item.metadata.hasOwnProperty('unitType')) {
                        var mapunit;
                        let unit = item.metadata.unitType;
                        switch (unit) {
                            case "angle": mapunit = angleUnit;
                                break;
                            case "humidity": mapunit = humidityUnits;
                                break;
                            case "pressure": mapunit = pressureUnits;
                                break;
                            case "temperature": mapunit = tempUnits;
                                break;
                            case "time": mapunit = timeUnits;
                                break;
                            case "volume": mapunit = volumeUnits;
                                break;
                            case "weight": mapunit = weightUnits;
                                break;
                            default: mapunit = '';
                        }
                        if (item.parentName != 'Root' && item.parentName != 'PuffDetails') {
                            data_rows += `<tr><td>${item.parent} ${item.name} (${mapunit})</td>`;
                        }
                        else {
                            data_rows += `<tr><td>${item.name} (${mapunit})</td>`;
                        }
                    }
                    else {
                        if (item.parentName != 'Root' && item.parentName != 'PuffDetails') {
                            data_rows += `<tr><td>${item.parent} ${item.name}</td>`;
                        }
                        else {
                            data_rows += `<tr><td>${item.name}</td>`;
                        }
                    }

                    if (item.metadata.type == 'DATETIME') {
                        let displayValue = DisplayValidateLocaleDate(item.value, '.000Z');
                        data_rows += `<td class ="headerValue"> ${displayValue}</td>`;
                    }
                    else
                        if (item.metadata.hasOwnProperty('unitType') && item.metadata.hasOwnProperty('range')) {
                            var mapunit, mapValueUnit = item.value;
                            let unit = item.metadata.unitType;
                            let precision = item.metadata.range.precision;
                            switch (unit) {
                                case "pressure": mapunit = pressureUnits;
                                    //kPa to Pa
                                    if (mapunit == "Pa") {
                                        mapValueUnit = item.value * 0.001;
                                    }
                                    //kPa to mbar
                                    if (mapunit == "mbar") {
                                        mapValueUnit = item.value * 10;
                                    }
                                    break;
                                case "temperature": mapunit = tempUnits;
                                    if (mapunit == "°F") {
                                        mapValueUnit = item.value * 9 / 5 + 32;;
                                    }
                                    break;
                                case "time": mapunit = timeUnits;
                                    //sec to min
                                    if (mapunit == "min") {
                                        mapValueUnit = item.value * 0.01666667;
                                    }
                                    //sec to ms
                                    if (mapunit == "ms") {
                                        mapValueUnit = item.value * 1000;
                                    }
                                    break;
                                case "volume": mapunit = volumeUnits;
                                    //ml to l
                                    if (mapunit == "l") {
                                        mapValueUnit = item.value * 0.001;
                                    }
                                    break;
                                case "weight": mapunit = weightUnits;
                                    //g to mg
                                    if (mapunit == "mg") {
                                        mapValueUnit = item.value * 1000;
                                    }
                                    break;
                                default: mapValueUnit = item.value;
                            }
                            data_rows += `<td class ="headerValue"> ${mapValueUnit.toFixed(precision)}</td>`;
                        }
                        else if (item.metadata.hasOwnProperty('range')) {
                            let precision = item.metadata.range.precision;
                            data_rows += `<td class ="headerValue">${(item.value).toFixed(precision)}</td>`;
                        }
                        else if (!item.metadata.hasOwnProperty('enum') && !item.metadata.hasOwnProperty('range')) {
                            data_rows += `<td class ="headerValue">${item.value}</td>`;
                        }
                        else {
                            let idx = item.value;
                            let BuildMapFromArrays = TcHmi.Functions.getFunction("BuildMapFromArrays");
                            let enumvalues = BuildMapFromArrays(item.metadata.enum.valueList, item.metadata.enum.textList);

                            data_rows += `<td class ="headerValue">${enumvalues.get(idx.toString())}</td>`;
                        }
                    data_rows += `</tr>`;
                }

            }
            return data_rows;
        };

        var init = function (current, end) {
            if (current < end) {
                var channel = {};
                channel.parameters = [];

                var rootfileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${current}]::wsData%/s%`;

                var topLevelDiv = 'rootChannel' + current;

                var rootDivID = 'roottable_' + current;
                var brandDivID = 'brandtable_' + current;
                var regimeDivID = 'regimetable_' + current;
                var experimentDivId = 'experimenttable_' + current;
                var LOOP = {};
                let isrootAvailable = false;
                let isbrandAvailable = false;
                let isregimeAvailable = false;
                let isexperimentAvailable = false;

                TcHmi.Symbol.readEx2(rootfileName, function (data) {
                    if (data.error === TcHmi.Errors.NONE) {
                        var brandfileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${current}]::stExperimentSetupChannelBrand::wsData%/s%`;

                        var dataJSON = JSON.parse(data.value);
                        if (dataJSON.parameters && dataJSON.parameters.length > 0) {
                            isrootAvailable = true;
                        }
                        TcHmi.Symbol.readEx2(brandfileName, function (data1) {
                            if (data1.error === TcHmi.Errors.NONE) {
                                var regimefileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${current}]::stExperimentSetupChannelRegime::wsData%/s%`;

                                var dataJSON1 = JSON.parse(data1.value);
                                if (dataJSON1.parameters && dataJSON1.parameters.length > 0) {
                                    isbrandAvailable = true;
                                }
                                TcHmi.Symbol.readEx2(regimefileName, function (data2) {
                                    if (data2.error === TcHmi.Errors.NONE) {
                                        var expresultfileName = `%s%Controller.Hmi.stSummaryReports.stExperiment.astExperimentSetupChannnel[${current}]::stExperimentResultChannel::wsData%/s%`;

                                        var dataJSON2 = JSON.parse(data2.value);
                                        if (dataJSON2.parameters && dataJSON2.parameters.length > 0) {
                                            isregimeAvailable = true;
                                        }
                                        TcHmi.Symbol.readEx2(expresultfileName, function (data3) {
                                            if (data3.error === TcHmi.Errors.NONE) {
                                                var dataJSON3 = JSON.parse(data3.value);
                                                if (dataJSON3.parameters && dataJSON3.parameters.length > 0) {
                                                    isexperimentAvailable = true;
                                                }

                                                if (isrootAvailable || isbrandAvailable || isregimeAvailable || isexperimentAvailable) {
                                                    var channelno = current;
                                                    $("#rootDiv").append(`<div id="${topLevelDiv}"><h2 class="channel">Channel No ${++channelno} </h2></div>`);
                                                }

                                                if (isrootAvailable) {
                                                    let str = `ChannelNumber${channelno}`;

                                                    $("#" + topLevelDiv).append(`<table id='${rootDivID}' cellspacing="0" cellpadding="10"></table>`);
                                                    loadJson(rootfileName, channel, 0, current, rootDivID, LOOP);

                                                }

                                                if (isbrandAvailable) {

                                                    $("#" + topLevelDiv).append(`<table id='${brandDivID}' cellspacing="0" cellpadding="10"><tr class="subtable"><th colspan="2">Brand Details <span class="sign"></span></th></tr></table>`);
                                                    loadJson(brandfileName, channel, 0, current, brandDivID, LOOP);

                                                }

                                                if (isregimeAvailable) {
                                                    $("#" + topLevelDiv).append(`<table  id='${regimeDivID}' cellspacing="0" cellpadding="10"><tr class="subtable"><th colspan="2">Regime Details <span class="sign"></span></th></tr></table>`);
                                                    loadJson(regimefileName, channel, 0, current, regimeDivID, LOOP);

                                                }

                                                if (isexperimentAvailable) {
                                                    $("#" + topLevelDiv).append(`<table  id='${experimentDivId}' cellspacing="0" cellpadding="10"><tr class="subtable"><th colspan="2">Experiment Details <span class="sign"></span></th></tr></table>`);
                                                    loadJson(expresultfileName, channel, 0, current, experimentDivId, LOOP);
                                                }
                                            }

                                        });
                                    }

                                });
                            }

                        });

                    }
                });
                init(current + 1, end);
            }
        };

        init(0, 20);

        /*************  Machine Configuration   ************/
        TcHmi.Symbol.readEx2('%s%Controller.Hmi.stSummaryReports::stExperiment::stMachineConfig::wsData%/s%', function (data) {
            if (data.error === TcHmi.Errors.NONE) {
                //    Handle result value... 
                var machine_config_data = JSON.parse(data.value);
                iterateAppendixData(machine_config_data, 'machine-config');
            }
        });

        /*************  Active Method Steps   ************/
        TcHmi.Symbol.readEx2('%s%Controller.Hmi.stSummaryReports.stExperiment.stMethod.wsData%/s%', function (data) {
            if (data.error === TcHmi.Errors.NONE) {
                if (data.value) {
                    var method_steps_data = JSON.parse(data.value);
                    
                    let predefined_steps_array = method_steps_data.parameters.find(item => item.parameterName == "PredefinedSteps").entities;
                    let user_steps_array = method_steps_data.parameters.find(item => item.parameterName == "UserDefinedSteps").entities;
                    let method_steps_array = [];                    
                    if (typeof user_steps_array == 'undefined') {
                        method_steps_array = predefined_steps_array;
                    }
                    else
                        method_steps_array = predefined_steps_array.concat(user_steps_array);
                    
                    var steps = '';  
                    steps += '<tbody>';
                    method_steps_data.parameters.forEach(item => {
                        steps += preparedRow(item);
                    });
                    steps += `<tr>
					            <td>Active Method Steps</td><td class ="headerValue">`;
					      
					let active_steps = method_steps_array.filter(item  => {
					    if (item.active == 1) {
					        return item;
					    }        
					}).sort(function (a, b) { return a.sequence - b.sequence; });

					active_steps.forEach(function (item, idx, active_steps) {
					    if (idx === active_steps.length - 1) {
					        steps += item.entityName;
					    }
					    else
					        steps += `${item.entityName} , `
					});
                    steps += '</td></tr></tbody>';

                    document.querySelector("#method-steps").innerHTML = steps;
                    
                }
            }
        });
    };

    TcHmi.Functions.registerFunction('DataOnDetailReport', DataOnDetailReport);
})(TcHmi);