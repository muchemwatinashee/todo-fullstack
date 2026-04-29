import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import client from "../api/client";
import type { ProtectedResponse } from "../types";

export default function Protected() {
  const navigate = useNavigate();
  const [data, setData] = useState<ProtectedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        const res = await client.get<ProtectedResponse>("/protected");
        if (active) setData(res.data);
      } catch (err) {
        const ax = err as AxiosError;
        if (ax.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }
        if (active) setError("Protected check failed.");
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Protected</h1>
          <button
            onClick={logout}
            className="text-sm rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>

        <div className="bg-white shadow rounded-2xl p-6">
          {loading && <p className="text-sm text-slate-600">Checking token...</p>}
          {!loading && error && <p className="text-sm text-red-700">{error}</p>}
          {!loading && data && (
            <>
              <p className="font-medium text-slate-800">{data.message}</p>
              <p className="text-sm text-slate-600 mt-1">
                Username: <span className="font-medium">{data.username}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}