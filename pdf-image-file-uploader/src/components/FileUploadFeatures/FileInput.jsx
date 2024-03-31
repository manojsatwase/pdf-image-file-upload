import React from "react";
const FileInput = ({ handleInputChange, errorType, showIndicator, handleDragOver, handleDragLeave }) => {
    return (
        <div>
            <div
                className="kb-file-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave} // Add onDragLeave event handler
                style={{ border: showIndicator ? '1px solid ' + showIndicator : '1px dashed #ddd' }}
            >
                <div className="file-upload-box">
                    <input type="file" id="fileupload" accept=".pdf,image/*" className="file-upload-input" onChange={handleInputChange} />
                    <span>Drag and drop or <span className="file-link">Choose your file</span></span>
                </div>
            </div>
            {errorType && (
                <div style={{ color: 'red' }}>
                    {errorType === 'type' && 'Some selected files have unsupported file types. Please select only PDF or image files.'}
                    {errorType === 'size' && 'Some selected files exceed the size limit of 500KB. Please select smaller files.'}
                    {errorType === 'both' && 'Some selected files have unsupported file types and exceed the size limit of 500KB. Please select smaller and supported files.'}
                </div>
            )}
        </div>
    );
}

export default FileInput;