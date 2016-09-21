var localedb = [
	{"lang":"Afrikaans" , "locale":"af-AF", "native":"Afrikaans"},
	{"lang":"Bulgarian" , "locale":"bg-BG", "native":"български"},
	{"lang":"Catalan"   , "locale":"ca-CA", "native":"català"},
	{"lang":"Chinese"   , "locale":"zh-CN", "native":"中文"},
	{"lang":"Croatian"  , "locale":"hr-HR", "native":"hrvatski"},
	{"lang":"Czech"     , "locale":"cs-CS", "native":"čeština"},
	{"lang":"Danish"    , "locale":"da-DA", "native":"dansk"},
	{"lang":"Dutch"     , "locale":"nl-NL", "native":"Nederlands"},
	{"lang":"English"   , "locale":"en-US", "native":"English"},
	{"lang":"Finnish"   , "locale":"fi-FI", "native":"suomalainen"},
	{"lang":"French"    , "locale":"fr-FR", "native":"français"},
	{"lang":"German"    , "locale":"de-DE", "native":"Deutsch"},
	{"lang":"Greek"     , "locale":"el-EL", "native":"ελληνικά"},
	{"lang":"Hindi"     , "locale":"hi-HI", "native":"हिंदी"},
	{"lang":"Hungarian" , "locale":"hu-HU", "native":"Magyar"},
	{"lang":"Indonesian", "locale":"id-ID", "native":"bahasa Indonesia"},
	{"lang":"Italian"   , "locale":"it-IT", "native":"italiano"},
	{"lang":"Japanese"  , "locale":"ja-JA", "native":"日本語"},
	{"lang":"Korean"    , "locale":"ko-KO", "native":"한국어"},
	{"lang":"Latvian"   , "locale":"lv-LV", "native":"Latvijas"},
	{"lang":"Lithuanian", "locale":"lt-LT", "native":"Lietuvos"},
	{"lang":"Norwegian" , "locale":"no-NO", "native":"norsk"},
	{"lang":"Polish"    , "locale":"pl-PL", "native":"Polskie"},
	{"lang":"Portuguese", "locale":"pt-PT", "native":"português"},
	{"lang":"Romanian"  , "locale":"ro-RO", "native":"Română"},
	{"lang":"Russian"   , "locale":"ru-RU", "native":"русский"},
	{"lang":"Serbian"   , "locale":"sr-SR", "native":"Српски"},
	{"lang":"Slovak"    , "locale":"sk-SK", "native":"slovenský"},
	{"lang":"Slovenian" , "locale":"sl-SL", "native":"slovenski"},
	{"lang":"Spanish"   , "locale":"es-ES", "native":"Español"},
	{"lang":"Swedish"   , "locale":"sv-SV", "native":"svenska"},
	{"lang":"Thai"      , "locale":"th-TH", "native":"ไทย"},
	{"lang":"Turkish"   , "locale":"tr-TR", "native":"Türk"},
	{"lang":"Ukrainian"  , "locale":"uk-UK", "native":"український"}
];
var searchString = "";
var locale = "en-US";
var baseURL = "?";
var defCache = [];

$(document).ready(function() {
    $("#results-list").hide();

    var tkey = getURLParameter('q');
    if (tkey !== null) {
        $("#searchbar").val(tkey);
        console.log("Data: " + tkey);
        performRequest(false);
    }

    $("#searchbar").on('input', reflectURL);

    var tlocale = getURLParameter('l');
    if (tlocale !== null) locale = tlocale;

    for (var i = 0; i < localedb.length; i++) {
        $("#langsel").append('<option value="' + localedb[i].locale + '">' + localedb[i].native + ' (' + localedb[i].lang + ')</option>');

        if (tlocale !== null && localedb[i].locale == tlocale) {
            $("#langsel").attr("title", localedb[i].native);
            $("#langsel").val(localedb[i].locale);
        }
    }

    $("#langsel").change(function() {
        for (var i = 0; i < localedb.length; i++) {
            if (localedb[i].locale == $('#langsel').val()) locale = localedb[i].locale;
        }
        reflectURL();
        $('#searchbar').focus();
    });
});

function reflectURL() {
    window.history.pushState({}, "dataurl", baseURL + ($("#searchbar").val() != "" ? 'q=' + encodeURIComponent($("#searchbar").val()) : '') + ((locale !== "en-US") ? '&l=' + encodeURIComponent(locale) : ''));
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function performRequest(u) {
    if($("#searchbar").val().length < 2) return $("#searchbar").focus();

    defCache = [];
    if (u) reflectURL();
    searchString = $("#searchbar").val();
    $("#results-list").hide(200);
    $("#results-title").text("");
    $("#results-list").html("");

    $.getJSON("https://labs.turbo.run/api/v1/misc/what?q=" + searchString + "&l=" + locale, function( data ) {
        var confidence = data.length;

        if (confidence == 0) {
            $("#results-title").text("I don't know.");
        }

        for (var i = 0; i < confidence; i++) {
            $("#results-list").append(
                '<a id="ref_' + i + '" href="" target="blank_" class="list-group-item ' +
                (i == 0 ? 'active' : '') +
                '">' +
                '<h4 class="list-group-item-heading"><b>' +
                data[i].title +
                '</b> <small>( ' + data[i].type + ' )</small></h4>' +
                '<p id="desc_' + i + '" class="list-group-item-text"></p></a>'
            );

            getDefinition(data[i], locale.substring(0, 2), i);
        }

        $("#results-list").show(200);
    });
}

function getDef(data, i) {
    if (data[2].length == 0) return "That's all I know.";

    var def = data[2][0];
    for (var k = 0; k < defCache.length; k++) {
        if (defCache[k] == def && data[2].length > 1) def = data[2][1];
    }

    defCache[i] = def;
    return (def.length > 10 ? def : "I don't know. Click to learn more.");
}

function getDefinition(topic, lang, id) {
    $.ajax({
        url: "https://" + lang + ".wikipedia.org/w/api.php",
        data: {
            action: "opensearch",
            format: "json",
            search: topic.title,
            origin: "*"
        },
        dataType: 'json',
        type: 'GET',
        headers: {
            'Api-User-Agent': 'TurboAPI/1.0 - git.io/minxomat'
        },
        success: function(data) {
            $('#desc_' + id).html(getDef(data, id));
            $('#ref_' + id).attr("href", (data[2].length == 0) ? ("http://google.com/?q=" + data[0]) : data[3][0]);
        }
    });
}