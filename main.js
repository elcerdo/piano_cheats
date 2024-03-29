class Draw {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.origin_xx = 10;
        this.origin_yy = 17;
        this.text_spacing = 2;
        this.grid_size = 10;
        this.row_spacing = 120;
        this.label_to_datas = {};
        this.dark_mode = "querySelector" in document &&
            !!document.querySelector("meta[name=darkreader]");
        this.text_color = this.dark_mode ? 'white' : 'black';
        console.log(`dark_mode ${this.dark_mode} text_color ${this.text_color}`);
        this.chord_to_names = {
            CEG: "I",
            CEbG: "i",
            AbDbF: "IIb",
            ADGb: "II",
            ADF: "ii",
            AbBE: "III",
            BEG: "iii",
            ACF: "IV",
            AbCF: "iv",
            BDG: "V",
            BbDG: "v",
            ADbE: "VI",
            ACE: "vi",
            BEbGb: "VII",
            BDGb: "vii",
        };
        this.latest_valid_data = null;
    }

    clear() {
        // this.context.fillStyle = '#ffffff00';
        // this.context.fillStyle = 'green';
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    piano(row_offset, num_octaves, include_next_note = true, override_color = null) {
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
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = 'white';
                    if (ll in this.label_to_datas) {
                        const data = this.label_to_datas[ll];
                        ctx.fillStyle = data.octave == kk + 4 ? data.self_color : data.other_color;
                        if (override_color) ctx.fillStyle = override_color;
                    }
                    ctx.fillRect(cur_xx, spc_yy, width, height);
                    ctx.strokeRect(cur_xx, spc_yy, width, height);
                    ctx.fillStyle = this.text_color;
                    ctx.fillText(ll, cur_xx + width / 2, spc_yy + height + this.text_spacing);
                    cur_xx += width;
                }
            if (include_next_note) {
                const kk = num_octaves;
                const ll = "C";
                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'white';
                if (ll in this.label_to_datas) {
                    const data = this.label_to_datas[ll];
                    ctx.fillStyle = data.octave == kk + 4 ? data.self_color : data.other_color;
                    if (override_color) ctx.fillStyle = override_color;
                }
                ctx.fillRect(cur_xx, spc_yy, width, height);
                ctx.strokeRect(cur_xx, spc_yy, width, height);
                ctx.fillStyle = this.text_color;
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
                    if (ll in this.label_to_datas) {
                        const data = this.label_to_datas[ll];
                        ctx.fillStyle = data.octave == kk + 4 ? data.self_color : data.other_color;
                        if (override_color) ctx.fillStyle = override_color;
                    }
                    ctx.fillRect(cur_xx, spc_yy, width, height);
                    ctx.strokeRect(cur_xx, spc_yy, width, height);
                    ctx.fillStyle = this.text_color;
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

    update_latest_valid_chord() {
        let labels = [];
        for (const ll in this.label_to_datas) labels.push(ll);
        labels.sort();
        let chord = '';
        for (const ll of labels) chord += ll;
        let chord_name = labels.length < 3 ? "" : "??";
        if (chord in this.chord_to_names) {
            chord_name = this.chord_to_names[chord];
            this.latest_valid_data = {
                name: chord_name,
                chord: chord,
            };
        } else if (labels.length >= 3)
            this.latest_valid_data = {
                name: "??",
                chord: chord,
            };
        return [chord, chord_name];
    }

    chord_label(xx, yy) {
        const [chord, chord_name] = this.update_latest_valid_chord();
        let ctx = this.context;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = this.text_color;
        ctx.font = '40px sans-serif';
        ctx.fillText(chord, xx, yy);
        ctx.font = '60px sans-serif';
        ctx.fillText(chord_name, xx, yy + 40);
    }
};

///////

const canvas = document.getElementById('piano_canvas');
const backlog_container = document.getElementById('backlog_container');
const midi_status = document.getElementById('midi_status');
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

navigator.requestMIDIAccess().then((midi) => {
    midi_status.innerText = "MIDI READY";

    // list inputs
    for (const entry of midi.inputs) {
        const input = entry[1];
        console.log(
            `Input port [type:'${input.type}']` +
            ` id:'${input.id}'` +
            ` manufacturer:'${input.manufacturer}'` +
            ` name:'${input.name}'` +
            ` version:'${input.version}'`,
        );
    }

    // list outputs
    for (const entry of midi.outputs) {
        const output = entry[1];
        console.log(
            `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
        );
    }

    // register handle lambda
    const note_labels = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const handle_message = (event) => {
        if (event.data.length == 3 && event.data[0] == 0x80) { // note off
            const note = event.data[1];
            const velocity = event.data[2];
            const label = note_labels[note % note_labels.length];
            console.log(`NOTEOFF note ${note} vel ${velocity} label ${label}`);
            delete draw.label_to_datas[label];
            const is_empty = Object.keys(draw.label_to_datas).length == 0;
            if (is_empty) {
                console.log("banco", draw.latest_valid_data);
                const node = document.createElement("div");
                node.innerText = draw.latest_valid_data ? `${draw.latest_valid_data.name} ${draw.latest_valid_data.chord}` : '??';
                backlog_container.prepend(node);
                while (backlog_container.childElementCount > 8)
                    backlog_container.removeChild(backlog_container.lastChild);
            }
            return;
        }
        if (event.data.length == 3 && event.data[0] == 0x90) { // note on
            const note = event.data[1];
            const velocity = event.data[2];
            const label = note_labels[note % note_labels.length];
            const octave = Math.floor(note / note_labels.length);
            console.log(`NOTEON note ${note} vel ${velocity} label ${label} octave ${octave}`);
            draw.label_to_datas[label] = {
                other_color: '#aaa',
                self_color: '#f00',
                octave: octave,
            };
            return;
        }
        if (event.data.length == 3 && event.data[0] == 0xb0 && event.data[1] == 0x33 && event.data[2] == 0x7f) { // stop
            console.log("STOP");
            draw.label_to_datas = {};
            return;
        }
        let str = `!!! MIDI timestamp ${event.timeStamp} [${event.data.length} bytes]: `;
        for (const character of event.data) {
            str += `0x${character.toString(16)} `;
        }
        console.log(str);
    };

    midi.inputs.forEach((entry) => {
        entry.onmidimessage = handle_message;
    });
}, (message) => {
    midi_status.innerText = `MIDI FAILURE - ${message}`;
});

const loop = () => {
    requestAnimationFrame(loop);
    draw.clear();
    draw.piano(0, 3);
    draw.piano(1, 1, true, '#ee0');
    draw.chord_label(280, 127);
};

loop();
