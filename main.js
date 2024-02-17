class Draw {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.origin_xx = 10;
        this.origin_yy = 17;
        this.text_spacing = 2;
        this.grid_size = 10;
        this.row_spacing = 120;
    }

    clear() {
        this.context.fillStyle = 'yellow';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    piano(row_offset, num_octaves) {
        const spc_yy = this.origin_yy + row_offset * this.row_spacing;
        let ctx = this.context;

        ctx.textAlign = 'center';
        ctx.font = '10px sans-serif';

        { // white notes
            const width = this.grid_size * 3;
            const height = this.grid_size * 8;
            ctx.textBaseline = 'top';
            let cur_xx = this.origin_xx;
            for (let kk = 0; kk < num_octaves; kk++)
                for (const ll of "CDEFGAB") {
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.fillRect(cur_xx, spc_yy, width, height);
                    ctx.strokeRect(cur_xx, spc_yy, width, height);
                    ctx.fillStyle = 'black';
                    ctx.fillText(ll, cur_xx + width / 2, spc_yy + height + this.text_spacing);
                    cur_xx += width;
                }
        }

        { // black keys
            const width = this.grid_size * 2;
            const height = this.grid_size * 5;
            ctx.textBaseline = 'bottom';
            const black_note = (kk, ll) => {
                let cur_xx = this.origin_xx + this.grid_size * (2 + 3 * kk);
                for (let kk = 0; kk < num_octaves; kk++) {
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = 'black';
                    ctx.fillRect(cur_xx, spc_yy, width, height);
                    ctx.strokeRect(cur_xx, spc_yy, width, height);
                    ctx.fillStyle = 'black';
                    ctx.fillText(ll, cur_xx + width / 2, spc_yy - this.text_spacing);
                    cur_xx += this.grid_size * 3 * 7;
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
const draw = new Draw(canvas);

// const midi_status = document.getElementById('midi_status');
// navigator.permissions.query({ name: "midi", sysex: false }).then((result) => {
//     if (result.state === "granted") {
//         midi_status.innerText = "MIDI OK";
//         // Access granted.
//     } else if (result.state === "prompt") {
//         // Using API will prompt for permission
//         midi_status.innerText = "MIDI PROMPT";
//     }
//     midi_status.innerText = "MIDI DENIED";
//     // Permission was denied by user prompt or permission policy
// });

const midi_status = document.getElementById('midi_status');
let midi = null;
navigator.requestMIDIAccess().then((midi_) => {
    midi_status.innerText = "MIDI READY";
    midi = midi_;
}, (message) => {
    midi_status.innerText = `MIDI FAILURE - ${message}`;
});

const loop = () => {
    requestAnimationFrame(loop);
    draw.clear();
    draw.piano(0, 3);
    draw.piano(1, 2);
    draw.piano(2, 4);
};

loop();