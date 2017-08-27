const { memoize, toLower, trim } = require('ramda');

const selfClosingTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);

const sanitizeTagName = memoize(unsafeTag => {
    const tag = trim(toLower(unsafeTag));
    return {
        selfClosing: selfClosingTags.has(tag),
        tag,
    };
});
const sanitizeAttributeName = memoize(name => trim(name));
const sanitizeAttributeValue = memoize(value => trim(value));
const sanitizeTextNodeValue = tag => value => trim(value);

module.exports = {
    sanitizeAttributeName,
    sanitizeAttributeValue,
    sanitizeTagName,
    sanitizeTextNodeValue,
};
