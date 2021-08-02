// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

    var IncorrectTimeMessageBox = function (srcData, DefaultsrcData) {

        if (!srcData)
            return;
        if (!srcData.parameters || (Object.entries(srcData).length === 0 && srcData.constructor === Object))
            return;
        if (srcData.parameters.length == 0)
            return;
        if (!DefaultsrcData)
            return;
        if (!DefaultsrcData.parameters || (Object.entries(DefaultsrcData).length === 0 && DefaultsrcData.constructor === Object))
            return;
        if (DefaultsrcData.parameters.length == 0)
            return;
        var Messagebool = false;

        let splitarray = [], DTvalue, finalDateFormat;//from srcDAta
        let Defaultsplitarray = [], DefaultDTvalue, DefaultfinalDateFormat; //from DefaultsrcData

        //  Date time values from JSONs

        DTvalue = srcData.parameters.find(p=>p.parameterName == "StartTime").value;
        DefaultDTvalue = DefaultsrcData.parameters.find(p=>p.parameterName == "StartTime").value;

        splitarray = DTvalue.split(" ");
        Defaultsplitarray = DefaultDTvalue.split(" ");

        let dateTimestr = splitarray[0].split('-').reverse().join('-') + 'T' + splitarray[1];
        finalDateFormat = (new Date(dateTimestr)).getTime();
        let DefaultdateTimestr = Defaultsplitarray[0].split('-').reverse().join('-') + 'T' + Defaultsplitarray[1];
        DefaultfinalDateFormat = (new Date(DefaultdateTimestr)).getTime();

        //current date and time
        let currentDate = new Date();
        let today = ('0' + currentDate.getDate()).slice(-2) + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + currentDate.getFullYear();
        let timeToday = ('0' + currentDate.getHours()).slice(-2) + ":" + ('0' + currentDate.getMinutes()).slice(-2) + ":" + ('0' + currentDate.getSeconds()).slice(-2);

        //warmup parameters values in srcData and default srcDAta
        warmupEnablesrcData = srcData.parameters.find(p=>p.parameterName == "Enable").value;
        warmupEnableDefaultsrcData = DefaultsrcData.parameters.find(p=>p.parameterName == "Enable").value;


        //IF NO DATE TIME CHANGED
        if (DefaultfinalDateFormat == finalDateFormat && Defaultsplitarray[1] == splitarray[1]) {

            if (warmupEnablesrcData != warmupEnableDefaultsrcData && warmupEnablesrcData == "1") {

                if ((splitarray[1] < timeToday || finalDateFormat < currentDate.getTime()) || (splitarray[1] < timeToday && finalDateFormat == currentDate.getTime())) {
                    Messagebool = true;
                    return Messagebool;
                }

                if ((splitarray[1] < timeToday && finalDateFormat > currentDate.getTime()) || (splitarray[1] >= timeToday && finalDateFormat > currentDate.getTime()) || (splitarray[1] >= timeToday && finalDateFormat >= currentDate.getTime())) {
                    Messagebool = false;
                    return Messagebool;
                }
            }

            if (splitarray[1] >= timeToday && finalDateFormat >= currentDate.getTime()) {
                Messagebool = false;
                return Messagebool;
            }
        }


        if ((splitarray[1] < timeToday || finalDateFormat < currentDate.getTime()) || (splitarray[1] < timeToday && finalDateFormat == currentDate.getTime())) {
            Messagebool = true;
        }


        if ((splitarray[1] < timeToday && finalDateFormat > currentDate.getTime()) || (splitarray[1] >= timeToday && finalDateFormat > currentDate.getTime()) || (splitarray[1] >= timeToday && finalDateFormat >= currentDate.getTime())) {
            Messagebool = false;

        }

        return Messagebool;
    };

    TcHmi.Functions.registerFunction('IncorrectTimeMessageBox', IncorrectTimeMessageBox);
})(TcHmi);