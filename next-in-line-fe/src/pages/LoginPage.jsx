import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);
    if (email === "admin") {
      // Redirect to the admin dashboard
      navigate("/dashboard", { replace: true });
    } else navigate("/welcome", { replace: true });
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Đăng nhập tài khoản
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border text-black border-green-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border text-black border-green-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-green-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-green-500" />
              <span>Ghi nhớ tôi</span>
            </label>
            <a href="#" className="hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-green-700">
          Chưa có tài khoản?{" "}
          <a href="#" className="font-medium underline hover:text-green-800">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
