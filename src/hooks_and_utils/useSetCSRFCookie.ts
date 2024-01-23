import { useEffect } from "react";
import useFetch from "./useFetch.js";
import { ProfilesAPI } from "../api";


const useSetCSRFCookie = (): void => {
    //@ts-ignore
    const { doFetch } = useFetch(ProfilesAPI + 'csrf/', { method: 'GET' });

    useEffect(() => {
        doFetch();
    }, []);
};


export default useSetCSRFCookie;