import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ onScanSuccess }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Có thể log hoặc bỏ qua
      }
    );

    setTimeout(() => setLoading(false), 1000);

    return () => {
      scanner.clear().catch((err) => console.error("Clear error:", err));
    };
  }, [onScanSuccess]);

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl border border-gray-200 shadow-lg bg-white text-center">
      <h2 className="text-xl font-semibold mb-2">📷 Quét mã QR</h2>
      <p className="text-sm text-gray-500 mb-4">
        Đưa mã QR vào giữa khung camera để bắt đầu quét
      </p>

      {loading && (
        <div className="mb-3 text-blue-500 animate-pulse">
          🔄 Đang khởi động camera...
        </div>
      )}

      <div id="qr-reader" className="rounded-xl overflow-hidden" />
    </div>
  );
}

export default QRScanner;
