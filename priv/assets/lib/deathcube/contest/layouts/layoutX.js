//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
// 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

LAYOUT = [
    [ // L1
        [c,    w,      w,      w],
        [n,    w|n,    w|n,    w|n],
        [n,    w|n,    w|n,    w|n],
        [n,    w|n,    w|n,    w|n]
    ],

    [ // L2
        [c|b,    w|b,    w|b,    w|d],
        [n|b,    n|b,    n|b,    n|s],
        [n|b,    c,      n|b,    n],
        [n|b,    w|n|b,  w|n|b,  w|n]
    ],

    [ // L3
        [c,    w,    w,    w],
        [n,    w,    w,    w|n],
        [n,    w,    w,    w|n|d],
        [n,    w,    w,    w|n]
    ],

    [ // L4
        [p|g,  w,      w,      w],
        [n,    w|n,    w|n,    w|d],
        [n,    w|n,    w|n,    w],
        [n,    w|n,    w|n,    w|n]
    ]
];
