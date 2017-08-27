const fs = require('fs');
const path = require('path');

const {
    always,
    defaultTo,
    head,
    identity,
    ifElse,
    is,
    isNil,
    join,
    keys,
    map,
    pipe,
    prepend,
    sort,
    split,
} = require('ramda');

const joinEmpty = join('');

const {
    sanitizeAttributeName,
    sanitizeAttributeValue,
    sanitizeTagName,
    sanitizeTextNodeValue,
} = require('./sanitize');

const getDirectories = dir =>
    fs.readdirSync(dir)
        .filter(f => fs.lstatSync(path.join(dir, f)).isDirectory());

const getVersions = element =>
    getDirectories(path.join(__dirname, `../../static/elements/${element}`));

const importElement = ({ tag, version }) => {
    const knownVersions = getVersions(tag);
    console.log(`importing <${tag} version="${version}">, known versions: ${knownVersions.join(',')}`);

    return ['link', {
        rel: 'import',
        href: `/elements/${tag}/${version}/${tag}.html`,
    }];
};

const createAttributes = (tag, attrs) =>
    ifElse(
        isNil,
        defaultTo(''),
        pipe(
            keys,
            sort((a, b) => a > b),
            map(attr => {
                const name = sanitizeAttributeName(attr);
                const value = sanitizeAttributeValue(attrs[attr]);
                return `${name}="${value}"`;
            }),
            prepend(''),
            join(' ')
        )
    )(attrs);

const scanChildren = pipe(
    map(child => h(...child)),
    joinEmpty
);

const isString = is(String);

function h(unsafeTag, unsafeAttrs = null, unsafeChildren = []) {
    const { tag, selfClosing } = sanitizeTagName(unsafeTag);
    return joinEmpty([
        `<${tag}${createAttributes(tag, unsafeAttrs)}>`,
        ifElse(
            isString,
            sanitizeTextNodeValue(tag),
            scanChildren
        )(unsafeChildren),
        ifElse(
            always(selfClosing),
            always(undefined),
            identity
        )(`</${tag}>`)
    ]);
}

function render(page) {
    console.log(`\nrendering ${page.title}...`);

    const { body, elements, locale, title } = page;
    const htmlAttrs = {
        lang: defaultTo('en', head(split('-', locale))),
        class: 'no-js',
    };

    return joinEmpty([
        '<!DOCTYPE html>',
        h('html', htmlAttrs, [
            ['head', null, [
                ['meta', { charset: 'utf-8' }],
                ['title', null, title],
                ...map(importElement, elements),
            ]],
            ['body', null, body],
        ]),
    ]);
}

module.exports = {
    render,
};
