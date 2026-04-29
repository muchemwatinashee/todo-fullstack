import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import client from "../api/client";
import type { ApiError, AuthPayload } from "../types";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AuthPayload>({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await client.post("/register", form);
      navigate("/login");
    } catch (err) {
      const ax = err as AxiosError<ApiError>;
      setError(ax.response?.data?.detail ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white shadow rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Register</h1>

        {error && (
          <div className="mt-4 text-sm rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-3">
          <label className="block">
            <span className="text-sm text-slate-700">Username</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.username}
              onChange={(e) =>
                setForm((prev: AuthPayload) => ({ ...prev, username: e.target.value }))
              }
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.password}
              onChange={(e) =>
                setForm((prev: AuthPayload) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 text-white py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}