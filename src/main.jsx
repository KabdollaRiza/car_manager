import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import './Index.css';

const root = createRoot(document.getElementById("root"));

function CarPage({ carsList }) {
  const { id } = useParams();
  const car = carsList.find(c => c.id === parseInt(id));

  if (!car) return <div className="container py-5"><h3>Car not found!</h3></div>;

  return (
    <div className="container py-5">
      <h2>Car Details (ID: {car.id})</h2>
      <p><strong>Brand:</strong> {car.brand}</p>
      <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
    </div>
  );
}

function Home({ carsList, setCarsList }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [car, setCar] = useState({ brand: ""});

  const [searchBrand, setSearchBrand] = useState("");
  const [filteredCars, setFilteredCars] = useState(carsList);

  const TITLE = "Car Manager";
  const MIN_PRICE = 1;
  const MIN_YEAR = 1900;
  const MAX_YEAR = new Date().getFullYear();

  useEffect(() => {
    setFilteredCars(
      carsList.filter(c =>
        c.brand.toLowerCase().includes(searchBrand.toLowerCase())
      )
    );
  }, [searchBrand, carsList]);

  const handleChange = (e) => setCar({ ...car, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (car.price < MIN_PRICE) {
      alert(`Price must be at least ${MIN_PRICE}`);
      return;
    }
    if (car.year < MIN_YEAR || car.year > MAX_YEAR) {
      alert(`Year must be between ${MIN_YEAR} and ${MAX_YEAR}`);
      return;
    }

    if (editingId) {
      setCarsList(carsList.map(c => c.id === editingId ? { ...car, id: editingId } : c));
      setEditingId(null);
    } else {
      setCarsList([...carsList, { ...car, id: Date.now() }]);
    }

    setCar({ brand: "", model: "", year: "", price: "" });
    setShowForm(false);
  };

  const handleEdit = (c) => {
    setCar({ brand: c.brand, model: c.model, year: c.year, price: c.price });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      setCarsList(carsList.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="main position-relative vh-100">
        <div className="overlay"></div>

        <div className="main-content d-flex flex-column justify-content-center align-items-center vh-100 position-relative z-2 text-center">
          <h1 className="mainText text-white">{TITLE}</h1>
          <button
            type="button"
            className="btn btn-outline-light mt-3"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setCar({ brand: "", model: "", year: "", price: "" });
            }}
          >
            {editingId ? "Edit Car" : "Add a new car"}
          </button>

          {showForm && (
            <form className="mt-4 p-4 border rounded bg-light w-50" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Brand</label>
                <input type="text" className="form-control" name="brand" value={car.brand} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Model</label>
                <input type="text" className="form-control" name="model" value={car.model} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Year</label>
                <input type="number" className="form-control" name="year" value={car.year} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" className="form-control" name="price" value={car.price} onChange={handleChange} required min={MIN_PRICE}/>
                {car.price !== "" && car.price < MIN_PRICE && (
                  <div className="text-danger mt-1">Price must be at least {MIN_PRICE}</div>
                )}
              </div>
              <button type="submit" className="btn btn-success">
                {editingId ? "Update Car" : "Save Car"}
              </button>
            </form>
          )}
        </div>
      </div>
 
       <nav className="navbar bg-body-transparent d-flex justify-content-center position-relative z-2">
          <div className="w-50">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by brand"
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
            />
          </div>
        </nav>

      <div className="container py-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-4">
          {filteredCars.map((c) => (
            <div className="col" key={c.id}>
              <div className="card">
                <div className="card-body">
                  <h6 className="text-muted">ID: {c.id}</h6>
                  <h5 className="card-title">
                    <Link to={`/cars/${c.id}`}>{c.brand} {c.model}</Link>
                  </h5>
                  <p className="card-text">Year: {c.year}</p>
                  <p className="card-text">Price: ${c.price}</p>
                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredCars.length === 0 && <p className="text-center mt-3">No cars found</p>}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [carsList, setCarsList] = useState([]);

  useEffect(() => {
    const storedCars = localStorage.getItem("carsList");
    if (storedCars) setCarsList(JSON.parse(storedCars));
  }, []);

  useEffect(() => {
    localStorage.setItem("carsList", JSON.stringify(carsList));
  }, [carsList]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home carsList={carsList} setCarsList={setCarsList} />} />
        <Route path="/cars/:id" element={<CarPage carsList={carsList} />} />
      </Routes>
    </Router>
  );
}

root.render(<App />);