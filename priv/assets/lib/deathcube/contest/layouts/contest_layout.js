//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
// 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

LAYOUT_CONTEST = (function() {
var c = 0;
var p = 1;
var w = 2;
var n	= 4;
var d	= 8;
var g	= 16;
var s	= 32;
var b	= 64;
return [
    [ // L1
        [c,     w,      w,       p|w],
        [n,     n|w,    n|w|b,   n|w],
        [n,     n|w|b,  n|w,     n|w],
        [p|n,   n|w,    n|w,     n|w]
    ],

    [ // L2
        [c,     w|d|s,   c,     w],
        [n|d|s, b,       n|w|b, n|w],
        [c,     n|w|b,   n|w|b, s|d],
        [n,     n|w,     s|d,   n|w]
    ],

    [ // L3
        [d,    w,    w,    w|d],
        [n,    p|g,  w,    n],
        [n,    w,    p|n,  n],
        [n|d,  n|w,  n|w,  n|w|d]
    ],

    [ // L4
        [s,    w,      w,      w|s],
        [c,    w|n,    w|n,    w|n],
        [n,    w,      w,      n|w],
        [d,    n|w,    n|w,  w|n|d]
    ]
];})();
