import React, { useState } from "react";
import { toast } from "react-toastify";

const QueryModal = ({ isOpen, setIsOpen }) => {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    message: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Your query has been submitted!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored"
    });

    setFormData({
      name: "",
      phone: "",
      email: "",
      eventType: "",
      message: ""
    });

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">

        <h3 className="font-bold text-2xl text-primary mb-6">
          Send Your Query
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />

          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            className="select select-bordered w-full"
          >
            <option value="">Select Event</option>
            <option value="Wedding">Wedding</option>
            <option value="Corporate">Corporate</option>
            <option value="Birthday">Birthday</option>
          </select>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Message"
            className="textarea textarea-bordered w-full"
          ></textarea>

          <div className="modal-action">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              Submit Query
            </button>
          </div>
        </form>

        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

      </div>
    </div>
  );
};

export default QueryModal;