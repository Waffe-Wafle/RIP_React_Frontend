import React, { memo, FC, MouseEvent } from "react";
import { Button } from "react-bootstrap";
import { SoftAPI } from "../../api";

interface FileCardProps {
    file: {
        size: string;
        platform: string;
        architecture: string;
        id: string; // Assuming 'id' is a string, update as needed
    };
    saveEnabled: boolean;
    deleteEnabled: boolean;
    handleDelete: Function;
}

const FileCard: FC<FileCardProps> = memo(({ file, saveEnabled, deleteEnabled, handleDelete }) => {
    return (
        <div className="file-card">
            <div className="file-details d-flex align-center">
                <b>{file.size}</b>
                <b>{file.platform}</b>
                <b>{file.architecture}</b>
            </div>
            {!(saveEnabled || deleteEnabled) ? (
                ''
            ) : (
                <div className="buttons flex-column  flex-sm-row ml-10">
                    {!saveEnabled ? (
                        ''
                    ) : (
                        <Button className="download-button" href={SoftAPI + `files/${file.id}`}>
                            Скачать
                        </Button>
                    )}
                    {!deleteEnabled ? (
                        ''
                    ) : (
                        //@ts-ignore
                        <Button variant="danger" onClick={handleDelete}>
                            Удалить
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
});

export default FileCard;
