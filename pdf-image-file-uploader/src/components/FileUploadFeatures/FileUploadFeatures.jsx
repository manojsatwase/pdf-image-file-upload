import React, { useEffect, useState } from "react";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import FileInput from "./FileInput";
import FilePreview from "./FilePreview";
import FileList from "./FileList";
import "./FileUploadFeatures.css";

const FileUploadFeatures = () => {
    const [selectedFile, setSelectedFile] = useState('');
    const [files, setFiles] = useState([]);
    const [showIndicator, setShowIndicator] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [editingFile, setEditingFile] = useState(null); // State to store the file being edited
    const [isEditing, setIsEditing] = useState(false); // State to track if user is currently editing a file
    const [message, setMessage] = useState(''); // State to display messages

    useEffect(()=>{
      const timer = setTimeout(()=> {
       setMessage("");
      },5000)
      return () => clearTimeout(timer);
    },[message]);
 
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
        const file = e.target.files[0];
        if (file) {
            readFile(file);
        }
    };

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Check file size
            if (file.size > maxFileSize) {
                setErrorType('size');
                return;
            }

            // Check if the uploaded file is supported
            if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
                const newFile = {
                    id: shortid.generate(),
                    filename: file.name,
                    filetype: file.type,
                    fileimage: reader.result,
                    datetime: file.lastModifiedDate.toLocaleString("en-IN"),
                    filesize: fileSize(file.size),
                };
                
                // If editing a file, replace it with the new file
                if (editingFile) {
                    const updatedFiles = files.map(f => (f.id === editingFile.id ? newFile : f));
                    setFiles(updatedFiles);
                    setEditingFile(null); // Reset editing file state
                    setMessage('File updated successfully');
                } else {
                    setSelectedFile(newFile);
                    setMessage('');
                }
                setShowIndicator("green");
                setErrorType(null);
            } else {
                setShowIndicator("red");
                setErrorType('type');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleFilePreviewClick = (file) => {
        window.open(file.fileimage, '_blank');
    };

    const handleFileEdit = (file) => {
        setSelectedFile(file);
        setEditingFile(file); // Set the file being edited
        setIsEditing(true); // Set editing mode
        setMessage('Editing file: ' + file.filename);
    };

    const handleFileDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            setFiles(prevFiles => {
                const result = prevFiles.filter((data) => data.id !== id);
                setMessage('File deleted successfully');
                return result;
            });
        }
    };
    
    const handleFileUploadSubmit = (e) => {
        e.preventDefault();

        e.target.reset();
        if (selectedFile !== '' && !errorType) {
            // If editing a file, no need to add it again
            if (!editingFile) {
                setFiles((prevFiles) => [...prevFiles, selectedFile]);
                setMessage('File uploaded successfully');
            }
            setSelectedFile('');
            setShowIndicator(null);
            setErrorType(null);
            setIsEditing(false); // Exit editing mode after successful upload
        } else {
            if (errorType === 'size') {
                setMessage('Some selected files exceed the size limit of 500KB. Please select smaller files.');
            } else if (errorType === 'type') {
                setMessage('Some selected files have unsupported file types. Please select only PDF or image files.');
            } else {
                setMessage('Please select a file');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        let hasUnsupportedType = false;
        let hasExceededSize = false;
        Array.from(e.dataTransfer.items).forEach(item => {
            if (
                item.kind === 'file' && (
                    item.type !== 'application/pdf' &&
                    !item.type.startsWith('image/')
                )
            ) {
                hasUnsupportedType = true;
            }
            if (item.kind === 'file' && item.size > maxFileSize) {
                hasExceededSize = true;
            }
        });

        if (hasUnsupportedType && hasExceededSize) {
            setErrorType('both');
        } else if (hasUnsupportedType) {
            setErrorType('type');
        } else if (hasExceededSize) {
            setErrorType('size');
        } else {
            setErrorType(null);
        }

        if (!hasUnsupportedType && !hasExceededSize) {
            setShowIndicator('green');
        } else {
            setShowIndicator('red');
        }
    };

    const handleDragLeave = () => {
        setShowIndicator(null);
    };

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
                                    </div>
                                </div>
                                <form onSubmit={handleFileUploadSubmit}>
                                    <FileInput handleInputChange={handleInputChange} errorType={errorType} showIndicator={showIndicator} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave} />
                                    {message && <p>{message}</p>}
                                    {isEditing && <p>Please upload your edited images</p>}
                                    <FilePreview selectedFile={selectedFile} handleFilePreviewClick={handleFilePreviewClick} />
                                    <FileList files={files} handleFilePreviewClick={handleFilePreviewClick} deleteFile={handleFileDelete} handleFileEdit={handleFileEdit} />
                                    <div className="kb-buttons-box">
                                        <button type="submit" className="btn btn-primary form-submit">Upload</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUploadFeatures;