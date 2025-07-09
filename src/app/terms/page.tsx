import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - Realtor Rocket',
  description: 'Terms of Service for Realtor Rocket - AI-powered property listing description generator',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="mb-6 text-gray-700">
                By accessing and using Realtor Rocket (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="mb-6 text-gray-700">
                Realtor Rocket is an AI-powered property listing description generator that analyzes property images and creates compelling descriptions for real estate professionals. The Service uses Google Cloud Vision API for image analysis and AI technology for content generation.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="mb-4 text-gray-700">You agree to:</p>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• Use the Service only for lawful purposes</li>
                <li>• Ensure you have rights to upload and analyze property images</li>
                <li>• Not upload inappropriate, offensive, or copyrighted content</li>
                <li>• Not attempt to reverse engineer or exploit the Service</li>
                <li>• Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="mb-4 text-gray-700">
                The Service and its original content, features, and functionality are owned by Realtor Rocket and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mb-6 text-gray-700">
                Generated descriptions are provided for your use, but you retain responsibility for their accuracy and compliance with applicable real estate regulations.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitations of Service</h2>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• AI-generated descriptions are suggestions and may require editing</li>
                <li>• Image analysis accuracy depends on image quality and content</li>
                <li>• Service availability is subject to maintenance and technical issues</li>
                <li>• We reserve the right to limit usage to prevent abuse</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
              <p className="mb-6 text-gray-700">
                The Service is provided &quot;as is&quot; without any warranties, expressed or implied. We do not guarantee the accuracy, completeness, or suitability of generated descriptions for your specific use case.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="mb-6 text-gray-700">
                In no event shall Realtor Rocket be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or use, arising out of your use of the Service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="mb-6 text-gray-700">
                We may terminate or suspend your access to the Service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="mb-6 text-gray-700">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="mb-6 text-gray-700">
                These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="mb-6 text-gray-700">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@realtor-rocket.com<br />
                  <strong>Address:</strong> [Your Business Address]<br />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
