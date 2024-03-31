import React from "react";
const FilePreview = ({ selectedFile, handleFilePreviewClick }) => {
    return (
        <div className="kb-attach-box mb-3">
            {selectedFile !== '' &&
                <div className="file-atc-box">
                    {selectedFile.filetype === 'application/pdf' ?
                        <div className="file-image" onClick={() => handleFilePreviewClick(selectedFile)}>PDF Preview</div>
                        :
                        <div className="file-image" onClick={() => handleFilePreviewClick(selectedFile)}>
                            <img src={selectedFile.fileimage} alt="Preview" />
                        </div>
                    }
                    <div className="file-detail">
                        <h6>{selectedFile.filename}</h6>
                        <p><span>Size : {selectedFile.filesize}</span><span className="ml-2">Modified Time : {selectedFile.datetime}</span></p>
                    </div>
                </div>
            }
        </div>
    );
}

export default FilePreview;
