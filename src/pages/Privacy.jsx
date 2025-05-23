import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Privacy() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (path === "/privacy") {
      document.title = "Privacy Policy - Noisefill";
    }
  }, [path]);

  return (
    <div>
      <article className="space-y-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Privacy</h1>

        <p>
          We care about your privacy. We don't require you to create an account
          to use Noisefill and we don't use any third-party cookies. Many
          privacy regulations require us to stuff a lot inside our privacy
          policy, so if you don't need to read the full version, here's a quick
          rundown:
          <ul className="list-disc pl-6">
            <li>
              Our website may collect usage data to improve performance and
              security, which is handled by our privacy-friendly service
              providers
            </li>
            <li>
              Your browser will connect to our storage bucket to play
              soundscapes, which may include usage data for performance and
              security reasons
            </li>
            <li>
              We utilize Sentry to track errors occuring inside Noisefill that
              way we can fix them. Sentry may collect data, but not limited to
              your IP address, browser and device information
            </li>
          </ul>
        </p>
        <br />
        <h1 className="text-2xl font-bold">Full Version</h1>

        <p className="text-base font-semibold">Scope</p>
        <p className="text-base">
          This privacy policy applies to the Noisefill website (noisefill.com).
        </p>

        <h2 className="text-xl font-bold">Data We Collect and How It’s Used</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>When you use our Website or play Soundscapes:</strong>
            <p className="text-base">
              Our third-party Service Providers (such as Cloudflare) may collect
              limited Log Data and Usage Data, which may include IP addresses,
              browser type, and other technical information. This collection is
              done for legitimate interests, specifically for security purposes
              (to protect against DDoS attacks, for example) and to improve
              website perfomance. Cloudflare processes data on our behalf.
              Cloudflare’s privacy policy governs how they handle and store
              data, including any transfers outside the European Economic Area
              (EEA). You can review Cloudflare's{" "}
              <a
                href="https://www.cloudflare.com/privacypolicy/"
                className="text-blue-500"
              >
                privacy policy
              </a>{" "}
              here.
            </p>
          </li>
          <li>
            <strong>When an Error occurs:</strong>
            <p className="text-base">
              Sentry may collect data such as your IP address, browser and
              device information, and diagnostic information to help us track
              errors and improve the website. This is done for legitimate
              interests. Sentry processes data on our behalf and data is subject
              to their privacy policy, which includes any potential transfers
              outside the European Economic Area (EEA). You can review Sentry's{" "}
              <a href="https://sentry.io/privacy/" className="text-blue-500">
                privacy policy
              </a>{" "}
              here.
            </p>
          </li>
        </ul>

        <h2 className="text-xl font-bold">Definitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Usage Data</strong>: Refers to any information that your
            browser or device sends to our server when accessing our website.
            This can include your IP address, browser type, the date and time of
            your visit or usage, and other similar technical data.
          </li>
          <li>
            <strong>Log Data</strong>: Refers to information collected
            automatically about how you interact with our website. This can
            include data on the pages or features you visit, Usage Data, and the
            time of your visit.
          </li>
          <li>
            <strong>Soundscapes</strong>: Refers to the soundscapes that you
            play on our website.
          </li>
          <li>
            <strong>Service Providers</strong>: Refers to third-party companies
            that provide us with services such as security, hosting, and
            analytics. For example, Cloudflare helps us protect the site from
            attacks, and SimpleAnalytics provides privacy-friendly analytics.
          </li>
          <li>
            <strong>Legitimate Interest</strong>: Refers to a lawful basis under
            GDPR that allows data processing without the need for explicit
            consent in cases where the processing is necessary for the
            legitimate interests pursued by the website operator (e.g., website
            security or performance).
          </li>
          <li>
            <strong>Error</strong>: Refers to errors that may occur on our
            website.
          </li>
        </ul>

        <h2 id="third-party-service-providers" className="text-xl font-bold">
          Third-Party Service Providers
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cloudflare</strong>: As part of our security measures,
            Cloudflare processes incoming web traffic and may collect data such
            as IP addresses and request headers to detect and mitigate malicious
            traffic. Cloudflare’s privacy policy governs how they handle this
            data.{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <strong>Sentry</strong>: Sentry is our error tracking service.
            Sentry processes data on our behalf and data is subject to their
            privacy policy. You can review Sentry's{" "}
            <a href="https://sentry.io/privacy/" className="text-blue-500">
              privacy policy
            </a>{" "}
            here.
          </li>
          <li>
            <strong>SimpleAnalytics</strong>: SimpleAnalytics is our
            privacy-focused analytics provider. SimpleAnalytics does not collect
            any personally identifiable information (PII) or any data that could
            be used to identify you personally. It is also hosted in the EU,
            ensuring full GDPR compliance.{" "}
            <a
              href="https://simpleanalytics.com/privacy"
              className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-bold">User Rights Under GDPR</h2>
        <p className="text-base">
          While we do not collect personally identifiable information (PII)
          directly, EU users have certain rights under GDPR regarding any data
          that may be processed by our third-party providers. These rights
          include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Right of Access</strong>: The right to request access to
            your personal data. If your request relates to data collected on our
            behalf by Cloudflare, please contact them. If your request relates
            to data collected by Sentry, please contact either Sentry or us.
          </li>
          <li>
            <strong>Right to Rectification</strong>: The right to request that
            any inaccurate or incomplete data be corrected. If your request
            relates to data collected on our behalf by Cloudflare, please
            contact them. If your request relates to data collected by Sentry,
            please contact either Sentry or us.
          </li>
          <li>
            <strong>Right to Erasure</strong>: The right to request the deletion
            of your personal data from our systems. If your request relates to
            data collected on our behalf by Cloudflare, please contact them. If
            your request relates to data collected by Sentry, please contact
            either Sentry or us.
          </li>
          <li>
            <strong>Right to Restriction of Processing</strong>: You have the
            right to request the restriction of processing of your personal
            data. If your request relates to data collected on our behalf by
            Cloudflare, please contact them. If your request relates to data
            collected by Sentry, please contact either Sentry or us.
          </li>
          <li>
            <strong>Right to Data Portability</strong>: You have the right to
            receive your personal data in a structured, commonly used, and
            machine-readable format. Please direct your request to Cloudflare or
            Sentry.
          </li>
          <li>
            <strong>Right to Object</strong>: You have the right to object to
            the processing of your personal data. If your request relates to
            data collected on our behalf by Cloudflare, please contact them. If
            your request relates to data collected by Sentry, please contact
            either Sentry or us.
          </li>
          <li>
            <strong>Right to Complain</strong>: You have the right to complain
            to a data protection authority if you believe that your rights have
            been infringed.
          </li>
        </ul>

        <p className="text-base">
          Steps to exercise your rights might vary by right. Refer to the
          information above for details on how to exercise your rights. For more
          details, please consult their privacy policies linked below:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cloudflare Privacy Policy</strong>:{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              className="text-blue-500"
            >
              https://www.cloudflare.com/privacypolicy/
            </a>
          </li>
          <li>
            <strong>Sentry Privacy Policy</strong>:{" "}
            <a href="https://sentry.io/privacy/" className="text-blue-500">
              https://sentry.io/privacy/
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-bold">Data Retention</h2>
        <p className="text-base">
          All data collected are stored on aforementioned 3rd party services and
          are subject to the services' respective data retention policies.
        </p>

        <h2 className="text-xl font-bold">Third-Party Links</h2>
        <p className="text-base">
          Our website may contain links to external websites operated by third
          parties. We do not control or endorse the content, privacy policies,
          or practices of these third-party sites. By clicking on such links,
          you acknowledge and agree that we are not responsible for any
          activities, damages, or issues that may arise when accessing these
          external sites.
        </p>

        <h2 className="text-xl font-bold">Changes and Support</h2>
        <p className="text-base">
          We may update this privacy policy from time to time. Any changes will
          be published here with an updated revision date. If you have any
          questions, please contact us at:{" "}
          <a href="mailto:george@thingbomb.com" className="text-blue-500">
            george@thingbomb.com
          </a>
          .
        </p>

        <p className="text-base font-semibold">Last updated</p>
        <p className="text-base">April 22, 2025</p>
      </article>
    </div>
  );
}
