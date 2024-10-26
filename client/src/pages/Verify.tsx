import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../utils/axios";
import t from "../components/Toast";
import { setLs } from "../utils/localstorage";

const Verify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      const token = params.get("token");
      if (!token) {
        setError("Invalid token");
        setLoading(false);
        return;
      }

      try {
        const res = await api.post(`/verify/${token}`);
        if (res.data.success) {
          setLs("token", res.data.token);
          setLs("user_id", res.data.user_id);
          setLs("expires_at", res.data.expires_at);

          t("Email verified successfully", "success");
          navigate("/dashboard");
        } else {
          t(res.data.message || "Verification failed", "error");
          setError(res.data.message || "Verification failed");
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [navigate, params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Verifying your email...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">
            Verification Failed
          </h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/auth")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Verify;
