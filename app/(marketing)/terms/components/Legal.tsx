'use client'

import { motion } from 'framer-motion'

export default function TermsContent() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of <span className="text-accent">Service</span>
          </h1>
          <p className="text-xl text-gray-400">
            Last updated: January 15, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-accent max-w-none"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using AlphaChain Signals (&ldquo;Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                AlphaChain Signals provides cryptocurrency trading signals, market analysis, news aggregation, and related financial information services. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>AI-powered trading signals and market analysis</li>
                <li>Real-time cryptocurrency news and sentiment analysis</li>
                <li>Research tools and market data</li>
                <li>Educational content and tutorials</li>
                <li>API access for institutional clients</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To access certain features of our Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Investment Disclaimer</h2>
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
                <p className="text-yellow-200 font-semibold mb-2">IMPORTANT RISK DISCLOSURE:</p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Trading cryptocurrencies involves substantial risk of loss and is not suitable for all investors. You should carefully consider your financial situation and risk tolerance before trading.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Past performance does not guarantee future results</li>
                  <li>All trading signals are for educational purposes only</li>
                  <li>We do not provide personalized investment advice</li>
                  <li>You should conduct your own research before making any trades</li>
                  <li>Never invest more than you can afford to lose</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Subscription and Payment Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our Service offers various subscription plans with different features and pricing:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We offer a 7-day money-back guarantee for new subscribers</li>
                <li>Subscription fees may change with 30 days&apos; notice</li>
                <li>You may cancel your subscription at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Acceptable Use Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Share your account credentials with others</li>
                <li>Use automated systems to access our Service without permission</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                The Service and its original content, features, and functionality are owned by AlphaChain Signals and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To the maximum extent permitted by law, AlphaChain Signals shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Loss of profits or trading losses</li>
                <li>Loss of data or business interruption</li>
                <li>Any damages arising from your use of the Service</li>
                <li>Any damages resulting from trading decisions based on our signals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason in our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through our Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Delaware.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-300">
                  <strong>Email:</strong> legal@alphachain.com<br />
                  <strong>Address:</strong> 123 Crypto Street, Suite 456, San Francisco, CA 94105<br />
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </section>
  )
}