const fetch = require("node-fetch"),
      fs = require("fs");

const template = rows => `<!DOCTYPE html><head><meta charset="utf-8"><title>Minecraft Download Links</title><link rel="stylesheet" href="styles.css"></head><body><p>Last updated: ${new Date().toDateString()}</p><table><tr><th>Version</th><th>Client</th><th>Client Mappings</th><th>Server</th><th>Server Mappings</th></tr>${rows}</table></body></html>`;

(async () => {

    console.log("downloading version manifest...");
    const versionManifest = await (await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")).json();

    console.log("downloading versions...");
    const versions = await Promise.all(versionManifest.versions.map(version => fetch(version.url).then(resp => resp.json()).then(version => {
        console.log("downloaded " + version.id);
        return version;
    })));

    const cell = download => download ? `<td><a href="${download.url}">download</a></td>` : '<td></td>';
    fs.writeFileSync("links.html", template(versions.map(version => [
        '<tr>',
        `<td>${version.id}</td>`,
        cell(version.downloads.client),
        cell(version.downloads.client_mappings),
        cell(version.downloads.server),
        cell(version.downloads.server_mappings),
        '</tr>'
    ].join('')).join('')));

})();