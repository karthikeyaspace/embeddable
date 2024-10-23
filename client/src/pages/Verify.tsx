import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/axios";
import t from "../components/Toast";

const Verify = () => {
  const [params, _] = useSearchParams();

  useEffect(() => {
    const verifyToken = params.get("token");
    const verify = async () => {
      const res = await api.post(`/verify/${verifyToken}`);
      if (res.data.success) {
        t("Account verified successfully", "success");
      }
    };
    verify();
  }, []);

  return null;
};

export default Verify;
