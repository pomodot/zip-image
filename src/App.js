import React, { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import { Button } from "semantic-ui-react";

import "./App.css";

function App() {
    const zipTypes = [
        "application/zip",
        "application/octet-stream",
        "application/x-zip-compressed",
        "multipart/x-zip",
    ];
    const images = useRef();
    const popup = useRef();
    const selectButton = useRef();
    const fileInput = useRef();
    const [loc, setLoc] = useState(window.location.href);
    const [showPopup, togglePopup] = useState(false);

    useEffect(() => {
        if (loc.includes("##")) {
            window.location.href = window.location.href.split("#")[0];
        } else if (loc.includes("#")) {
            if (window.location.href.split("#")[1]) {
                setLoc(window.location.href.split("#")[0]);
            }
        } else if (loc.includes("-close")) {
            setLoc(window.location.href.split("#")[0] + "#");
        }
    }, [loc]);

    const [timer, setTimer] = useState(Date.now());
    const [toggleTimer, setToggleTimer] = useState(setTimeout(() => {}, 0));

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

    const checkZipType = (type) => {
        return zipTypes.indexOf(type) === -1;
    };

    const handleFile = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            clog("File not selected!");
            return;
        }
        clog("File selected!");

        if (checkZipType(selectedFile.type)) {
            clog("Selected file is not a zip file!");
            clog(" type: " + selectedFile.type);
            return;
        }
        clog("File is a zip archive!");

        images.current.innerHTML = "";
        clog("Images empting...");

        const zip = await JSZip.loadAsync(selectedFile);
        clog("Loading images...");
        for (const name in zip.files) {
            if (Object.hasOwnProperty.call(zip.files, name)) {
                const blob = await zip.file(name).async("blob");
                const image = new Image();
                image.setAttribute("key", name);
                image.src = URL.createObjectURL(blob);

                image.onclick = (e) => {
                    togglePopup(!showPopup);

                    const popupImage = new Image();
                    popupImage.src = URL.createObjectURL(blob);
                    popup.current.innerHTML = "";
                    popup.current.appendChild(popupImage);

                    window.location.href = loc + "#" + name;
                };
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
                {showLogs &&
                    logs.map((log, i) => <div key={"log-" + i}>{log}</div>)}
            </div>
            <div className="ImageViewer" ref={images}></div>
            {showPopup && (
                <div
                    className="ImagePopup"
                    ref={popup}
                    onClick={() => {
                        if (Date.now() < timer + 200) {
                            clearTimeout(toggleTimer);
                        } else {
                            setToggleTimer(
                                setTimeout(() => {
                                    togglePopup(!showPopup);
                                    setLoc(
                                        window.location.href.split("#")[0] +
                                            "-close"
                                    );
                                }, 200)
                            );
                        }
                        setTimer(Date.now());
                    }}
                ></div>
            )}
            {showPopup && (
                <Button
                    className="ImagePopupClose"
                    content="X"
                    negative
                    onClick={() => {
                        togglePopup(!showPopup);
                        setLoc(window.location.href.split("#")[0] + "-close");
                    }}
                />
            )}
        </div>
    );
}

export default App;
