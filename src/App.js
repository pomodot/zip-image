import React, { useRef, useState } from "react";
import JSZip from "jszip";
import { Button } from "semantic-ui-react";

import "./App.css";

function App() {
    const images = useRef();
    const selectButton = useRef();
    const fileInput = useRef();

    const [logs, setLogs] = useState([]);
    const [showLogs, toggleLogs] = useState(false);
    const handleLogsButton = () => {
        toggleLogs(!showLogs);
    };

    const handleSelectButton = () => {
        clog("Select button clicked!");
        fileInput.current.click();
    };

    const clog = (message) => {
        logs.push(message);
        setLogs([].concat(logs));
    };

    const handleFile = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            clog("File not selected!");
            return;
        }
        clog("File selected!");
        if (selectedFile.type !== "application/x-zip-compressed") {
            clog("Selected file is not a zip file! type: " + selectedFile.type);
            return;
        }
        images.current.innerHTML = "";
        clog("Images empting...");

        const zip = await JSZip.loadAsync(selectedFile);
        clog("Loading images...");
        for (const name in zip.files) {
            if (Object.hasOwnProperty.call(zip.files, name)) {
                const blob = await zip.file(name).async("blob");
                const image = new Image();
                image.src = URL.createObjectURL(blob);
                images.current.appendChild(image);
            }
        }
        clog("Loading completed!");
    };

    return (
        <div className="App">
            <input ref={fileInput} type="file" hidden onChange={handleFile} />
            <Button
                ref={selectButton}
                onClick={handleSelectButton}
                primary
                content="Select .zip File"
            />
            <Button onClick={handleLogsButton} primary content="Logs" />
            <div className="Logs">
                {showLogs && logs.map((log) => <div>{log}</div>)}
            </div>
            <div className="ImageViewer" ref={images}></div>
        </div>
    );
}

export default App;
