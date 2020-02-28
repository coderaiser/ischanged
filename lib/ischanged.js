'use strict';

const os = require('os');
const path = require('path');

const check = require('checkup');
const readjson = require('readjson');
const writejson = require('writejson');
const time = require('timem');
const mkdir = require('mkdirp');
const tryToCatch = require('try-to-catch');
const log = require('debug')('ischanged');
const WIN = process.platform === 'win32';

let Times;

const DIR = getDir() || __dirname + '/../json/';
const NAME_SHORT = DIR + 'changes';
const NAME = NAME_SHORT + '.json';

async function getTimes() {
    if (Times)
        return Times;
    
    const [, data] = await tryToCatch(readjson, NAME);
    Times = data || {};
}

function getDir() {
    let dir = path.join(os.tmpdir(), '/ischanged');
    
    if (!WIN)
        dir += path.sep + process.getuid();
    
    return dir + path.sep;
}

async function makeDir(dir) {
    const ANY_MASK = 0;
    const umask = process.umask(ANY_MASK);
    
    const [error] = await tryToCatch(mkdir, dir);
    process.umask(umask);
    
    if (error && error.code === 'EEXIST')
        return;
    
    throw error;
}

module.exports = async (name) => {
    check
        .type('name', name, 'string');
    
    await getTimes();
    let readTime = Times[name];
    
    const [error, fileTime] = await tryToCatch(time, name, 'raw');
    
    let timeChanged;
    let msg = 'changed';
    let changed = readTime !== fileTime;
    
    log('name: '     + name);
    log('readTime: ' + readTime + ' ' + error);
    log('fileTime: ' + fileTime);
    
    if (!changed)
        msg = 'not ' + msg;
    
    log(msg + ' ' + name);
    
    if (!error && changed) {
        timeChanged     = true;
        Times[name]     = fileTime;
        
        const [dirError] = await tryToCatch(makeDir, DIR);
        if (dirError)
            log('makedir ' + DIR + ' ' + error);
        
        const [e] = await tryToCatch(writejson, NAME, Times);
        e && log('writeFile ' + NAME + ' ' + e);
        
        return timeChanged;
    }
};
