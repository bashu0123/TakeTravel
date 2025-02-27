"use client";

import React, { useState } from 'react';
import { toast } from "sonner";
import { MessageSend } from '@/Validation/Validation.yup';
import { useFormik } from 'formik';
import axios from 'axios';

function ContactUsForm() {
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values: any, { resetForm }: any) => {
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/contacts/contact", values);

      if (response.status === 201) {
        toast.success("Message sent successfully!");
        resetForm();
      } else {
        toast.error("Something went wrong. Try again!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const Formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validationSchema: MessageSend,
    onSubmit: submitHandler
  });

  return (
    <div className="w-full flex flex-col flex-wrap">
      <h1 className="font-bold text-2xl my-3 md:text-4xl">Contact Us</h1>
      <p>
        Welcome to Take Travel, your go-to source for exploring the world’s most exciting destinations and unforgettable experiences. Whether you're an experienced traveler or gearing up for your first journey, we’re here to guide you.
      </p>
      <form onSubmit={Formik.handleSubmit}>
        <div className='flex flex-col'>
          <label htmlFor="name" className="text-xl my-2 text-gray-700">Name:</label>
          <input
            onBlur={Formik.handleBlur}
            value={Formik.values.name}
            onChange={Formik.handleChange}
            type="text"
            name='name'
            id="name"
            placeholder="Enter Your Name"
            className={`rounded-md border border-gray-300 w-11/12 md:w-6/12 p-2 ${Formik.errors.name && Formik.touched.name ? "border-red-400" : ""}`}
          />
          {Formik.errors.name && Formik.touched.name ? <p className='text-red-500'>{Formik.errors.name}</p> : ""}
        </div>
        
        <div className='flex flex-col'>
          <label htmlFor="email" className="text-xl my-2 text-gray-700">Email:</label>
          <input
            onBlur={Formik.handleBlur}
            value={Formik.values.email}
            onChange={Formik.handleChange}
            type="email"
            name='email'
            id="email"
            placeholder="Enter Your Email"
            className={`rounded-md border border-gray-300 w-11/12 md:w-6/12 p-2 ${Formik.errors.email && Formik.touched.email ? "border-red-400" : ""}`}
          />
          {Formik.errors.email && Formik.touched.email ? <p className='text-red-500'>{Formik.errors.email}</p> : ""}
        </div>
        
        <div className='flex flex-col'>
          <label htmlFor="message" className="text-xl my-2 text-gray-700">Message:</label>
          <textarea
            onBlur={Formik.handleBlur}
            value={Formik.values.message}
            onChange={Formik.handleChange}
            name="message"
            id="message"
            className={`rounded-md border border-gray-300 p-2 ${Formik.errors.message && Formik.touched.message ? "border-red-400" : ""}`}
            rows={5}
          ></textarea>
          {Formik.errors.message && Formik.touched.message ? <p className='text-red-500'>{Formik.errors.message}</p> : ""}
        </div>
        
        <button
          type='submit'
          disabled={loading}
          className={`mt-7 capitalize border-2 bg-orange-600 text-white transition-all hover:ring-4 hover:ring-orange-300 font-medium rounded-3xl text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Sending..." : "Send Now"}
        </button>
      </form>
    </div>
  );
}

export default ContactUsForm;
