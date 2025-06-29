
import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loadingImages, setLoadingImages] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loadingImages) {
      setError("Please wait until images finish uploading.");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="newPostPage">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form-title">📝 Create a New Listing</h1>

        <div className="section">
          <h2>📍 Basic Information</h2>
          <div className="form-grid">
            <div className="form-item">
              <label>Title</label>
              <input name="title" type="text" required />
            </div>
            <div className="form-item">
              <label>Price</label>
              <input name="price" type="number" required />
            </div>
            <div className="form-item">
              <label>Address</label>
              <input name="address" type="text" required />
            </div>
            <div className="form-item">
              <label>City</label>
              <input name="city" type="text" required />
            </div>
            <div className="form-item">
              <label>Bedrooms</label>
              <input name="bedroom" type="number" min={1} required />
            </div>
            <div className="form-item">
              <label>Bathrooms</label>
              <input name="bathroom" type="number" min={1} required />
            </div>
            <div className="form-item">
              <label>Latitude</label>
              <input name="latitude" type="text" />
            </div>
            <div className="form-item">
              <label>Longitude</label>
              <input name="longitude" type="text" />
            </div>
            <div className="form-item">
              <label>Type</label>
              <select name="type">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="form-item">
              <label>Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>📝 Description & Policies</h2>
          <div className="form-grid">
            <div className="form-item description">
              <label>Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="form-item">
              <label>Utilities</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="form-item">
              <label>Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="form-item">
              <label>Income Requirement</label>
              <input name="income" type="text" />
            </div>
            <div className="form-item">
              <label>Total Size (sqft)</label>
              <input name="size" type="number" min={0} />
            </div>
            <div className="form-item">
              <label>Nearby Schools</label>
              <input name="school" type="number" min={0} />
            </div>
            <div className="form-item">
              <label>Nearby Bus</label>
              <input name="bus" type="number" min={0} />
            </div>
            <div className="form-item">
              <label>Nearby Restaurants</label>
              <input name="restaurant" type="number" min={0} />
            </div>
          </div>
        </div>

        <div className="section">
          <h2>📸 Upload Images</h2>
          <UploadWidget
            uwConfig={{
              multiple: true,
              cloudName: "lamadev",
              uploadPreset: "estate",
              folder: "posts",
            }}
            setState={(urls) => {
              setImages(urls);
              setLoadingImages(false);
            }}
            onUploadStart={() => {
              setLoadingImages(true);
              setError("");
            }}
          />
          {loadingImages && <p>Uploading images...</p>}
          <div className="preview">
            {images.map((img, i) => (
              <img key={i} src={img} alt={`img-${i}`} />
            ))}
          </div>
        </div>

        <button
          className="submit-btn"
          type="submit"
          disabled={loadingImages}
        >
          🚀 Submit Listing
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default NewPostPage;
