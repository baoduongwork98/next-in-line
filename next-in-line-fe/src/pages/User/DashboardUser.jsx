import QRScanner from "../../compoments/QRScanner";
const DashboardUser = () => {
  const handleScan = (data) => {
    alert("Scanned: " + data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Bốc số thứ tự
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Đưa mã QR vào giữa khung camera để bắt đầu quét
      </p>
      <QRScanner onScanSuccess={handleScan} />
    </div>
  );
};

export default DashboardUser;
