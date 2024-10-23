import { axiosInstance } from "@/Utils/axios";
import { useState, useEffect } from "react";

const useFetch = (url, defaultValue = [], method = "GET", body = null) => {
    const [data, setData] = useState(defaultValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            let response;
            if (method === "POST" && body) {
                response = await axiosInstance.post(url, body);
            } else {
                response = await axiosInstance.get(url);
            }

            if (response.data) {
                setData(response.data); // If the response is an array, set the data
            } else {
                setData(defaultValue); // If not, ensure that it's an empty array to maintain an iterable state
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            console.log("Error: ", err.message);
            setData(defaultValue);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;
