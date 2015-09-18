var test = require('tape');
var insertCss = require('../');
var getStyle = require('computed-style');

var css = 'body { background-color: purple; color: yellow; }';
var doc =
    (typeof document !== 'undefined' && document) ||
    require('jsdom').jsdom('<!DOCTYPE html>').defaultView.document
;

test(function (t) {
    t.plan(13);

    var before = colors();
    t.ok(before.bg === 'rgba(0,0,0,0)' || before.bg === 'transparent');
    t.ok(before.fg === 'rgb(0,0,0)' || before.fg === '#000000');

    insertCss(css, { prepend: true, document: doc });

    var after = colors();
    t.ok(after.bg === 'rgb(128,0,128)' || after.bg === 'purple');
    t.ok(after.fg === 'rgb(255,255,0)' || after.fg === 'yellow');

    var resetStyle = 'body { background-color: transparent; color: #000000; }';
    insertCss(resetStyle, { document: doc });

    var reset = colors();
    t.ok(reset.bg === 'rgba(0,0,0,0)' || reset.bg === 'transparent');
    t.ok(reset.fg === 'rgb(0,0,0)' || reset.fg === '#000000');

    var resetStyle = 'body { background-color: green; color: pink; }';
    insertCss(resetStyle, { prepend: true, document: doc });

    var reset = colors();
    t.ok(reset.bg === 'rgba(0,0,0,0)' || reset.bg === 'transparent');
    t.ok(reset.fg === 'rgb(0,0,0)' || reset.fg === '#000000');

    var resetStyle = 'body { background-color: yellow; color: purple; }';
    insertCss(resetStyle, { prepend: false, document: doc });

    var reset = colors();
    t.ok(reset.bg === 'rgb(255,255,0)' || reset.bg === 'yellow');
    t.ok(reset.fg === 'rgb(128,0,128)' || reset.fg === 'purple');

    var styleElement = insertCss('whatever {}');
    t.ok(styleElement instanceof Element);
    t.ok(document.documentElement.contains(styleElement));
    styleElement.parentNode.removeChild(styleElement);
    t.notOk(document.documentElement.contains(styleElement));
});

test('Allow inserting the same CSS twice', function (t) {
    t.plan(2);

    var resetStyle = 'body { background-color: transparent; color: #000000; }';
    insertCss(resetStyle);

    var reset = colors();
    t.ok(reset.bg === 'rgba(0,0,0,0)' || reset.bg === 'transparent');
    t.ok(reset.fg === 'rgb(0,0,0)' || reset.fg === '#000000');
});

function colors () {
    var body = doc.getElementsByTagName('body')[0];
    return {
        bg: getStyle(body, 'backgroundColor').replace(/\s+/g, ''),
        fg: getStyle(body, 'color').replace(/\s+/g, '')
    };
}
