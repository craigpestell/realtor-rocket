import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - Realtor Rocket',
  description: 'Privacy policy for Realtor Rocket - AI-powered property listing description generator',
};

export default function PrivacyPolicy() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> January 1, 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-6 text-gray-700">
                Welcome to Realtor Rocket (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered property listing description generator service (&quot;Service&quot;).
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">2.1 Information You Provide</h3>
              <ul className="mb-4 text-gray-700 space-y-2">
                <li>• Property images you upload for analysis</li>
                <li>• Any text descriptions or notes you provide</li>
                <li>• Contact information if you reach out for support</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• Device information (IP address, browser type, operating system)</li>
                <li>• Usage data (pages visited, time spent, features used)</li>
                <li>• Log files and analytics data</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4 text-gray-700">We use the collected information to:</p>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• Analyze property images using Google Cloud Vision API</li>
                <li>• Generate property descriptions using AI technology</li>
                <li>• Improve our service quality and user experience</li>
                <li>• Provide customer support and respond to inquiries</li>
                <li>• Ensure service security and prevent misuse</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
              <p className="mb-4 text-gray-700">Our service integrates with the following third-party providers:</p>
              
              <h3 className="text-xl font-medium text-gray-900 mb-3">4.1 Google Cloud Vision API</h3>
              <ul className="mb-4 text-gray-700 space-y-2">
                <li>• Used for image analysis and feature extraction</li>
                <li>• Subject to Google&apos;s Privacy Policy and Terms of Service</li>
                <li>• Images are processed but not stored by Google beyond processing time</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">4.2 OpenAI API</h3>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• Used for generating property descriptions</li>
                <li>• Subject to OpenAI&apos;s Privacy Policy and Terms of Service</li>
                <li>• Data is processed but not used for model training</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Storage and Security</h2>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• Uploaded images are processed immediately and not permanently stored</li>
                <li>• Generated descriptions are temporarily cached for performance</li>
                <li>• We implement industry-standard security measures</li>
                <li>• All data transmission is encrypted using HTTPS</li>
                <li>• We regularly review and update our security practices</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• Property images are deleted immediately after processing</li>
                <li>• Generated descriptions are cached for 24 hours maximum</li>
                <li>• Analytics data is retained for 12 months</li>
                <li>• Support communications are retained for 2 years</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="mb-4 text-gray-700">You have the right to:</p>
              <ul className="mb-6 text-gray-700 space-y-2">
                <li>• Access information about your data processing</li>
                <li>• Request correction of inaccurate data</li>
                <li>• Request deletion of your data</li>
                <li>• Object to certain data processing activities</li>
                <li>• Withdraw consent where applicable</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="mb-6 text-gray-700">
                We use essential cookies for service functionality and analytics cookies to understand usage patterns. 
                You can control cookie preferences through your browser settings.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
              <p className="mb-6 text-gray-700">
                Our service is not intended for users under 13 years of age. We do not knowingly collect personal 
                information from children under 13.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="mb-6 text-gray-700">
                Your data may be processed in countries other than your own, including the United States, 
                where our service providers are located. We ensure appropriate safeguards are in place.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="mb-6 text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="mb-6 text-gray-700">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@realtor-rocket.com<br />
                  <strong>Address:</strong> [Your Business Address]<br />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  This privacy policy is compliant with GDPR, CCPA, and other applicable privacy regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
