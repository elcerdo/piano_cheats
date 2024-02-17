var draw = {
    clear: (ctx, canvas) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    piano: (ctx, spc_xx = 10, spc_yy = 17, num_octaves = 3, hh = 10, spc_text = 2) => {
        ctx.textAlign = 'center';
        ctx.font = '10px sans-serif';

        { // white notes
            ctx.textBaseline = 'top';
            let cur_xx = spc_xx;
            for (let kk = 0; kk < num_octaves; kk++)
                for (const ll of "CDEFGAB") {
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.fillRect(cur_xx, spc_yy, hh * 3, hh * 8);
                    ctx.strokeRect(cur_xx, spc_yy, hh * 3, hh * 8);
                    ctx.fillStyle = 'black';
                    ctx.fillText(ll, cur_xx + 1.5 * hh, spc_yy + hh * 8 + spc_text);
                    cur_xx += 3 * hh;
                }
        }

        { // black keys
            ctx.textBaseline = 'bottom';
            const black_note = (kk, ll) => {
                let cur_xx = spc_xx + (2 + 3 * kk) * hh;
                for (let kk = 0; kk < num_octaves; kk++) {
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = 'black';
                    ctx.fillRect(cur_xx, spc_yy, hh * 2, hh * 5);
                    ctx.strokeRect(cur_xx, spc_yy, hh * 2, hh * 5);
                    ctx.fillStyle = 'black';
                    ctx.fillText(ll, cur_xx + hh, spc_yy - spc_text);
                    cur_xx += 3 * 7 * hh;
                }
            };
            black_note(0, "Db");
            black_note(1, "Eb");
            black_note(3, "Gb");
            black_note(4, "Ab");
            black_note(5, "Bb");
        }
    }
};

///////

const canvas = document.getElementById('piano_canvas');
const context = canvas.getContext('2d');

const loop = () => {
    requestAnimationFrame(loop);
    draw.clear(context, canvas)
    draw.piano(context);
    draw.piano(context, 10, 127, 2);
    draw.piano(context, 10, 247, 4);
};

loop();