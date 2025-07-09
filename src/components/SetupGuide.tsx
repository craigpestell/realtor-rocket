'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, Copy, Check } from 'lucide-react';

export default function SetupGuide() {
  const [copiedSteps, setCopiedSteps] = useState<Set<string>>(new Set());

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSteps(prev => new Set([...prev, step]));
    setTimeout(() => {
      setCopiedSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(step);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Required</h2>
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-5 w-5" />
          <p>To use Realtor Rocket, you need to configure the required API services.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Google Cloud Vision API Setup */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
            Google Cloud Vision API Setup
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium mb-2">Step 1: Create Google Cloud Project</h4>
              <p className="text-sm text-gray-600 mb-2">
                Go to the Google Cloud Console and create a new project.
              </p>
              <a 
                href="https://console.cloud.google.com/projectcreate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                Open Google Cloud Console <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium mb-2">Step 2: Enable Vision API</h4>
              <p className="text-sm text-gray-600 mb-2">
                Enable the Cloud Vision API for your project.
              </p>
              <a 
                href="https://console.cloud.google.com/apis/library/vision.googleapis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                Enable Vision API <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium mb-2">Step 3: Create Service Account</h4>
              <ol className="text-sm text-gray-600 space-y-1 mb-2">
                <li>• Go to IAM &amp; Admin → Service Accounts</li>
                <li>• Click &quot;Create Service Account&quot;</li>
                <li>• Give it a name and description</li>
                <li>• Grant it the &quot;Cloud Vision API User&quot; role</li>
                <li>• Create and download the JSON key file</li>
              </ol>
              <a 
                href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                Create Service Account <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium mb-2">Step 4: Configure Environment Variables</h4>
              <p className="text-sm text-gray-600 mb-2">
                Add these to your `.env.local` file:
              </p>
              <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm relative">
                <pre>{`GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id`}</pre>
                <button
                  onClick={() => copyToClipboard(
                    'GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json\nGOOGLE_CLOUD_PROJECT_ID=your-project-id',
                    'google-env'
                  )}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded"
                >
                  {copiedSteps.has('google-env') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OpenAI API Setup */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
            OpenAI API Setup
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium mb-2">Step 1: Get OpenAI API Key</h4>
              <p className="text-sm text-gray-600 mb-2">
                Sign up for OpenAI API access and get your API key.
              </p>
              <a 
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                Get OpenAI API Key <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium mb-2">Step 2: Add to Environment Variables</h4>
              <p className="text-sm text-gray-600 mb-2">
                Add this to your `.env.local` file:
              </p>
              <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm relative">
                <pre>OPENAI_API_KEY=your-openai-api-key-here</pre>
                <button
                  onClick={() => copyToClipboard('OPENAI_API_KEY=your-openai-api-key-here', 'openai-env')}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded"
                >
                  {copiedSteps.has('openai-env') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Final Steps */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
            Final Steps
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="font-medium mb-2">Restart the Development Server</h4>
              <p className="text-sm text-gray-600 mb-2">
                After setting up your environment variables, restart the development server:
              </p>
              <div className="bg-gray-800 text-gray-100 p-3 rounded font-mono text-sm relative">
                <pre>npm run dev</pre>
                <button
                  onClick={() => copyToClipboard('npm run dev', 'npm-dev')}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded"
                >
                  {copiedSteps.has('npm-dev') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Ready to Use!</h4>
              <p className="text-sm text-green-700">
                Once you&apos;ve completed these steps, you can start uploading property images and generating descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
