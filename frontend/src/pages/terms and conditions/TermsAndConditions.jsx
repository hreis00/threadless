const TermsAndConditions = () => {
  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <p>Last Updated: June 2024</p>
        <p>
          Welcome to Threadless, a social media network dedicated to artists and
          art galleries. Please read these Terms and Conditions carefully before
          using our platform.
        </p>
        <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
      </div>
    </div>
  );
};

export default TermsAndConditions;
