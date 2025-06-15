import React, { useState } from "react";

const subscriptionOptions = [
  { label: "Trial (7 days)", value: "TRIAL", durationDays: 7, hasVps: false },
  { label: "Regular (30 days)", value: "REGULAR", durationDays: 30, hasVps: true },
  { label: "Premium (90 days)", value: "PREMIUM", durationDays: 90, hasVps: true },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    otpSent: false,
    otpVerified: false,
    agreedToDocuments: false,
    mobileNumber: "",
    idCardFile: null as File | null,
    mt5Account: {
      brokerName: "",
      serverName: "",
      accountId: "",
      passcode: "",
      asset: "GOLD",
      minDeposit: 5000,
      isDemo: false,
    },
    subscription: {
      type: "TRIAL",
      durationDays: 7,
      hasVps: false,
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    if (name.startsWith("mt5Account.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        mt5Account: {
          ...prev.mt5Account,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("subscription.")) {
      const key = name.split(".")[1];
      let val: any = value;
      if (key === "type") {
        const option = subscriptionOptions.find((opt) => opt.value === value);
        if (option) {
          setFormData((prev) => ({
            ...prev,
            subscription: {
              type: option.value,
              durationDays: option.durationDays,
              hasVps: option.hasVps,
            },
          }));
          return;
        }
      }
      setFormData((prev) => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          [key]: val,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function sendOtp() {
    if (!formData.email) {
      setError("Please enter your email to receive OTP");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send OTP");
      }
      setFormData((prev) => ({ ...prev, otpSent: true }));
      setSuccessMessage("OTP sent to your email. Please check your inbox.");
    } catch (error: any) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function validateStep() {
    if (step === 1) {
      if (!formData.email) {
        setError("Please enter your email");
        return false;
      }
      if (!formData.otpSent) {
        setError("Please send OTP to your email");
        return false;
      }
      if (!formData.otp) {
        setError("Please enter the OTP");
        return false;
      }
      if (!formData.otpVerified) {
        setError("Please verify the OTP");
        return false;
      }
    } else if (step === 2) {
      if (!formData.agreedToDocuments) {
        setError("You must agree to the documents to continue");
        return false;
      }
    } else if (step === 3) {
      if (
        !formData.mt5Account.brokerName ||
        !formData.mt5Account.serverName ||
        !formData.mt5Account.accountId ||
        !formData.mt5Account.passcode ||
        !formData.mobileNumber ||
        !formData.idCardFile
      ) {
        setError("Please fill all required fields and upload your ID card");
        return false;
      }
    }
    setError(null);
    return true;
  }

  function handleNext() {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setStep((prev) => prev - 1);
  }

  async function verifyOtp() {
    if (!formData.otp) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:4000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "OTP verification failed");
      }
      setFormData((prev) => ({ ...prev, otpVerified: true }));
      setSuccessMessage("OTP verified successfully.");
    } catch (error: any) {
      setError(error.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, idCardFile: file }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMessage("Registration successful! Please check your email for further instructions.");
      setStep(4);
    } catch (err) {
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-black rounded-lg shadow-lg mt-12">
      <h1 className="text-4xl font-extrabold mb-8">Sign Up</h1>

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-semibold mb-2 text-lg">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          {!formData.otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="py-4 px-8 bg-black text-white rounded-md hover:bg-gray-900 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}
          {formData.otpSent && (
            <>
              <div>
                <label htmlFor="otp" className="block font-semibold mb-2 text-lg">Enter OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              {!formData.otpVerified && (
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading}
                  className="py-4 px-8 bg-black text-white rounded-md hover:bg-gray-900 transition"
                >
                  {loading ? "Verifying OTP..." : "Verify OTP"}
                </button>
              )}
              {formData.otpVerified && (
                <p className="text-green-600 font-semibold">OTP verified successfully.</p>
              )}
            </>
          )}
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Documents Agreement</h2>
          <p className="mb-6 text-lg">Please read and agree to the following documents before continuing:</p>
          <ul className="list-disc list-inside mb-6 space-y-2 text-lg">
            <li>Terms and Conditions</li>
            <li>Privacy Policy</li>
            <li>Risk Disclosure</li>
          </ul>
          <label className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              name="agreedToDocuments"
              checked={formData.agreedToDocuments}
              onChange={handleChange}
              className="mr-3 w-5 h-5"
              required
            />
            I have read and agree to the documents
          </label>
          <div className="mt-8 flex justify-between">
            <button type="button" onClick={handleBack} className="py-3 px-6 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              Back
            </button>
            <button type="submit" className="py-3 px-6 bg-black text-white rounded-md hover:bg-gray-900 transition">
              Next
            </button>
          </div>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">MT5 Account & Subscription</h2>
          <div>
            <label htmlFor="brokerName" className="block font-semibold mb-2 text-lg">Broker Name</label>
            <input
              id="brokerName"
              name="mt5Account.brokerName"
              type="text"
              value={formData.mt5Account.brokerName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="serverName" className="block font-semibold mb-2 text-lg">Server Name</label>
            <input
              id="serverName"
              name="mt5Account.serverName"
              type="text"
              value={formData.mt5Account.serverName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="accountId" className="block font-semibold mb-2 text-lg">Account ID</label>
            <input
              id="accountId"
              name="mt5Account.accountId"
              type="text"
              value={formData.mt5Account.accountId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="passcode" className="block font-semibold mb-2 text-lg">Account Passcode</label>
            <input
              id="passcode"
              name="mt5Account.passcode"
              type="password"
              value={formData.mt5Account.passcode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="asset" className="block font-semibold mb-2 text-lg">Asset</label>
            <select
              id="asset"
              name="mt5Account.asset"
              value={formData.mt5Account.asset}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="GOLD">Gold</option>
              <option value="BITCOIN">Bitcoin</option>
            </select>
          </div>
          <div>
            <label htmlFor="minDeposit" className="block font-semibold mb-2 text-lg">Minimum Deposit ($)</label>
            <input
              id="minDeposit"
              name="mt5Account.minDeposit"
              type="number"
              min={5000}
              value={formData.mt5Account.minDeposit}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center text-lg">
              <input
                type="checkbox"
                name="mt5Account.isDemo"
                checked={formData.mt5Account.isDemo}
                onChange={handleChange}
                className="mr-3 w-5 h-5"
              />
              Demo Account
            </label>
          </div>
          <div>
            <label htmlFor="mobileNumber" className="block font-semibold mb-2 text-lg">Mobile Number</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="idCard" className="block font-semibold mb-2 text-lg">Upload ID Card</label>
            <input
              id="idCard"
              name="idCard"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            {formData.idCardFile && (
              <p className="mt-2 text-sm text-gray-600">File ready for upload: {formData.idCardFile.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="subscriptionType" className="block font-semibold mb-2 text-lg">Subscription Type</label>
            <select
              id="subscriptionType"
              name="subscription.type"
              value={formData.subscription.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              {subscriptionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-4 px-8 bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!formData.mt5Account.brokerName || !formData.mt5Account.serverName || !formData.mt5Account.accountId || !formData.mt5Account.passcode) {
              setError("Please fill all MT5 account fields");
              return;
            }
            setLoading(true);
            setError(null);
            try {
              const response = await fetch("http://localhost:4000/api/validate-mt5-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  brokerName: formData.mt5Account.brokerName,
                  serverName: formData.mt5Account.serverName,
                  accountId: formData.mt5Account.accountId,
                  passcode: formData.mt5Account.passcode,
                }),
              });
              if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Invalid MT5 account credentials");
              }
              setSuccessMessage("MT5 account validated successfully.");
              setStep(4);
            } catch (error: any) {
              setError(error.message || "Failed to validate MT5 account");
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold mb-6">MT5 Account & Subscription</h2>
          <div>
            <label htmlFor="brokerName" className="block font-semibold mb-2 text-lg">Broker Name</label>
            <input
              id="brokerName"
              name="mt5Account.brokerName"
              type="text"
              value={formData.mt5Account.brokerName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="serverName" className="block font-semibold mb-2 text-lg">Server Name</label>
            <input
              id="serverName"
              name="mt5Account.serverName"
              type="text"
              value={formData.mt5Account.serverName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="accountId" className="block font-semibold mb-2 text-lg">Account ID</label>
            <input
              id="accountId"
              name="mt5Account.accountId"
              type="text"
              value={formData.mt5Account.accountId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="passcode" className="block font-semibold mb-2 text-lg">Account Passcode</label>
            <input
              id="passcode"
              name="mt5Account.passcode"
              type="password"
              value={formData.mt5Account.passcode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="asset" className="block font-semibold mb-2 text-lg">Asset</label>
            <select
              id="asset"
              name="mt5Account.asset"
              value={formData.mt5Account.asset}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="GOLD">Gold</option>
              <option value="BITCOIN">Bitcoin</option>
            </select>
          </div>
          <div>
            <label htmlFor="minDeposit" className="block font-semibold mb-2 text-lg">Minimum Deposit ($)</label>
            <input
              id="minDeposit"
              name="mt5Account.minDeposit"
              type="number"
              min={5000}
              value={formData.mt5Account.minDeposit}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center text-lg">
              <input
                type="checkbox"
                name="mt5Account.isDemo"
                checked={formData.mt5Account.isDemo}
                onChange={handleChange}
                className="mr-3 w-5 h-5"
              />
              Demo Account
            </label>
          </div>
          <div>
            <label htmlFor="mobileNumber" className="block font-semibold mb-2 text-lg">Mobile Number</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label htmlFor="idCard" className="block font-semibold mb-2 text-lg">Upload ID Card</label>
            <input
              id="idCard"
              name="idCard"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            {formData.idCardFile && (
              <p className="mt-2 text-sm text-gray-600">File ready for upload: {formData.idCardFile.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="subscriptionType" className="block font-semibold mb-2 text-lg">Subscription Type</label>
            <select
              id="subscriptionType"
              name="subscription.type"
              value={formData.subscription.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              {subscriptionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-4 px-8 bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
          {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
        </form>
      )}

      {step === 4 && (
        <div className="p-8 bg-green-100 text-green-800 rounded-md max-w-3xl mx-auto mt-12">
          <h2 className="text-3xl font-bold mb-4">Success</h2>
          <p className="text-lg">{successMessage}</p>
          <p className="mt-6 text-lg">
            You can now <a href="/signin" className="underline text-blue-600 hover:text-blue-800">sign in</a>.
          </p>
        </div>
      )}
    </div>
  );
}