import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";


const useFetch = (url, options = {}, callback = null) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reFetch, setReFetch] = useState(0)

    const doFetch = () => setReFetch(prev => prev + 1)

    const default_options = {
        method: 'POST',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            let response;
            try {
                setError(null);
                setLoading(true);

                const body = options.data ? options.data : undefined;
                response = await axios(url,
                    {...default_options, ...options, body});

                const _data =  response.data ? response.data : {}
                setData(_data);

                if (callback !== null) callback(_data);
                console.log('Response successful:', url, _data);
                // setLoading(false);

            } catch (error) {
                setData({})
                if (axios.isAxiosError(error)) {
                    setError(error);
                    console.log('Response unsuccessful:', url, error);
                } else {
                    setError({response: {status: -1, statusText: 'Веб приложение сломалось..'}});
                    console.log(error);
                }
            } finally { setLoading(false); }
        };
        if (reFetch) fetchData();
    }, [reFetch]);

    return {data, loading, error, doFetch};
};


export default useFetch;