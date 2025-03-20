import React from 'react';
import { X, IndianRupee } from 'lucide-react';

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
}

function PaymentModal({ show, onClose, onPaymentComplete }: PaymentModalProps) {
  if (!show) return null;

  // Generate UPI QR code URL
  const upiId = "vermatrading@fam";
  const amount = "1999.00";
  const qrCodeUrl = `upi://pay?pa=${upiId}&pn=Data%20Removal%20Service&am=${amount}&cu=INR`;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg shadow-xl max-w-md w-full border border-indigo-700/30">
        <div className="flex justify-between items-center p-6 border-b border-indigo-700/30">
          <h2 className="text-xl font-semibold text-indigo-200">Payment Required</h2>
          <button
            onClick={onClose}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-indigo-200 mb-2">
              <IndianRupee size={24} className="text-indigo-400" />
              <span>1,999</span>
            </div>
            <p className="text-indigo-300">
              One-time payment for data removal service
            </p>
          </div>

          <div className="bg-indigo-900/50 p-6 rounded-lg mb-6 border border-indigo-700/30">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-indigo-200 mb-2">Pay using UPI</h3>
              <p className="text-sm text-indigo-300 mb-4">
                Scan the QR code or use UPI ID: {upiId}
              </p>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="bg-white p-2 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                  alt="UPI QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-indigo-200 mb-1">UPI ID:</p>
              <p className="text-indigo-300 bg-indigo-800/50 p-2 rounded border border-indigo-700/30 select-all">
                {upiId}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={onPaymentComplete}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center justify-center gap-2 transition-colors"
            >
              I have completed the payment
            </button>
            <p className="text-xs text-center text-indigo-400">
              After payment confirmation, we will process your data removal request within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;