var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;

    var doc =
        (options && options.document) ||
        (typeof document !== 'undefined' && document)
    ;

    var elem = doc.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }

    var head = doc.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }

    return elem;
};
