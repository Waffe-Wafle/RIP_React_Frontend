import React, { FC, memo } from "react";


interface TitleProps {
    text: string;
    is_error?: boolean;
}


const Title: FC<TitleProps> = memo(({ text, is_error = false }: TitleProps) => {
    return (
        <span
            className={"bi bi-exclamation-circle " + (is_error ? 'text-danger' : '')}
            style={{ fontSize: "2rem", marginBottom: "1rem" }}
        >
      {text}
    </span>
    );
});


export default Title;