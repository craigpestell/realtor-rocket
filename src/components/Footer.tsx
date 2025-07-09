import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Realtor Rocket</h3>
            <p className="text-gray-400">
              AI-powered property listing description generator for real estate professionals.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://cloud.google.com/vision"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-400 hover:text-white"
                >
                  Google Cloud Vision <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a 
                  href="https://platform.openai.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-400 hover:text-white"
                >
                  OpenAI API Documentation <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a 
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-gray-400 hover:text-white"
                >
                  Next.js Documentation <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-4">Tech Stack</h4>
            <ul className="space-y-1 text-gray-400">
              <li>Next.js 15</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Google Cloud Vision API</li>
              <li>OpenAI GPT-3.5</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Realtor Rocket. Built with Next.js and AI.</p>
        </div>
      </div>
    </footer>
  );
}
