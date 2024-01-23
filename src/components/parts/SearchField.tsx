import React, { FC, useState } from "react";
import { Button } from "react-bootstrap";

interface SearchFieldProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    onSubmit: () => void;
    buttonTitle: string;
}

const SearchField: FC<SearchFieldProps> = ({ value, setValue, loading, onSubmit, buttonTitle }: SearchFieldProps) => {
    return (
        <div className="d-flex inputField">
            <input value={value} placeholder="Enter search text" onChange={(event) => setValue(event.target.value)} />
            <Button disabled={loading} onClick={onSubmit}>
                {buttonTitle}
            </Button>
        </div>
    );
};

export default SearchField;
