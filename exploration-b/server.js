const fs = require('fs');
const { join } = require('path');

const express = require('express');
const app = express();

const ELEMENTS_PATH = 'elements';

const getDirectories = path =>
    fs.readdirSync(path)
        .filter(f => fs.lstatSync(join(path, f)).isDirectory());

const getVersions = element =>
    getDirectories(`${ELEMENTS_PATH}/${element}`);

const selfClosingTags = new Set([
    'link',
    'meta',
]);
const sanitizeTagName = unsafeTag => { 
    const tag = unsafeTag.toLowerCase().trim();
    return {
        tag, 
        selfClosing: selfClosingTags.has(tag),
    };
};
const sanitizeAttributeName = name => name.trim();
const sanitizeAttributeValue = value => value.trim();
const sanitizeTextNodeValue = (tag, value) => value.trim();

function importElement({ tag, version }) {
    const knownVersions = getVersions(tag);
    console.log(`importing <${tag} version="${version}">, known versions: ${knownVersions.join(',')}`);

    return ['link', { 
        rel: 'import', 
        href: `${ELEMENTS_PATH}/${tag}/${version}/${tag}.html`,
    }];
}

function createAttributes(tag, attrs) {
    if (!attrs) {
        return '';
    }

    const result = [''];

    Object.keys(attrs).sort().forEach(attr => {
        const name = sanitizeAttributeName(attr);
        const value = sanitizeAttributeValue(attrs[attr]);
        result.push(`${name}="${value}"`);
    });

    return result.join(' ');
}

function h(unsafeTag, unsafeAttrs = null, unsafeChildren = []) {
    const { tag, selfClosing } = sanitizeTagName(unsafeTag);
    const result = [
        `<${tag}${createAttributes(tag, unsafeAttrs)}>`,
        typeof unsafeChildren === 'string' 
            ? sanitizeTextNodeValue(tag, unsafeChildren) 
            : unsafeChildren.map(child => h(...child)).join(''),
    ];
    if (!selfClosing) {
        result.push(`</${tag}>`);
    }
    return result.join('');
}

function render(page) {
    console.log(`\nrendering ${page.title}...`);

    const { body, elements, locale, title } = page;

    return [
        '<!DOCTYPE html>',
        h('html', { lang: locale.split('-')[0], class: 'no-js' }, [

            ['head', null, [
                ['meta', { charset: "utf-8" }],
                ['title', null, title],
                ...elements.map(element => importElement(element)),
            ]],
            ['body', null, body],

        ]),
    ].join('');
}

const pages = require('./pages');

app.get('/', (req, res) => {
    res.send(render(pages.home));
});

app.use('/lib', 
    express.static(join(__dirname, 'lib')));

app.use(`/${ELEMENTS_PATH}`, 
    express.static(join(__dirname, `${ELEMENTS_PATH}`)));

app.listen(3000, () => console.log('Listening on port 3000...'));