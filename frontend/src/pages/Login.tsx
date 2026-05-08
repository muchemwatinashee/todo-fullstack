import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import client from "../api/client";
import type { ApiError, AuthPayload, TokenResponse } from "../types";
import { Lock, Loader2 } from "lucide-react"; // Matching the icon style

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AuthPayload>({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await client.post<TokenResponse>("/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/protected");
    } catch (err) {
      const ax = err as AxiosError<ApiError>;
      setError(ax.response?.data?.detail ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-purple-100/40 w-full max-w-md border border-white">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-50 text-purple-500 rounded-2xl mb-4">
            <Lock size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Log in to Chantel's Checklist</p>
        </div>

        {error && (
          <div className="mb-6 text-sm rounded-2xl border border-red-100 bg-red-50 text-red-500 px-4 py-3 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all text-slate-700"
              value={form.username}
              onChange={(e) =>
                setForm((prev: AuthPayload) => ({ ...prev, username: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-purple-200 outline-none transition-all text-slate-700"
              value={form.password}
              onChange={(e) =>
                setForm((prev: AuthPayload) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-100 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Need an account?{" "}
          <Link to="/register" className="text-purple-600 font-bold hover:underline ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}