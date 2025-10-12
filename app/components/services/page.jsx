"use client";

export default function ServicesPage() {
  return (
    <section className="bg-gray-50 py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Page Heading */}
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Our Services
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          At Journivo, we are committed to advancing knowledge through high-quality publishing,
          professional editorial services, and global research dissemination.  
        </p>

        {/* Services Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Academic Publishing
            </h3>
            <p className="text-gray-600">
              We publish peer-reviewed journals, conference proceedings, and research reports across diverse disciplines, ensuring global visibility for scholars and institutions.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Editorial & Peer Review
            </h3>
            <p className="text-gray-600">
              Our editorial board and reviewers maintain high academic standards, providing constructive feedback to strengthen the quality of each publication.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Indexing & Archiving
            </h3>
            <p className="text-gray-600">
              Journivo ensures your research is indexed, discoverable, and preserved in leading databases and repositories for long-term academic visibility.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Conference Publishing
            </h3>
            <p className="text-gray-600">
              We partner with academic institutions to publish conference proceedings, ensuring participants’ research contributions are widely accessible.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Research Promotion
            </h3>
            <p className="text-gray-600">
              With digital marketing, open-access strategies, and collaborations, Journivo amplifies your research impact globally.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Author Support
            </h3>
            <p className="text-gray-600">
              From manuscript formatting to publication guidance, we provide full support to ensure a smooth publishing experience for authors.
            </p>
          </div>
        </div>

        {/* Payment Plans Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
            Publishing Payment Plans
          </h2>
          <p className="text-center text-gray-600 mb-12">
            We offer affordable, transparent, and flexible publishing plans for authors and institutions.  
          </p>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border hover:shadow-2xl transition flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic</h3>
              <p className="text-gray-600 mb-6">
                Ideal for first-time authors looking for quality publishing.
              </p>
              <p className="text-3xl font-bold text-blue-600 mb-6">₦5,000</p>
              <ul className="space-y-3 mb-6">
                <li>✓ Peer Review</li>
                <li>✓ Standard Formatting</li>
                <li>✗ Indexing Support</li>
              </ul>
              <button className="mt-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                Choose Basic
              </button>
            </div>

            {/* Standard Plan */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border-2 border-blue-600 hover:shadow-2xl transition flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Standard</h3>
              <p className="text-gray-600 mb-6">
                Our most popular plan for researchers and academics.
              </p>
              <p className="text-3xl font-bold text-blue-600 mb-6">₦30,000</p>
              <ul className="space-y-3 mb-6">
                <li>✓ Peer Review</li>
                <li>✓ Professional Formatting</li>
                <li>✓ Indexing in Databases</li>
                <li>✓ Certificate of Publication</li>
              </ul>
              <button className="mt-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                Choose Standard
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border hover:shadow-2xl transition flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium</h3>
              <p className="text-gray-600 mb-6">
                For institutions and authors seeking maximum global reach.
              </p>
              <p className="text-3xl font-bold text-blue-600 mb-6">₦150,000</p>
              <ul className="space-y-3 mb-6">
                <li>✓ Peer Review</li>
                <li>✓ Premium Formatting</li>
                <li>✓ Indexing & Archiving</li>
                <li>✓ Wide Promotion & Visibility</li>
                <li>✓ Priority Support</li>
              </ul>
              <button className="mt-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                Choose Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
