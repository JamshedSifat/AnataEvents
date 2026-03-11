import React, { useState } from "react";
import { toast } from "react-toastify";

const SingerModal = ({ singer, onClose }) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    venue: "",
    eventType: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      singer: singer.name,
      ...formData
    });

    toast.success("Booking request submitted successfully 🎉");

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-base-100 rounded-2xl max-w-xl w-full shadow-xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-5 text-white rounded-t-2xl flex justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Book {singer.name}
            </h2>

            <p className="text-sm opacity-80">
              {singer.genre} • {singer.price}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white text-xl"
          >
            ✕
          </button>

        </div>

        {/* Content */}
        <div className="p-6">

          {/* Singer Info */}
          <div className="bg-base-200 p-4 rounded-lg mb-5 text-sm">

            <p><strong>Location:</strong> {singer.location}</p>
            <p><strong>Experience:</strong> {singer.experience}</p>
            <p><strong>Rating:</strong> ⭐ {singer.rating}</p>

          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="input input-bordered w-full"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="input input-bordered w-full"
              />

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                required
                onChange={handleChange}
                className="input input-bordered w-full"
              />

              <input
                type="date"
                name="eventDate"
                required
                onChange={handleChange}
                className="input input-bordered w-full"
              />

            </div>

            <select
              name="eventType"
              required
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Event Type</option>
              <option>Wedding</option>
              <option>Concert</option>
              <option>Birthday</option>
              <option>Corporate Event</option>
            </select>

            <input
              type="text"
              name="venue"
              placeholder="Event Venue"
              required
              onChange={handleChange}
              className="input input-bordered w-full"
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Submit Booking
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default SingerModal;