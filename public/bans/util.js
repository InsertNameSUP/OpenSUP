util = {
    spans: {
        'y': ((24 * 60 * 60) * (365.2425 / 12)) * 365.2425,
        'mo': (24 * 60 * 60) * (365.2425 / 12),
        'w': 24 * 7 * 60 * 60,
        'd': 24 * 60 * 60,
        'h': 60 * 60,
        'mi': 60,
        's': 1
    },
    FormatTime: function(time) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time % 3600) / 60);
        var seconds = Math.floor((time - hours * 3600) - (minutes * 60));
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return ((isNaN(hours) ? 0 : hours) + ':' + (isNaN(minutes) ? 0 : minutes) + ':' + (isNaN(seconds) ? 0 : seconds));
    },
    TimeToString: function(time, round = 2) {
        var str = '';
        var seconds = parseFloat(time);
        var reps = 0;
        for (var k in util.spans) {
            if (reps == round) break;
            var v = util.spans[k];
            if (seconds >= v) {
                reps++;
                var units = Math.floor(seconds / v);
                str += units + k + ' ';
                seconds = (seconds - (units * v));
            }
        }
        return str;
    },
    FormatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    FormatTimeNumber: function(num) {
        return num < 10 ? '0' + num : num;
    },
    FormatDate: function(i) {
        return (new Date(i * 1000)).toLocaleString('en-US', {
            hour12: false
        });
    },
    FormatMoney: function(num, isRC) {
        return (!isRC ? '$' : '') + num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + (isRC ? 'RC' : '');
    },
    RoundNumber: function(num) {
        return Math.round(num);
    },
    Linkify: function(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
        replacePattern3 = /(STEAM_0:[01]:\d{1,10})/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="https://superiorservers.co/profile/$1" target="_blank">$1</a>');
        return replacedText;
    }
}