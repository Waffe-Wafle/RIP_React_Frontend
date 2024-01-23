import React, {FC, memo } from "react";
import { Button } from "react-bootstrap";
import { SoftAPI } from "../../api";


interface FileCardProps {
    file: {
        size: string;
        platform: string;
        architecture: string;
        id: string;
    };

    saveEnabled: boolean;
}


const FileCard: FC<FileCardProps> = memo(({ file, saveEnabled }) => {
    return (
        <div className="file-card">
            <div className="file-details d-flex align-center ">
                <b>{file.size}</b>
                <b>{file.platform}</b>
                <b>{file.architecture}</b>
            </div>

            <div className="buttons flex-column  flex-sm-row ml-10">
                {!saveEnabled ? '' :
                    <Button className="download-button" href={SoftAPI + `files/${file.id}`}>
                        Скачать
                    </Button>
                }
            </div>
        </div>
    );
});


export default FileCard;
