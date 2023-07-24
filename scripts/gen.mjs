#!/bin/node

import fsp from "node:fs/promises";
import readline from 'node:readline';
import path from "node:path";
import process from "node:process";

const PASCAL_NAME = 'PASCAL_NAME';
const KEBAB_NAME = 'KEBAB_NAME';

function template(strings, ...args) {
    /**
     *
     * @param replacer {Map<string, string>}
     */
    function templateAble(replacer) {
        let fullStr = strings[0];

        for (let i = 1; i < strings.length; i++) {
            const replaceKey = args[i - 1];
            const repl = replacer.get(replaceKey);
            if (typeof repl !== 'string')
                throw new Error("The provided replacement for " + replaceKey + " is not of type string");

            fullStr += repl;
            fullStr += strings[i];
        }

        return fullStr.trim() + '\n';
    }

    return templateAble;
}

const componentTsxTemplate = template`
import React from "react";

import "./${KEBAB_NAME}.scss";

export function ${PASCAL_NAME}() {
    return <div className="${KEBAB_NAME}"></div>;
}
`;

const componentScssTemplate = template`
.${KEBAB_NAME} {
  
}
`;

export async function generateComponent(projectPath, pascalCase, kebabCase) {
    const componentRootPath = path.resolve(projectPath, 'src', 'components');
    const componentDir = path.resolve(componentRootPath, kebabCase);

    const tsxFile = path.resolve(componentDir, kebabCase + '.tsx');
    const scssFile = path.resolve(componentDir, kebabCase + '.scss');

    const answer = await yesNoQuestion(
        "Would like to write the files \n" +
        "  " + yellow + path.relative(projectPath, tsxFile) + reset + '\n' +
        "  " + yellow + path.relative(projectPath, scssFile) + reset + '\n' +
        "  in the directory " + projectPath + '\n' +
        "Is that ok?"
    );

    if (!answer) {
        console.log('Alright, generation canceled.');
        return;
    }

    const replaceMap = new Map([
        [PASCAL_NAME, pascalCase],
        [KEBAB_NAME, kebabCase],
    ]);

    console.debug("Generating " + green + 'component' + reset + " with the 'PascalCase' name " + green + pascalCase + reset + " and the 'kebab-case' name " + green + kebabCase + reset + "");

    await fsp.mkdir(componentDir, {recursive: true});
    await fsp.writeFile(tsxFile, componentTsxTemplate(replaceMap));
    await fsp.writeFile(scssFile, componentScssTemplate(replaceMap));
}

const pageTsxTemplate = template`
import React from "react";

import "./${KEBAB_NAME}.scss";

export function ${PASCAL_NAME}Page() {
    return <div className="page ${KEBAB_NAME}-page"></div>;
}
`;

const pageScssTemplate = template`
.page.${KEBAB_NAME}-page {
  
}
`;


export async function generatePage(projectPath, pascalCase, kebabCase) {
    const componentRootPath = path.resolve(projectPath, 'src', 'pages');
    const componentDir = path.resolve(componentRootPath, kebabCase);

    const tsxFile = path.resolve(componentDir, kebabCase + '.tsx');
    const scssFile = path.resolve(componentDir, kebabCase + '.scss');

    const answer = await yesNoQuestion(
        "Would like to write the files \n" +
        "  " + yellow + path.relative(projectPath, tsxFile) + reset + '\n' +
        "  " + yellow + path.relative(projectPath, scssFile) + reset + '\n' +
        "  in the directory " + projectPath + '\n' +
        "Is that ok?"
    );

    if (!answer) {
        console.log('Alright, generation canceled.');
        return;
    }

    const replaceMap = new Map([
        [PASCAL_NAME, pascalCase],
        [KEBAB_NAME, kebabCase],
    ]);

    console.debug("Generating " + green + 'page' + reset + " with the 'PascalCase' name " + green + pascalCase + reset + " and the 'kebab-case' name " + green + kebabCase + reset + "");

    await fsp.mkdir(componentDir, {recursive: true});
    await fsp.writeFile(tsxFile, pageTsxTemplate(replaceMap));
    await fsp.writeFile(scssFile, pageScssTemplate(replaceMap));
}

function pascalCaseToKebabCase(pascalCase) {
    if (typeof pascalCase !== "string")
        return undefined;

    if (!/^(?:[A-Z][a-z]*)*$/.test(pascalCase))
        return undefined;

    let res = '';
    const reg = /([A-Z][a-z]*)/g;
    while (true) {
        const m = reg.exec(pascalCase);
        if (m === null)
            break;

        const g = m[1];
        if (res.length > 0)
            res += '-';
        res += g.toLocaleLowerCase();
    }

    return res;
}

