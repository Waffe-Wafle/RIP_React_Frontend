import React, { FC, memo } from "react";
import { Link } from "react-router-dom";


interface CurrentPathProps {
    links: [string, string][];
}


const CurrentPath: FC<CurrentPathProps> = memo(({ links }) => {
    return (
        <div className="BC mb-0">
            <p className="br_c">
                {links.map((link, index) => (
                    <React.Fragment key={index}>
                        <Link className="BC_link" to={link[1]}>
                            {link[0]}
                        </Link>
                        {index !== links.length - 1 && "/"}
                    </React.Fragment>
                ))}
            </p>
        </div>
    );
});


export default CurrentPath;
