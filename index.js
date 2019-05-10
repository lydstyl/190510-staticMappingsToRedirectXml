const fs = require('fs')
const path = require('path')
const rootDir = __dirname
const maper = {
    pid: 'product',
    cgid: 'category',
    cid: 'content',
    fid: 'folder'
}

let logs = 'LOGS TODO REPLACE xxx'
let linesInfos = []
let xml = `<? xml version = "1.0" encoding = "UTF-8" ?>
<redirect-urls xmlns="http://www.demandware.com/xml/impex/redirecturl/2011-09-01">`

fs.readFile(path.join(rootDir, 'staticMappings.txt'), 'utf8', (err, data) => {
    if (err) throw err;

    data.split('\r\n').forEach(line => {
        const props = line.split(',')

        // extraction infos lignes
        if (props.length != 7) {
            logs += `
    <redirect-url uri="${line.split(',')[0].split(' p')[0]}">
        <status-code>301</status-code>
        <enabled-flag>true</enabled-flag>
        <destination-url>xxx</destination-url>
        <copy-source-params>default</copy-source-params>
    </redirect-url>
            `
        }
        else{
            linesInfos.push({
                uri: props[0],
                type: props[5],
                id: props[6]
            })
        }
    });

    linesInfos = linesInfos.map(line=>{
        line.uri = line.uri.split(' p')[0]
        line.type = maper[line.type]
        return line
    })

    linesInfos.forEach(line => {
        xml += `
    <redirect-url uri="${line.uri}">
        <destination-id>${line.id}</destination-id>
        <destination-type>${line.type}</destination-type>
        <status-code>301</status-code>
        <enabled-flag>true</enabled-flag>
        <copy-source-params>default</copy-source-params>
    </redirect-url>`
    });

    fs.writeFile('logs.txt', logs, (err) => {
        if (err) throw err;
        console.log('Logs saved');
    });

    xml += `
</redirect-urls>`

    fs.writeFile('redirect-urls.xml', xml, (err) => {
        if (err) throw err;
        console.log('Xml saved');
    });
});