const enableColors = true;

const esc = (...code) => enableColors ? "\x1B[" + code.join(';') + "m" : "";

// see: https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit
const red = esc("91");
const green = esc("92");
const yellow = esc("93");
const blue = esc("94");
const reset = esc("0");


const componentType = ["c", "comp", "component"];
const pageType = ["p", "page"];

const actionMap = [
    {id: componentType, action: generateComponent},
    {id: pageType, action: generatePage}
];

async function yesNoQuestion(question, defaultVal = true) {
    const rl = readline.createInterface({input: process.stdin, output: process.stdout});
    const fullQueryString = question + ' [' + (defaultVal ? 'Y' : 'y') + ', ' + (defaultVal ? 'n' : 'N') + '] ';
    const answer = await new Promise(res => rl.question(fullQueryString, res));
    rl.close();

    const lowerCaseAnswer = (answer || '').toLowerCase().trim();

    if (lowerCaseAnswer === 'yes' || lowerCaseAnswer === 'y')
        return true;
    else if (lowerCaseAnswer === '')
        return defaultVal;
    // only y and yes will result in confirmation otherwise it is a no
    else
        return false;
}

function callSignature() {
    let callSig = 'gen ' + ['TYPE', 'PASCAL_NAME', 'KEBAB_NAME'].map(e => yellow + e + reset).map((e, i) => i >= 2 ? "[" + e + "]" : e).join(' ') + '\n';

    callSig += '  ' + yellow + 'TYPE' + reset + ' defines the type to be generated\n';
    for (const {id} of actionMap)
        callSig += '    ' + id.map(c => '"' + blue + c + reset + '"').join(' / ') + ' to generate a ' + id[id.length - 1] + '\n';

    callSig += '  ' + yellow + 'PASCAL_NAME' + reset + ' defines the name in "PascalCase"\n';
    callSig += '  ' + yellow + 'KEBAB_NAME' + reset + ' (optional) defines the name in "kebab-case"\n';

    return callSig;
}

async function findFileInParents(fileName, directory = process.cwd()) {

    while (true) {
        const handle = await fsp.opendir(directory);
        for await(const item of handle) {
            if (item.isFile(item) && item.name === fileName)
                return directory;
        }

        const nextPath = path.resolve(directory, '..');
        if (nextPath === directory)
            return undefined;

        directory = nextPath;
    }
}

class ArgumentError extends Error {
}

class FileSystemError extends Error {
}

async function processCallArgs() {
    const args = process.argv;

    // somewhat loose, but it works for a script
    const selfIndex = args.findIndex(e => /[^a-zA-Z]gen[^a-zA-Z]/.test(e));

    if (selfIndex === -1) {
        throw new ArgumentError("Could not identify the script in the parameters, to determine where the arguments start.");
    } else {
        const actualScriptArgs = args.slice(selfIndex + 1);

        const [type, pascalCase, kebabCase = pascalCaseToKebabCase(pascalCase)] = actualScriptArgs;

        if (typeof type !== "string")
            throw new ArgumentError("There is no TYPE defined.");

        if (typeof pascalCase !== "string")
            throw new ArgumentError("There is no PASCAL_NAME defined.");

        if (!/^(?:[A-Z][a-z]*)+$/.test(pascalCase))
            throw new ArgumentError("The PASCAL_NAME '" + pascalCase + "' provided does not comfort to the pascal case with a-z letters.");

        if (typeof kebabCase !== "string")
            throw new ArgumentError("There is no KEBAB_NAME defined, and it could not be generated from the PASCAL_NAME.");

        if (!/^[a-z]+(?:-[a-z]+)*$/.test(kebabCase))
            throw new ArgumentError("The KEBAB_NAME '" + kebabCase + "' provided does not comfort to the kebab case with a-z letters.");

        const action = actionMap.find(e => e.id.includes(type));

        const packageJsonDir = await findFileInParents('package.json');

        if (packageJsonDir === undefined)
            throw new FileSystemError("Could not find a package.json in the current or parent directories.");

        if (action) {
            await action.action(packageJsonDir, pascalCase, kebabCase);
        } else {
            throw new ArgumentError("The specified type '" + type + "' is not defined.");
        }
    }
}

processCallArgs()
    .catch(e => {
        if (e instanceof ArgumentError) {
            console.error(red + 'There was an error with your arguments:' + reset);
            console.error(red + e.message + reset);
            console.error();
            console.error('Hava a look at the arguments:\n\n' + callSignature());
        } else if (e instanceof FileSystemError) {
            console.error(red + 'There was a problem with the file system:' + reset);
            console.error(red + e.message + reset);
        } else
            console.error(e);

        process.exit(1);
    });

