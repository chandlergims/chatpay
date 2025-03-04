import React from 'react';
import './Pages.css';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  return (
    <div className="page-container">
      
      <div className="how-it-works-container">
        <section className="how-it-works-section">
          <h2>Messaging & Payment System</h2>
          <p>
            Chatrr uses a unique messaging system that incentivizes quality responses and
            ensures fair compensation for users' time and expertise.
          </p>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Send a Message</h3>
              <p>
                When you send a message to another user, a small SOL fee (shown on their profile) 
                is temporarily held in escrow. This fee is based on the recipient's set rate.
              </p>
              <div className="step-icon">💬</div>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Message Response</h3>
              <p>
                <strong>When the recipient replies to your message:</strong> The held SOL fee is 
                immediately transferred to them as compensation for their response.
              </p>
              <div className="step-icon">💰</div>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Message Deletion</h3>
              <p>
                <strong>If the message is deleted before a response:</strong> The SOL fee is 
                returned to you automatically. This ensures you only pay for actual responses.
              </p>
              <div className="step-icon">↩️</div>
            </div>
          </div>
        </section>
        
        <section className="how-it-works-section">
          <h2>Benefits of Our System</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>For Message Senders</h3>
              <ul>
                <li>Only pay when you receive a response</li>
                <li>Get refunded if your message is deleted</li>
                <li>Incentivizes quality responses from recipients</li>
                <li>Clear upfront pricing with no hidden fees</li>
              </ul>
            </div>
            
            <div className="benefit-card">
              <h3>For Message Recipients</h3>
              <ul>
                <li>Get compensated for your time and expertise</li>
                <li>Set your own message response rates</li>
                <li>Build a reputation for quality responses</li>
                <li>Immediate payment upon sending a response</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section className="how-it-works-section">
          <h2>Frequently Asked Questions</h2>
          
          <div className="faq-container">
            <div className="faq-item">
              <h3>How do I set my message rate?</h3>
              <p>
                You can set your message rate when creating your profile or by editing your 
                existing profile. Navigate to your profile settings and adjust the "Message Rate" 
                slider to your desired amount.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Can I delete messages I've sent?</h3>
              <p>
                No, only the receiver can delete messages. If the receiver deletes a message before 
                responding, your SOL fee will be automatically refunded to your wallet. If they've 
                already responded, the fee has been transferred to them and cannot be refunded.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>Is there a minimum or maximum message rate?</h3>
              <p>
                Yes, the minimum message rate is 0.01 SOL and the maximum is 1.00 SOL. 
                This range ensures fair pricing while preventing abuse of the system.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>How quickly will I receive payment for my responses?</h3>
              <p>
                Payments are processed immediately when you send a response. The SOL will 
                appear in your wallet within seconds of your response being delivered.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
