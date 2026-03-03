import path from "node:path";
import fs from "node:fs";

const file = process.env.STORIES_FILE || path.resolve(process.cwd(), '..', 'docs', 'user-stories', 'stories.json')

function usage() {
    console.log(`
        While in the e2e/scripts file, you can run the script-commands as follows:\n\n
        To list every story with current information form the JSON file:\n
        \tnpm run story:list\n\n
        To change the status of a story use the following command:\n
        \tnpm run story:set [story-id] [status]\n
        \texample: npm run story:set US-110 implemented\n\n
        To get a specific story, and info, run this:\n
        \tnpm run story:get [story-id]\n\n
        To get the current completion of all the stories run:\n
        \tnpm run story:getComp
    `);
}

function loadJson(p){
    if(!fs.existsSync(p)) throw new Error(`File no found`);
    const raw =fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
}

function saveJson(f, d){
    if(!fs.existsSync(f)) throw new Error('File no found');
    const o = JSON.stringify(d, null, 2) + "\n";
    fs.writeFileSync(f, o, 'utf-8');
}

function ensureShape(data){
    if(!data || typeof data !== 'object' || !Array.isArray(data.stories)){
        throw new Error('Invalid shape of json');
    }
}

function storyByIndex(data){
    const map = new Map();
    for(let i = 0; i<data.stories.length; i++){
        map.set(data.stories[i].id, i);
    }
    return map;
}

function getCompletion(data){
    let totalBFTB = 0;
    let totalValue = 0;
    let totalStory = 0;
    let implementedBFTB = 0;
    let implementedValue = 0;
    let implementedStory = 0;
    data.stories.map(a => {
        totalBFTB += (parseFloat(a.BFTB) || 0);
        totalValue += (parseFloat(a.value) || 0);
        totalStory += (parseFloat(a.story) || 0);
    });
    data.stories.filter(a => (a.status === 'implemented')).map(a => {
        implementedBFTB += (parseFloat(a.BFTB) || 0);
        implementedValue += (parseFloat(a.value) || 0);
        implementedStory += (parseFloat(a.story) || 0);
    });
    let persentageBFTB = (implementedBFTB / totalBFTB) * 100
    let persentageValue = (implementedValue / totalValue) * 100
    let persentageStory = (implementedStory / totalStory) * 100
    const output = (`
    Current completion in terms of bftb is ${implementedBFTB} out of ${totalBFTB.toFixed(2)} equating to ${persentageBFTB.toFixed(2)}%\n
    Current completion in tems of value is ${implementedValue} out of ${totalValue} equating to ${persentageValue.toFixed(2)}%\n
    Current complterion in terms of time/effort is ${implementedStory} out of ${totalStory} equating to ${persentageStory.toFixed(2)}%
    `);
    return output;
}

function setStatus(data, id, status){
    const idx = storyByIndex(data).get(id);
    if(idx === undefined){
        throw new Error('No get the us' + id + status);
    }
    data.stories[idx].status = status;
}

function printStory(s){
    const title = s.title ?? '';
    console.log(`${s.id}\t${s.status}\t${title}`);
}

//Boolean check for planned stories
//Stories that are not planned or shelved WILL be tested during the playwright test runs
/*function isPlannedOrNo(id){
    const data = loadJson(file);
    const s = data.stories.find(a => a.id === id);
    return !!(s.status === 'planned' || '' || 'shelved');
}*/

const args = process.argv.slice(2);
if(args.length === 0){
    usage();
    process.exit(0);
}

const cmd = args[0];
const rest = args.slice(1);

try{
    const data = loadJson(file);
    ensureShape(data);
    if(cmd === 'list') {
        const filter = rest[0] ?? 'all';
        const stories = data.stories.filter(s => filter === 'all' ? true : s.status === filter).sort((a, b) => (a.id || '').localeCompare(b.id || ''));
        stories.forEach(printStory);
        process.exit(0);
    }
    if(cmd === 'get'){
        const id = rest[0];
        if(!id){
            throw new Error('No id');
        }
        const s = data.stories.find(x => x.id === id);
        if(!s){
            throw new Error('no found sory');
        }
        printStory(s);
        process.exit(0);
    }
    if(cmd === 'getComp'){
        const output= getCompletion(data);
        console.log(output);
        process.exit(0);
    }
    if(cmd === 'set'){
        if(rest.length < 2){
            throw new Error('use the help thingy or read the code');
        }
        for(let j = 0; j<rest.length; j += 2){
            const id = rest[j];
            const status = rest[j + 1];
            setStatus(data, id, status);
        }
        saveJson(file, data);
        console.log('Updated !')
        process.exit(0);
    }
    throw new Error('no command')
} catch (e) {
    console.error(String(e?.message ?? e));
    usage();
    process.exit(1);
}