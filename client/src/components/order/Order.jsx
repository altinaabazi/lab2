import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import "./order.scss";

//const stripePromise = loadStripe("pk_test_51RSfHDQtoJs1pwT7gpsoZfWYtjAyqX5s3pDBC2k5RR34r2CNzUBgnn8qKQwJWdyoDrudJVUEteyLBiq3yrbnILX900nvPVWJp5");

const stripePromise = loadStripe("pk_test_51RVuwTE1C5TUC3cqE1LbZRb1DBpvficMSs7LqIbQKruaOnrpLZyhKiT7nKv3AwVhLYF1PDeR5QsqfOT20KNkV15C00iOT4oNts");

function CheckoutForm({ apartmentId, price, onClose, onUpdateSoldStatus }) {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: currentUser?.email || "",
    paymentMethod: "cash", // default cash
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      setMessage("Ju lutem plotësoni të gjitha fushat.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (formData.paymentMethod === "cash") {
        // Porosia Cash - thjesht dergo në backend pa Stripe
        await axios.post("http://localhost:8800/api/orders", {
          userId: currentUser.id,
          apartmentId,
          amount: Math.round(price * 100),
          paymentMethod: "cash",
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
        });

        setMessage("Porosia u krye me sukses me Cash.");

        // Përditëso statusin në parent që banesa është shitur
        if (onUpdateSoldStatus) onUpdateSoldStatus(apartmentId, true);

        setTimeout(() => {
          onClose();
        }, 2000);

      } else if (formData.paymentMethod === "stripe") {
        // Krijo porosi dhe merr clientSecret për Stripe
        const res = await axios.post("http://localhost:8800/api/orders", {
          userId: currentUser.id,
          apartmentId,
          amount: Math.round(price * 100),
          paymentMethod: "stripe",
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
        });

        const clientSecret = res.data.clientSecret;

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        if (result.error) {
          setMessage("Gabim në pagesë: " + result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
          setMessage("Pagesa u krye me sukses!");

          // Thërrit backend për të përditësuar statusin e apartamentit si 'sold'
          await axios.post("http://localhost:8800/api/orders/mark-sold", {
            apartmentId,
            paymentIntentId: result.paymentIntent.id,
          });

          // Përditëso statusin në parent që banesa është shitur
          if (onUpdateSoldStatus) onUpdateSoldStatus(apartmentId, true);

          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Gabim gjatë përpunimit të porosisë.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h2>Blerja e apartamentit</h2>
      <p>Çmimi: ${price.toFixed(2)}</p>

      <label>Emri:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Nr. telefoni:</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label>Mënyra e pagesës:</label>
      <div>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={formData.paymentMethod === "cash"}
            onChange={handleChange}
          />
          Cash
        </label>

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="paymentMethod"
            value="stripe"
            checked={formData.paymentMethod === "stripe"}
            onChange={handleChange}
          />
          Stripe
        </label>
      </div>

      {formData.paymentMethod === "stripe" && (
        <>
          <label>Detajet e kartës:</label>
          <CardElement />
        </>
      )}

      <button
        type="submit"
        disabled={loading || (formData.paymentMethod === "stripe" && !stripe)}
      >
        {loading ? "Duke procesuar..." : "Porositi"}
      </button>

      {message && <p className="message">{message}</p>}

      <button type="button" onClick={onClose}>
        Mbyll
      </button>
    </form>
  );
}

function Order({ postId, price, onClose, onUpdateSoldStatus }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <div className="order-popup">
        <p>Duhet të jeni i kyçur për të bërë një porosi.</p>
        <button onClick={onClose}>Mbyll</button>
      </div>
    );
  }

  return (
    <div className="order-popup">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          apartmentId={postId}
          price={price}
          onClose={onClose}
          onUpdateSoldStatus={onUpdateSoldStatus}
        />
      </Elements>
    </div>
  );
}

export default Order;
