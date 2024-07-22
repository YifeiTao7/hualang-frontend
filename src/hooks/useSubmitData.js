import { useState, useCallback } from "react";
import axiosInstance from "api/axiosInstance";

const useSubmitData = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitData = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.post(url, data);
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "请求失败，请稍后再试。");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { loading, error, submitData };
};

export default useSubmitData;
