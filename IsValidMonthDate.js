// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

    var IsValidMonthDate = function (sDate) {

        let userLang = navigator.language || navigator.userLanguage;
        let supportedLang = ["da", "nl", "nl-BE", "en-GB", "en-IE", "en-BZ", "en-ZA", "et", "fo", "fr", "fr-BE", "fr-CH", "fr-LU", "de", "de-CH", "de-AT", "de-LU", "de-LI", "he", "id", , "ja", "it", "it-CH", "lv", "lt", "pl", "pt-BR", "pt", "ro", "ro-MO", "ru", "ru-MI", "es", "es-AR", "es-GT", "es-CR", "es-MX", "es-PE", "es-EC", "es-CL", "es-UY", "es-PY", "es-BO", "es-SV", "es-HN", "es-NI", "sr", "sk", "sl", "sv", "sv-FI", "th", "tr", "uk", "vi"];
        let mixLang = ["en-CA", "es-PA", "es-DO", "es-VE", "es-CO", "es-PR"];

        let dateTimearr = sDate.split(' ');
        if (dateTimearr.length == 1)
            return false;

        let datesymarr = dateTimearr[0].match(/\/|\-|\./g);
        let datearr = dateTimearr[0].split(/\D/);
        let timesymarr = dateTimearr[1].match(/\:|\./g);
        
        let finaldate, timearr;

        Array.prototype.allValuesSame = function () {
            for (let i = 1; i < this.length; i++) {
                if (this[i] !== this[0]) {
                    return false;
                }
            }
            return true;
        }

        if (!datesymarr || !timesymarr)
            return false;
       
        if ((datearr.length != 3) || !datesymarr.allValuesSame() || !timesymarr.allValuesSame())
            return false;

        if (supportedLang.indexOf(userLang) > -1) {
            if (datearr[0].length == 4) {
                [datearr[0], datearr[2]] = [datearr[2], datearr[0]];
            }

            finaldate = datearr.join(datesymarr[0]);

            timearr = dateTimearr[1];

            var timeCheck = /^(?:[01]\d|2[0-3])(\:|\.)(?:[0-5]\d)(\:|\.)(?:[0-5]\d)$/;
        }
        else {
            if (mixLang.indexOf(userLang) > -1) {
                if (datearr[0].length == 4) {
                    [datearr[0], datearr[2]] = [datearr[2], datearr[0]];
                }

                if ((userLang != 'en-CA') && (userLang != 'es-DO')) {
                    [datearr[0], datearr[1]] = [datearr[1], datearr[0]];
                }
                var timeCheck = /^(0[0-9]|1[012]):([0-5]?[0-9]):([0-5]?[0-9])\s[ap](\.)\s?m(\.)$/i; //(a.m., p.m.)
                timearr = [...dateTimearr].slice(1).join(' '); 
            }
            else {
                [datearr[0], datearr[1]] = [datearr[1], datearr[0]];
                var timeCheck = /^(0[0-9]|1[012]):([0-5]?[0-9]):([0-5]?[0-9])\s[ap]m$/i;
                timearr = [...dateTimearr].slice(1).join(' ');
            }
            finaldate = datearr.join(datesymarr[0]);

        }

        var completedateCheck = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)02\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{4})$/;

        if (finaldate.match(completedateCheck) && timearr.match(timeCheck)) {
            return true;
        }
        else
            return false;

    };

    TcHmi.Functions.registerFunction('IsValidMonthDate', IsValidMonthDate);
})(TcHmi);