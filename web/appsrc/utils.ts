import * as path from 'path';
import { app, BrowserWindow } from 'electron'

const url = require('url')
const fs = require('fs');
const hjson = require('hjson');

function getIndexAddr() {
    if (app.isPackaged) {
        return url.format({ pathname: path.join(__dirname, './dist/index.html'), protocol: 'file:', slashes: true, hash: '#' });
    } else {
        return 'http://localhost:8000/#';
    }
}

export function getFullUrl(pathName?: string) {
    let p = getIndexAddr();
    if (pathName) {
        p = `${p}/${pathName}`
    }
    return p;
}
export function getResourcePath(resourceName?: string) {
    if (app.isPackaged) {
        return path.normalize(path.join(app.getAppPath(), 'res', resourceName));
    } else {
        return path.normalize(path.join(process.cwd(), 'res', resourceName));
    }
}

export function getAppConfig() {
    const configPath = getResourcePath('config.jsonc');
    try {
        const localConfigText = fs.readFileSync(configPath).toString('utf-8');
        const localConfig = hjson.parse(localConfigText);
        localConfig.commandParams = parseCommandParams();
        localConfig.debugMode = !app.isPackaged || app.commandLine.hasSwitch('debug');
        return localConfig;
    } catch (e) {
        return { meetting: {} }
    };
}
function parseCommandParams() {
    const param = {
        features: { // --feat-*
            f1: hasFeature('f1'), //--feat-f1
            f2: getFeatureValue('f2'), //--feat-f2=aaa
        }
    }
    return param;
}

/**
 * @param featName Feature的名字，比如参数 --feat-ABC-D 则对应的Feature名字传ABC-D, 不要传全名
 */
function hasFeature(featName: string) {
    const fullName = `feat-${featName}`;
    return app.commandLine.hasSwitch(fullName);
}

/**
 * @param featName 
 * @returns 如果有定义feat， 则返回值, 如果没有值就是空字符串，如果没有定义feat，则返回undefined
 */
function getFeatureValue(featName: string): string | undefined {
    if (!hasFeature(featName)) {
        return undefined;
    } else {
        const fullName = `feat-${featName}`;
        return app.commandLine.getSwitchValue(fullName);
    }
}
