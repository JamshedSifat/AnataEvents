// import React, { useState } from "react";
// import { toast } from "react-toastify";

// const QueryModal = ({ isOpen, setIsOpen }) => {

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     eventType: "",
//     message: ""
//   });

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     toast.success("Your query has been submitted!", {
//       position: "top-right",
//       autoClose: 3000,
//       theme: "colored"
//     });

//     setFormData({
//       name: "",
//       phone: "",
//       email: "",
//       eventType: "",
//       message: ""
//     });

//     setIsOpen(false);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal modal-open">
//       <div className="modal-box max-w-lg">

//         <h3 className="font-bold text-2xl text-primary mb-6">
//           Send Your Query
//         </h3>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             value={formData.name}
//             onChange={handleInputChange}
//             className="input input-bordered w-full"
//             required
//           />

//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone Number"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className="input input-bordered w-full"
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="input input-bordered w-full"
//           />

//           <select
//             name="eventType"
//             value={formData.eventType}
//             onChange={handleInputChange}
//             className="select select-bordered w-full"
//           >
//             <option value="">Select Event</option>
//             <option value="Wedding">Wedding</option>
//             <option value="Corporate">Corporate</option>
//             <option value="Birthday">Birthday</option>
//           </select>

//           <textarea
//             name="message"
//             value={formData.message}
//             onChange={handleInputChange}
//             placeholder="Message"
//             className="textarea textarea-bordered w-full"
//           ></textarea>

//           <div className="modal-action">
//             <button
//               type="button"
//               onClick={() => setIsOpen(false)}
//               className="btn btn-outline"
//             >
//               Cancel
//             </button>

//             <button type="submit" className="btn btn-primary">
//               Submit Query
//             </button>
//           </div>
//         </form>

//         <button
//           onClick={() => setIsOpen(false)}
//           className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
//         >
//           ✕
//         </button>

//       </div>
//     </div>
//   );
// };

// export default QueryModal;


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

  const [activeTab, setActiveTab] = useState("form"); // "form", "whatsapp", "call"
  const CONTACT_PHONE = "01540045974"; // Replace with your business phone number
  const WHATSAPP_NUMBER = "8801540045974"; // Replace with your WhatsApp number

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

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in your event services. Please tell me more about ${formData.eventType || "your services"}.`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      "_blank"
    );
    toast.info("Opening WhatsApp...", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored"
    });
  };

  const handleDirectCall = () => {
    window.location.href = `tel:${CONTACT_PHONE}`;
    toast.info("Initiating call...", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-2xl text-primary mb-6">
          Get In Touch
        </h3>

        {/* Tab Navigation */}
        <div className="tabs tabs-bordered mb-6 gap-3">
          <button
            onClick={() => setActiveTab("form")}
            className={`tab ${activeTab === "form" ? "tab-active" : ""} bg-primary text-white font-bold rounded-3xl`}
          >
            📋 Form
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`tab ${activeTab === "whatsapp" ? "tab-active" : "bg-green-600 text-white font-bold rounded-3xl"} `}
          >
            💬 WhatsApp
          </button>
          <button
            onClick={() => setActiveTab("call")}
            className={`tab ${activeTab === "call" ? "tab-active" : ""} bg-blue-600 text-white font-bold rounded-3xl`}
          >
            ☎️ Call
          </button>
        </div>

        {/* Form Tab */}
        {activeTab === "form" && (
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
        )}

        {/* WhatsApp Tab */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4">
            <div className="alert alert-info">
              <span>💡 Send us a message on WhatsApp for quick response!</span>
            </div>

            <div className="space-y-3">
              <p className="text-sm">Message Template:</p>
              <textarea
                placeholder="Hi, I'm interested in your event services..."
                className="textarea textarea-bordered w-full"
                rows="5"
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>

              <button
                onClick={handleWhatsApp}
                className="btn btn-success text-white"
              >
                💬 Open WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* Call Tab */}
        {activeTab === "call" && (
          <div className="space-y-4">
            <div className="alert alert-info">
              <span>☎️ Call us directly for immediate assistance!</span>
            </div>

            <div className="bg-base-200 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Business Phone:</p>
              <p className="text-3xl font-bold text-primary mb-4">
                {CONTACT_PHONE}
              </p>
              <p className="text-xs text-gray-500">
                Available 24/7 for your queries
              </p>
            </div>

            <div className="modal-action">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>

              <button
                onClick={handleDirectCall}
                className="btn btn-error text-white"
              >
                ☎️ Call Now
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
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