var draw = {
    back: (ctx, canvas, spc = 50, hh = 10) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '10px sans-serif';

        let kk = 0;
        for (const ll of "CDEFGABCDE") {
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            ctx.fillRect(spc + kk * 3 * hh, spc, hh * 3, hh * 8);
            ctx.strokeRect(spc + kk * 3 * hh, spc, hh * 3, hh * 8);
            ctx.fillStyle = 'black';
            ctx.fillText(ll, spc + kk * 3 * hh + 1.5 * hh, spc + hh * 9);
            kk += 1;
        }
    }
};


// draw.debugInput = function (ctx, input) {
//     ctx.fillStyle = 'white';
//     ctx.textBaseline = 'top';
//     ctx.font = '10px arial';
//     ctx.fillText('input.pointerDown: ' + input.pointerDown, 10, 10);
//     ctx.fillText('input.pos: ' + input.pos.x + ',' + input.pos.y, 10, 20);
//     ctx.fillText('input.keys[87] (w): ' + input.keys[87], 10, 40);
//     ctx.fillText('input.keys[65] (a): ' + input.keys[65], 10, 50);
//     ctx.fillText('input.keys[83] (s): ' + input.keys[83], 10, 60);
//     ctx.fillText('input.keys[68] (d): ' + input.keys[68], 10, 70);
// };

///////

var canvas = document.getElementById('piano_canvas');
let ctx = canvas.getContext('2d');

// var input = controlMod(canvas);

var loop = function () {

    requestAnimationFrame(loop);

    draw.back(ctx, canvas);
    // draw.debugInput(ctx, input);

};

loop();