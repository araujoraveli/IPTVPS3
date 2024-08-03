// Importar módulos necessários (ajuste conforme a configuração do Movian)
var Http = require('http');
var XML = require('xml');

// URL do arquivo M3U
var m3uUrl = "https://github.com/araujoraveli/List.m3u-for-PS3/raw/main/lista.m3u";

// Função para carregar o arquivo M3U
function loadM3U(url, callback) {
    Http.get(url, function(res) {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            callback(parseM3U(data));
        });
    }).on('error', function(e) {
        console.error("Erro ao carregar o M3U: " + e.message);
    });
}

// Função para analisar o arquivo M3U
function parseM3U(data) {
    var lines = data.split('\n');
    var channels = [];
    var currentCategory = "Todos";

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.startsWith("#EXTINF")) {
            var name = line.split(",")[1].trim();
            var url = lines[++i].trim();
            channels.push({ name: name, url: url });
        }
    }
    return channels;
}

// Função para exibir os canais
function displayChannels(channels) {
    var list = new List();
    list.addCategory("Todos");
    channels.forEach(function(channel) {
        list.addItem(channel.name, channel.url);
    });
    list.show();
}

// Função principal do plugin
function main() {
    loadM3U(m3uUrl, function(channels) {
        displayChannels(channels);
    });
}

main();
