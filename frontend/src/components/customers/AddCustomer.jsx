import { useState } from "react";
import { customerAPI } from "../../utils/api";

const AddCustomer = ({ onClose, onSuccess }) => {

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    requirements: "",
    transactionStatus: "Not Purchased",
    reason: "",
    notes: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await customerAPI.create(formData);

      alert("Customer added successfully");

      onSuccess();

    } catch (error) {
      console.error(error);
      alert("Failed to add customer");
    }
  };

  return (
    <div className="card p-6 mb-4">

      <h2 className="text-xl font-bold mb-4">
        Add Customer
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="name"
          placeholder="Customer Name"
          className="input-field"
          required
          onChange={handleChange}
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          className="input-field"
          onChange={handleChange}
        />

        <select
          name="gender"
          className="input-field"
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="phone"
          placeholder="Phone"
          className="input-field"
          onChange={handleChange}
        />

        <textarea
          name="requirements"
          placeholder="Requirements"
          className="input-field"
          onChange={handleChange}
        />

        <select
          name="transactionStatus"
          className="input-field"
          onChange={handleChange}
        >
          <option>Purchased</option>
          <option>Not Purchased</option>
        </select>

        {formData.transactionStatus === "Not Purchased" && (
          <textarea
            name="reason"
            placeholder="Reason for not purchasing"
            className="input-field"
            onChange={handleChange}
          />
        )}

        <textarea
          name="notes"
          placeholder="Notes"
          className="input-field"
          onChange={handleChange}
        />

        <div className="flex gap-2">

          <button className="btn-primary flex-1">
            Save Customer
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddCustomer;