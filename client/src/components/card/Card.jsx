import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./card.scss";
import Order from "../order/Order";

function Card({ item }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isSold, setIsSold] = useState(item.isSold);

  const openOrderForm = () => setShowOrderForm(true);
  const closeOrderForm = () => setShowOrderForm(false);

  // Funksioni që do të përditësojë statusin në Card pas pagesës
  const handleSoldStatusUpdate = (id, sold) => {
    if (id === item.id) {
      setIsSold(sold);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>

      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="feature">
            <img src="/bed.png" alt="" />
            <span>{item.bedroom} bedroom</span>
          </div>
          <div className="feature">
            <img src="/bath.png" alt="" />
            <span>{item.bathroom} bathroom</span>
          </div>
          <div className="icons">
            {/* <div className="icon">
              <img src="/save.png" alt="" />
            </div> */}
            {/* <div className="icon">
              <Link to={`/chat/${item.id}`}>
                <img src="/chat.png" alt="" />
              </Link>
            </div> */}
          </div>
        </div>

        <button
          className="buyButton"
          onClick={openOrderForm}
          disabled={isSold}
        >
          {isSold ? "Sold Out" : "Buy"}
        </button>
      </div>

      {showOrderForm && (
        <Order
          postId={item.id}
          price={item.price}
          onClose={closeOrderForm}
          onUpdateSoldStatus={handleSoldStatusUpdate}
        />
      )}
    </div>
  );
}

export default Card;
