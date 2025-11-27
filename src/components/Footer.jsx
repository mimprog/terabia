import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';



const Footer = () => {

  const {activeMenu } = useStateContext();
  return (
    <footer className={` ${activeMenu ? "xl:ml-[20%] md:ml-[31%] mx-4": "mx-3"} mt-16 bg-indigo-900 text-white `}>
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Services Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Services</h3>
          <ul className="space-y-2">
            <li>✅ 24/7 Customer Support</li>
            <li>✅ Free Shipping on Orders Over $50</li>
            <li>✅ Easy Returns & Refunds</li>
            <li>✅ Secure Payment Options</li>
          </ul>
        </div>

        {/* Company Information Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms-and-conditions" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Email:</span> mimcheprog2@gmail.com
            </li>
            <li>
              <span className="font-semibold">Phone:</span> +237 657 58 52 22
            </li>
            <li>
              <span className="font-semibold">Address:</span> Cite U
            </li>
          </ul>
          <div className="mt-6 flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-300"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-indigo-800 py-4 mt-10">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 Magazina Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
