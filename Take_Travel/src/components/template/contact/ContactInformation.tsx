"use client";

import React, { useEffect, useState } from 'react';
import ContactUsForm from './ContactUsForm';
import Message from './Message';

function ContactInformation() {
  const [messageFromStorage, setMessageFromStorage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMessageFromStorage(localStorage.getItem("message"));
    }
  }, []);

  return (
    <div className='w-full flex justify-center mt-10'>
      <div className="w-11/12 flex flex-col lg:flex-row flex-wrap">
      <div className='w-full lg:w-6/12 flex items-center justify-start flex-col my-4'>
  <div className='w-11/12 flex justify-center items-center'>
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27237.71547953342!2d85.324723!3d27.671745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18bdb2325cb1%3A0xe00e8a9f238f27f9!2sPCPS%20College%20-%20Patan%20College%20for%20Professional%20Studies!5e0!3m2!1sen!2s!4v1617780653273!5m2!1sen!2s" 
      width="600" 
      height="550" 
      style={{border:"0", borderRadius:"10px"}} 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade">
    </iframe>
  </div>
  {messageFromStorage && <Message />}
</div>

        <div className='w-full lg:w-6/12 flex flex-col my-4'>
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
}

export default ContactInformation;
