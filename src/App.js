import React, { useRef } from "react";
import JSZip from "jszip";
import { Button } from "semantic-ui-react";

import "./App.css";

function App() {
    const images = useRef();
    const selectButton = useRef();
    const fileInput = useRef();

    const handleSelectButton = () => {
        fileInput.current.click();
    };

    const handleFile = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile.type !== "application/x-zip-compressed") return;
        images.current.innerHTML = "";
        const zip = await JSZip.loadAsync(selectedFile);
        for (const name in zip.files) {
            if (Object.hasOwnProperty.call(zip.files, name)) {
                const blob = await zip.file(name).async("blob");
                const image = new Image();
                image.src = URL.createObjectURL(blob);
                images.current.appendChild(image);
            }
        }
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
            <div className="ImageViewer" ref={images}></div>
        </div>
    );
}

export default App;
