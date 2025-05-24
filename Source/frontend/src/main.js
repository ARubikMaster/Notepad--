import './style.css';
import './app.css';

import {SaveAs} from '../wailsjs/go/main/App';
import {Save} from '../wailsjs/go/main/App';
import {Open} from '../wailsjs/go/main/App';
import {OpenFolder} from '../wailsjs/go/main/App';

var file_path = '';

window.saveas = function() {
    var text = document.getElementById("text").value;

    SaveAs(text).then(path => {
        if (path) {
            file_path = path;
            document.getElementById("path").innerText = file_path;
            update(text);
        }
    }).catch(err => {
        console.error("SaveAs failed:", err);
        alert("Failed to save file");
    });
}

window.save = function() {
    var text = document.getElementById("text").value;

    Save(text, file_path).then(path => {
        if (path) {
            file_path = path;
            document.getElementById("path").innerText = file_path;
            update(text);
        }
    }).catch(err => {
        console.error("Save failed:", err);
        alert("Failed to save file");
    });
}

window.open_file = async function() {
    try {
        var result = await Open();
        document.getElementById("text").value = result.text;
        document.getElementById("path").innerText = result.path;
        file_path = result.path;
        update(result.text);
    }
    catch (err) {
        console.error("Open failed:", err);
        alert("Failed to open file: "+err);
    }
}

window.reveal = function() {
    if (file_path) {
        try {
            OpenFolder(file_path)
        }
        catch (err) {
            console.error("Reveal failed:", err);
            alert("Failed to reveal file: "+err);
        }
    } else {
        alert("No file path available to reveal.");
    }
}

window.new_file = function() {
    document.getElementById("text").value = '';
    file_path = '';
    document.getElementById("path").innerText = '*Unsaved';
    update('');
}

const textarea = document.getElementById("text");

textarea.addEventListener("input", (event) => {
    const currentValue = event.target.value;
    console.log("User edited textarea, current content:", currentValue);

    update(currentValue);
});

function update(text) {
    const parts = file_path.split(/[/\\]/);

    var fileName;

    if (file_path) {
        fileName = parts.pop();
    }
    else {
        fileName = "untitled";
    }

    const words = text.trim().split(/\s+/).filter(Boolean).length;

    document.getElementById("info").innerText = fileName + " - " + words + " words";
}

window.addEventListener("keydown", function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        save();
    }
});