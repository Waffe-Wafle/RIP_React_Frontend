import { useEffect } from "react";
import useFetch from "./useFetch";
import { ProfilesAPI } from "../api";


const useSetCSRFCookie = (): void => {
    const { doFetch } = useFetch(ProfilesAPI + 'csrf/', { method: 'GET' });

    useEffect(() => {
        doFetch();
    }, []);
};


export default useSetCSRFCookie;