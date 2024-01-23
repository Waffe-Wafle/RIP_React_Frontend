import {useEffect, useState} from "react";
import Cookies from "js-cookie";


const useFetch = (url, options = {}, callback = null, useMultipart=false) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reFetch, setReFetch] = useState(0)

    const doFetch = () => setReFetch(prev => prev + 1)

    const default_options = {
        method: 'POST',
        // withCredentials: true,
        credentials: 'include',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            let response;
            let text;
            try {
                setError(null);
                setLoading(true);

                const body = options.body ? (useMultipart ? options.body : JSON.stringify(options.body)) : undefined;
                response = await fetch(url,
                    {...default_options, ...options, body});

                text = await response.text()
                const _data =  text ? JSON.parse(text) : {}
                setData(_data);

                if (response.ok) {
                    if (callback !== null) callback(_data);
                    console.log('Response successful:', url, _data);
                } else {
                    const err = {code: response.status, status: response.statusText}
                    setError(err);
                    console.log('Response unsuccessful:', url, err);
                }
            } catch (_error) {
                setData({}); // important
                if (_error instanceof TypeError && _error.message === 'Failed to fetch') {
                    setError({code: 500, status: 'Сервер недоступен... Отображены mock-объекты'});
                    console.log('Server is not available');

                } else if (_error instanceof SyntaxError) {
                    console.log(text)
                    if (text.includes('Error occurred while trying to proxy') ||
                        text.includes("There isn't a GitHub Pages site here"))
                        setError({code: 500, status: 'Сервер недоступен... Отображены mock-объекты'});
                    else
                        setError({code: 500, status: 'Ошибка разбора JSON...'});
                    console.log('JSON parsing error');

                } else {
                    setError({code: -1, status: 'Веб приложение сломалось..'});
                    console.log(_error);
                }
            } finally { setLoading(false); }
        };
        if (reFetch) fetchData();
    }, [reFetch]);

    return {data, loading, error, doFetch};
};


export default useFetch;