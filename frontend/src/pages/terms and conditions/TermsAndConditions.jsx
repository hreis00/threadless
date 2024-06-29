const TermsAndConditions = () => {
  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <div className="space-y-6">
          <div className="px-2 space-y-2">
            <p>Last Updated: June 2024</p>
            <p>
              Welcome to Threadless, a social media network dedicated to artists
              and art galleries. Please read these Terms and Conditions
              carefully before using our platform.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
            <div className="px-4">
              <ul className="px-2 list-disc">
                <li>
                  By accessing or using the Platform, you agree to be bound by
                  these Terms. If you do not agree with these Terms, you may not
                  access or use the Platform.
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold">2. Account Registration</h2>
            <div className="px-4">
              <ul className="px-2 list-disc">
                <li>
                  <span className="font-bold">Account Information: </span>
                  You must provide accurate and complete information when
                  creating your account and update it as necessary.
                </li>
                <li>
                  <span className="font-bold">Account Security: </span>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account.
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold">4. User Content</h2>
            <div className="px-4">
              <ul className="px-2 list-disc">
                <li>
                  <span className="font-bold">User Content: </span>
                  You retain ownership of any content, including artwork,
                  images, text, and videos, that you post on the Platform.
                </li>
                <li>
                  <span className="font-bold">Ownership: </span>
                  You retain ownership of any content, including artwork,
                  images, text, and videos, that you post on the Platform.
                </li>
                <li>
                  <span className="font-bold">License: </span>
                  By posting User Content, you grant the Platform a worldwide,
                  non-exclusive, royalty-free license to use, reproduce, modify,
                  distribute, and display your content in connection with the
                  {" Platform's"} operations.
                </li>
                <li>
                  <span className="font-bold">Prohibited Content: </span>
                  You agree not to post content that is illegal, infringing,
                  obscene, defamatory, or otherwise objectionable.
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold">5. Intellectual Property</h2>
            <div className="px-4">
              <ul className="px-2 list-disc">
                <li>
                  <span className="font-bold">Platform Content: </span>
                  All content on the Platform, including design, text, graphics,
                  and software, is the property of [Platform Name] and is
                  protected by intellectual property laws.
                </li>
                <li>
                  <span className="font-bold">User Content Rights: </span>
                  Users must respect the intellectual property rights of others.
                  If you believe your rights have been infringed, please notify
                  us.
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold">6. User Conduct</h2>
            <div className="px-4">
              <ul className="px-2 list-disc">
                <li>Harassment or abuse of other users.</li>
                <li>Posting or distributing spam or malware.</li>
                <li>Engaging in fraudulent activities.</li>
                <li>
                  Attempting to gain unauthorized access to the Platform or
                  other {"user's"} accounts.
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold">7. Modifications to Terms</h2>
            <div className="px-4">
              <ul className="px-2 list-disc">
                <li>
                  We reserve the right to modify these Terms at any time.
                  Changes will be effective immediately upon posting the updated
                  Terms on the Platform. Your continued use of the Platform
                  after the changes constitutes your acceptance of the new
                  Terms.
                </li>
              </ul>
            </div>

            <p className="px-2 py-4 font-bold text-center">
              By using the Platform, you acknowledge that you have read,
              understood, and agree to these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
