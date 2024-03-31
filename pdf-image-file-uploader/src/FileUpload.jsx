import React, { useState } from "react";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import "./App.css";

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState('');
    const [files, setFiles] = useState([]);
    const [showIndicator, setShowIndicator] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const maxFileSize = 500 * 1024; // 500KB

    const fileSize = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const handleInputChange = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
            // Check file size
            if (file.size > maxFileSize) {
                setErrorType('size');
                return;
            }

            // Check if the uploaded file is supported (e.g., .ppt or .pdf)
            if (
                file.type === "application/pdf" ||
                file.type === "application/vnd.ms-powerpoint" ||
                file.type ===
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ) {
                setSelectedFile({
                    id: shortid.generate(),
                    filename: file.name,
                    filetype: file.type,
                    fileimage: reader.result,
                    datetime: file.lastModifiedDate.toLocaleString("en-IN"),
                    filesize: fileSize(file.size),
                });
                setShowIndicator("green"); // Supported file type
                setErrorType(null); // Reset error type
            } else {
                setShowIndicator("red"); // Unsupported file type
                setErrorType('type'); // Set error type
            }
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    

    const handleFileUploadSubmit = async (e) => {
        e.preventDefault();

        e.target.reset();
        if (selectedFile !== '' && !errorType) {
            setFiles((prevFiles) => [...prevFiles, selectedFile]);
            setSelectedFile('');
            setShowIndicator(null); // Reset indicator visibility after upload
            setErrorType(null); // Reset error type
        } else {
            if (errorType === 'size') {
                alert('Some selected files exceed the size limit of 500KB. Please select smaller files.');
            } else if (errorType === 'type') {
                alert('Some selected files have unsupported file types. Please select only PDF or PowerPoint files.');
            } else {
                alert('Please select file');
            }
        }
    }

    const deleteFile = async (id) => {
        if(window.confirm("Are you sure you want to delete this Image?")){
            const result = files.filter((data) => data.id !== id);
            setFiles(result);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        let hasUnsupportedType = false;
        let hasExceededSize = false;
        Array.from(e.dataTransfer.items).forEach(item => {
            // Check if any of the dragged files is unsupported type
            if (
                item.kind === 'file' && (
                    item.type !== 'application/pdf' &&
                    item.type !== 'application/vnd.ms-powerpoint' &&
                    item.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                )
            ) {
                hasUnsupportedType = true;
            }

            // Check if any of the dragged files exceeds size limit
            if (item.kind === 'file' && item.size > maxFileSize) {
                hasExceededSize = true;
            }
        });

        // Set error type based on conditions
        if (hasUnsupportedType && hasExceededSize) {
            setErrorType('both');
        } else if (hasUnsupportedType) {
            setErrorType('type');
        } else if (hasExceededSize) {
            setErrorType('size');
        } else {
            setErrorType(null);
        }

        // Set the indicator color based on file type support
        if (!hasUnsupportedType && !hasExceededSize) {
            setShowIndicator('green'); // Supported file type
        } else {
            setShowIndicator('red'); // Unsupported file type
        }
    }

    const handleDragLeave = () => {
        setShowIndicator(null); // Hide indicator when file is dragged away
    }

    return (
        <div className="fileupload-view">
            <div className="row justify-content-center m-0">
                <div className="col-md-6">
                    <div className="card mt-5">
                        <div className="card-body">
                            <div className="kb-data-box">
                                <div className="kb-modal-data-title">
                                    <div className="kb-data-title">
                                        <h6>Single File Upload With Preview</h6>
                                        <p>Some selected files have unsupported file types. Please select only PDF or PowerPoint files.</p>
                                        <p>Some selected files exceed the size limit of 500KB. Please select smaller files.</p>
                                    </div>
                                </div>
                                <form onSubmit={handleFileUploadSubmit}>
                                    <div
                                        className="kb-file-upload"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        style={{ border: showIndicator ? '1px solid ' + showIndicator : '1px dashed #ddd' }}
                                    >
                                        <div className="file-upload-box">
                                            <input type="file" id="fileupload" accept=".pdf,ppt" className="file-upload-input" onChange={handleInputChange} />
                                            <span>Drag and drop or <span className="file-link">Choose your file</span></span>
                                        </div>
                                    </div>
                                    {errorType && (
                                        <div style={{ color: 'red' }}>
                                            {errorType === 'type' && 'Some selected files have unsupported file types. Please select only PDF or PowerPoint files.'}
                                            {errorType === 'size' && 'Some selected files exceed the size limit of 500KB. Please select smaller files.'}
                                            {errorType === 'both' && 'Some selected files have unsupported file types and exceed the size limit of 500KB. Please select smaller and supported files.'}
                                        </div>
                                    )}
                                    <div className="kb-attach-box mb-3">
                                        {selectedFile !== '' ?
                                            <div className="file-atc-box">
                                                {selectedFile.filename.match(/.(pdf|ppt)$/i) ?
                                                    <div className="file-image"> <img src={selectedFile.fileimage} alt="" /></div> :
                                                    <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                }
                                                <div className="file-detail">
                                                    <h6>{selectedFile.filename}</h6>
                                                    <p><span>Size : {selectedFile.filesize}</span><span className="ml-2">Modified Time : {selectedFile.datetime}</span></p>
                                                </div>
                                            </div>
                                            : ''}
                                    </div>
                                    <div className="kb-buttons-box">
                                        <button type="submit" className="btn btn-primary form-submit">Upload</button>
                                    </div>
                                </form>
                                {files.length > 0 ?
                                    <div className="kb-attach-box">
                                        <hr />
                                        {files.map((data, index) => {
                                            const { id, filename, fileimage, datetime, filesize } = data;

                                            return (
                                                <div className="file-atc-box" key={index}>
                                                    {filename.match(/.(pdf|ppt)$/i) ?
                                                        <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                        <div className="file-image"><i className="far fa-file-alt"></i></div>
                                                    }
                                                    <div className="file-detail">
                                                        <h6>{filename}</h6>
                                                        <p><span>Size : {filesize}</span><span className="ml-3">Modified Time : {datetime}</span></p>
                                                        <div className="file-actions">
                                                            <button className="file-action-btn" onClick={() => deleteFile(id)}>Delete</button>
                                                            <a href={fileimage} className="file-action-btn" download={filename}>Download</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUpload;
