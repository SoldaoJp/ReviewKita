import React, { useState } from 'react';

export default function TermsAndConditions({ isOpen, onClose, onAccept }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e) => {
    const element = e.target;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    setScrolledToBottom(isAtBottom);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-800">Terms and Conditions</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-light"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
          >
            {/* 1. Introduction / Acceptance */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Introduction & Acceptance</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                By accessing or using ReviewKita, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these terms, you must discontinue use of the Application immediately. ReviewKita reserves the right to modify these terms at any time. Your continued use of the Application following any modifications constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* 2. User Accounts */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">2. User Accounts</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong className="text-gray-800">Account Creation:</strong> Users may create an account by providing accurate, current, and complete information. Users are responsible for maintaining the confidentiality of their login credentials and account information.</p>
                <p><strong className="text-gray-800">Password Security:</strong> Users are solely responsible for maintaining password security and for all activities conducted under their account. It is recommended that users employ strong, unique passwords and refrain from sharing credentials with third parties.</p>
                <p><strong className="text-gray-800">Account Suspension or Termination:</strong> ReviewKita reserves the right to suspend or terminate user accounts for violations of these terms, fraudulent activity, or unauthorized use of the Application. Users will be notified of such actions when reasonably possible.</p>
              </div>
            </section>

            {/* 3. Privacy & Data */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Privacy & Data</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong className="text-gray-800">Data Collection and Processing:</strong> ReviewKita is committed to protecting user privacy. The following outlines our data handling practices:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Email Storage:</strong> User email addresses are collected and stored solely for authentication and account management purposes.</li>
                  <li><strong>Learning Content:</strong> User-uploaded documents and reviewer materials are processed through our Large Language Model (LLM) provider partners (GROQ, OpenRouter, and Gemini) to generate quizzes and enhanced educational content.</li>
                  <li><strong>Third-Party LLM Processing:</strong> Educational content may be transmitted to our partner LLM providers exclusively for the purpose of generating quiz questions and content enhancements. Please note that these third-party providers may use the content to improve and train their AI models. Users should avoid uploading highly sensitive or confidential information.</li>
                  <li><strong>Data Security:</strong> ReviewKita implements industry-standard security measures to protect user data. However, users acknowledge that no electronic storage or transmission method is completely secure, and absolute security cannot be guaranteed.</li>
                </ul>
              </div>
            </section>

            {/* 4. Acceptable Use Policy */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Acceptable Use Policy</h3>
              <p className="text-gray-700 text-sm mb-3">Users agree to refrain from the following prohibited activities:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-2">
                <li>Engaging in spam distribution, harassment, or abusive conduct toward other users or third parties.</li>
                <li>Attempting to gain unauthorized access to the Application, related systems, or networks.</li>
                <li>Uploading, distributing, or creating content that is unlawful, harmful, defamatory, or violates applicable laws and regulations.</li>
                <li>Impersonating any individual or entity, or falsely representing affiliations or endorsements.</li>
                <li>Reverse engineering, decompiling, disassembling, or attempting to derive source code from the Application.</li>
                <li>Using the Application for commercial purposes without express written authorization from ReviewKita.</li>
                <li>Interfering with, disrupting, or compromising the integrity or performance of the Application or its infrastructure.</li>
              </ul>
            </section>

            {/* 5. Intellectual Property */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Intellectual Property</h3>
              <p className="text-gray-700 text-sm mb-2">
                <strong className="text-gray-800">Copyright & Ownership:</strong> All content, features, functionality, and intellectual property associated with ReviewKita are owned by the ReviewKita Development Team:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-2">
                <li>Ahron Paul Villacote</li>
                <li>Prince Chen Valdez</li>
                <li>Will Anthony Barillo</li>
                <li>Jerome Esmade</li>
                <li>Jhamp Soldao</li>
              </ul>
              <p className="text-gray-700 text-sm mt-3">
                All intellectual property rights are reserved. Users may not reproduce, distribute, modify, or transmit any content from the Application without prior written authorization from the copyright holders.
              </p>
            </section>

            {/* 6. Disclaimers & Limitation of Liability */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Disclaimers & Limitation of Liability</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong className="text-gray-800">As-Is Provision:</strong> The Application is provided on an "as-is" and "as-available" basis without warranties of any kind, either express or implied, including but not limited to warranties of accuracy, completeness, or reliability of content generated by the Application.</p>
                <p><strong className="text-gray-800">AI-Generated Content Disclaimer:</strong> Quizzes and content enhancements are generated through artificial intelligence technology and may contain errors, inaccuracies, or inconsistencies. Users are advised to independently verify critical information and exercise professional judgment when relying on AI-generated content.</p>
                <p><strong className="text-gray-800">Limitation of Liability:</strong> To the maximum extent permitted by applicable law, ReviewKita and its development team shall not be held liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or service interruption, arising from use of or inability to use the Application.</p>
              </div>
            </section>

            {/* 7. Changes to Terms */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Modifications to Terms</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                ReviewKita reserves the right to modify these Terms and Conditions at any time without prior notice. Modifications shall become effective immediately upon posting to the Application. Continued use of the Application following any modifications constitutes acceptance of the revised Terms and Conditions. Users are encouraged to review these terms periodically to remain informed of any updates or changes.
              </p>
            </section>

            {/* 8. Contact */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">8. Contact Information</h3>
              <p className="text-gray-700 text-sm">
                For inquiries, questions, or concerns regarding these Terms and Conditions, users may contact ReviewKita through the Application's designated support channels.
              </p>
            </section>

            {/* Last Updated */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Last Updated: October 24, 2025
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 flex gap-3 bg-gray-50 rounded-b-2xl sticky bottom-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!scrolledToBottom}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title={!scrolledToBottom ? "Please scroll to the bottom to accept" : ""}
            >
              I Accept
            </button>
          </div>
        </div>
      </div>
    )
  );
}

