import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: "legal-issues",
      title: "5.1.1 Legal Issues",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">General Data Protection Regulation (GDPR)</h3>
          <p>The GDPR is a European Union regulation designed to protect the personal data of EU residents. It applies to any organization that processes such data, regardless of its geographic location, including Hirexer in Nepal.</p>
          
          <h4 className="font-medium">Scope and Applicability</h4>
          <p>Under Article 3 of GDPR, Hirexer must comply if it processes the personal data of EU residents. This includes handling candidate profiles, HR analytics, or workspace data. The regulation applies even if the processing occurs outside the EU.</p>
          
          <h4 className="font-medium">Key Compliance Measures</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Lawful Basis for Processing (Article 6):</strong> Hirexer must obtain clear and specific consent from candidates for data collection.</li>
            <li><strong>Data Subject Rights (Articles 15–22):</strong> Users can export their profiles or request deletion of their details.</li>
            <li><strong>Data Minimization (Article 5):</strong> Hirexer collects only job-relevant information.</li>
            <li><strong>Breach Notification (Article 33):</strong> Hirexer must notify relevant authorities within 72 hours of a data breach.</li>
          </ul>
          
          <h3 className="font-semibold text-lg mt-6">ISO/IEC 27001 Compliance</h3>
          <p>ISO/IEC 27001 is an international standard for managing information security through an Information Security Management System (ISMS).</p>
          
          <h4 className="font-medium">Certification Requirements</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Risk Assessment:</strong> Hirexer conducts bi-annual audits to identify vulnerabilities.</li>
            <li><strong>Access Control:</strong> Role-Based Access Control (RBAC) ensures appropriate data access.</li>
            <li><strong>Incident Management:</strong> Hirexer maintains an Incident Response Plan (IRP) for security breaches.</li>
          </ul>
        </div>
      )
    },
    {
      id: "social-issues",
      title: "5.1.2 Social Issues",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Employment Displacement & Labor Rights</h3>
          <p>Hirexer's modern hiring automation raises concerns about reduced demand for traditional HR roles. However, its design focuses on augmentation, not replacement, aligning with Nepal's Labor Act (2017) and ILO Convention C181.</p>
          
          <h4 className="font-medium">Key Compliance Measures</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Upskilling Programs:</strong> Hirexer partners with Nepali vocational institutes to train HR professionals in AI tools.</li>
            <li><strong>Accessibility & Digital Inclusion:</strong> Hirexer ensures WCAG 2.1 compliance for users with disabilities.</li>
            <li><strong>Community Impact & Gig Worker Protections:</strong> Formalized contracts and social security integration for freelancers.</li>
            <li><strong>Digital Divide & Rural Access:</strong> Lite version of Hirexer's app for low-bandwidth networks and offline service centers.</li>
          </ul>
        </div>
      )
    },
    {
      id: "ethical-issues",
      title: "5.1.3 Ethical Issues",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Privacy & Consent in Talent Sharing</h3>
          <p>When employees are transferred between workspaces, their personal and employment data is shared. This raises ethical concerns about consent and data ownership.</p>
          
          <h4 className="font-medium">Key Ethical Measures</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Explicit Employee Consent:</strong> Employees must approve their transfer via digital consent form.</li>
            <li><strong>Fairness & Non-Discrimination:</strong> Structured hiring frameworks and blind recruitment processes.</li>
            <li><strong>Transparency in Employee Transfers:</strong> Clear transfer agreements with all terms specified.</li>
            <li><strong>Accountability for Exploitative Practices:</strong> Wage parity audits and workload monitoring.</li>
            <li><strong>Ethical Governance & Redress Mechanisms:</strong> Ethics committee and whistleblower protection.</li>
          </ul>
        </div>
      )
    },
    {
      id: "data-collection",
      title: "Data Collection Practices",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Information We Collect</h3>
          <p>Hirexer collects information to provide better services to all our users. The types of information we collect include:</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details.</li>
            <li><strong>Professional Information:</strong> Work history, education, skills, and other career-related information.</li>
            <li><strong>Usage Data:</strong> Information about how you use our platform, including search queries, job applications, and interactions.</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, and other technical details.</li>
          </ul>
          
          <h3 className="font-semibold text-lg mt-6">How We Use Information</h3>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Develop new products and features</li>
            <li>Personalize content and job recommendations</li>
            <li>Measure performance and analyze usage</li>
            <li>Communicate with you about updates and security alerts</li>
          </ul>
        </div>
      )
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Our Use of Cookies</h3>
          <p>Hirexer uses cookies and similar tracking technologies to track activity on our platform and hold certain information.</p>
          
          <p>Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our service.</p>
          
          <h4 className="font-medium">Types of Cookies We Use</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Session Cookies:</strong> Temporary cookies that remain in your browser until you leave the site.</li>
            <li><strong>Persistent Cookies:</strong> Remain in your browser for longer periods or until you delete them.</li>
            <li><strong>Necessary Cookies:</strong> Essential for the operation of our platform.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our platform.</li>
          </ul>
          
          <h3 className="font-semibold text-lg mt-6">Your Choices Regarding Cookies</h3>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.</p>
        </div>
      )
    },
    {
      id: "data-security",
      title: "Data Security",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Our Security Measures</h3>
          <p>Hirexer implements appropriate technical and organizational measures to protect personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure or access.</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Encryption:</strong> We use industry-standard encryption for data in transit and at rest.</li>
            <li><strong>Access Controls:</strong> Strict access controls limit who can access user data within our organization.</li>
            <li><strong>Security Audits:</strong> Regular security audits and penetration testing to identify and address vulnerabilities.</li>
            <li><strong>Incident Response:</strong> We have procedures in place to detect, report, and investigate data breaches.</li>
          </ul>
          
          <h3 className="font-semibold text-lg mt-6">Data Retention</h3>
          <p>We retain personal data only for as long as necessary to provide our services and for legitimate and essential business purposes, such as complying with legal obligations and resolving disputes.</p>
          
          <p>When we no longer need to use personal data, we securely delete or anonymize it.</p>
        </div>
      )
    },
    {
      id: "user-rights",
      title: "Your Rights",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Your Data Protection Rights</h3>
          <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Right to Access:</strong> You can request copies of your personal data.</li>
            <li><strong>Right to Rectification:</strong> You can request that we correct any information you believe is inaccurate.</li>
            <li><strong>Right to Erasure:</strong> You can request that we erase your personal data under certain conditions.</li>
            <li><strong>Right to Restrict Processing:</strong> You can request that we restrict the processing of your personal data.</li>
            <li><strong>Right to Data Portability:</strong> You can request that we transfer the data we have collected to another organization.</li>
            <li><strong>Right to Object:</strong> You can object to our processing of your personal data.</li>
          </ul>
          
          <h3 className="font-semibold text-lg mt-6">Exercising Your Rights</h3>
          <p>To exercise any of these rights, please contact us at privacy@hirexer.com. We may ask you to verify your identity before responding to such requests.</p>
        </div>
      )
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      content: (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Policy Updates</h3>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
          
          <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
          
          <h3 className="font-semibold text-lg mt-6">Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>By email: privacy@hirexer.com</li>
            <li>By mail: Hirexer Inc., Privacy Office, Kathmandu, Nepal</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-primary mb-4">Privacy Policy & Terms of Service</h1>
        <p className="text-lg text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Hirexer ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our hiring platform and related services.
                </p>
                <p>
                  By accessing or using our service, you agree to the collection and use of information in accordance with this policy. If you disagree with any part of this policy, please do not use our services.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full text-left"
                >
                  <CardHeader className="flex flex-row items-center justify-between hover:bg-secondary/50 transition-colors rounded-t-lg">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    {activeSection === section.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CardHeader>
                </button>
                <AnimatePresence>
                  {activeSection === section.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        {section.content}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          toggleSection(section.id);
                          document.getElementById(section.id)?.scrollIntoView({
                            behavior: 'smooth'
                          });
                        }}
                        className={`text-left w-full px-3 py-2 rounded-md transition-colors ${activeSection === section.id ? 'bg-accent text-accent-foreground' : 'hover:bg-secondary'}`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Terms of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">1. Acceptance of Terms</h3>
                <p>By accessing or using the Hirexer platform, you agree to be bound by these Terms of Service.</p>
                
                <h3 className="font-semibold">2. User Responsibilities</h3>
                <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.</p>
                
                <h3 className="font-semibold">3. Prohibited Activities</h3>
                <p>You may not use our platform for any illegal or unauthorized purpose, including violating any laws in your jurisdiction.</p>
                
                <h3 className="font-semibold">4. Termination</h3>
                <p>We may terminate or suspend your account immediately for any reason, including without limitation if you breach the Terms.</p>
                
                <h3 className="font-semibold">5. Limitation of Liability</h3>
                <p>Hirexer shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the platform.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2"><strong>Email:</strong> privacy@hirexer.com</p>
                <p className="mb-2"><strong>Phone:</strong> +977-1-XXXXXXX</p>
                <p><strong>Address:</strong> Hirexer Inc., Kathmandu, Nepal</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;