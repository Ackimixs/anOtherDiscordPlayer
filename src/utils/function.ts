import fs from "node:fs";

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isUrl(query: string) {
    try {
        new URL(query);
        return true;
    } catch (e) {
        return false;
    }
}

async function addDataToJSON(data: any[], fileName: string): Promise<void> {
    if (fs.existsSync(fileName)) {
        await fs.promises.readFile(fileName, 'utf8')
            .then(fileData => {
                 let d = JSON.parse(fileData || '[]');
                 if (!(d instanceof Array)) d = [];
                 d.push(data);
                 return d;
            })
            .then(jsonData => {
                fs.promises.writeFile(fileName, JSON.stringify(jsonData))
            })
            .then(() => console.log('Data has been added to ' + fileName))
            .catch(err => { throw err });
    } else {
        await fs.promises.writeFile(fileName, JSON.stringify(data))
            .then(() => console.log('File has been created and data has been added to ' + fileName))
            .catch(err => { throw err });
    }

}

async function readDataFromJSON(path: string) : Promise<any[]> {
    if (fs.existsSync(path)) {
        const data = JSON.parse(fs.readFileSync(path, 'utf-8') || '[]');
        return data instanceof Array ? data : [];
    } else {
        fs.writeFileSync(path, '[]');
        return [];
    }
}
async function deleteFile(fileName: string): Promise<void> {
    if (fs.existsSync(fileName)) {
        try {
            await fs.promises.unlink(fileName);
            console.log(`${fileName} has been deleted`);
        } catch (err) {
            console.error(err);
        }
    }
}

function decodeString(html: string) : string {
    return html.replace(/&#([0-9]{1,3});/gi, function(match, num) {
        return String.fromCharCode(parseInt(num));
    });
}

export {
    shuffleArray,
    isUrl,
    readDataFromJSON,
    addDataToJSON,
    deleteFile,
    decodeString
}