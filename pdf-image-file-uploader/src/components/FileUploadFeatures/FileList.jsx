// import React from "react";
// const FileList = ({ files, handleFilePreviewClick, deleteFile }) => {
//     return (
//         <div className="kb-attach-box">
//             <hr />
//             {files.map((data, index) => (
//                 <div className="file-atc-box" key={index}>
//                     {data.filetype === 'application/pdf' ?
//                         <div className="file-image" onClick={() => handleFilePreviewClick(data)}>PDF Preview</div>
//                         :
//                         <div className="file-image" onClick={() => handleFilePreviewClick(data)}>
//                             <img src={data.fileimage} alt="Preview" />
//                         </div>
//                     }
//                     <div className="file-detail">
//                         <h6>{data.filename}</h6>
//                         <p><span>Size : {data.filesize}</span><span className="ml-3">Modified Time : {data.datetime}</span></p>
//                         <div className="file-actions">
//                             <button className="file-action-btn" onClick={() => deleteFile(data.id)}>Delete</button>
//                             <a href={data.fileimage} className="file-action-btn" download={data.filename}>Download</a>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }
// export default FileList;

// FileList.js

import React from "react";

const FileList = ({ files, handleFilePreviewClick, deleteFile, handleFileEdit }) => {
    return (
        <div className="kb-attach-box">
            <hr />
            {files.map((data, index) => (
                <div className="file-atc-box" key={index}>
                    {data.filetype === 'application/pdf' ?
                        <div className="file-image" onClick={() => handleFilePreviewClick(data)}>PDF Preview</div>
                        :
                        <div className="file-image" onClick={() => handleFilePreviewClick(data)}>
                            <img src={data.fileimage} alt="Preview" />
                        </div>
                    }
                    <div className="file-detail">
                        <h6>{data.filename}</h6>
                        <p><span>Size : {data.filesize}</span><span className="ml-3">Modified Time : {data.datetime}</span></p>
                        <div className="file-actions">
                            <button className="file-action-btn" onClick={() => handleFileEdit(data)}>Edit</button>
                            <button className="file-action-btn" onClick={() => deleteFile(data.id)}>Delete</button>
                            <a href={data.fileimage} className="file-action-btn" download={data.filename}>Download</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FileList;
