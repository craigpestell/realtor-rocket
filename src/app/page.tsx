import PropertyUploadForm from '@/components/PropertyUploadForm';
import SetupGuide from '@/components/SetupGuide';
import Footer from '@/components/Footer';

export default function Home() {
  const isConfigured = process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.OPENAI_API_KEY;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Realtor Rocket 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your property photos into compelling listing descriptions with AI-powered image analysis
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {isConfigured ? <PropertyUploadForm /> : <SetupGuide />}
        </main>
      </div>
      <Footer />
    </div>
  );
}
