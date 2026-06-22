import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cinemaSeating.css";

const rows = ["A", "B", "C", "D", "E", "F", "G"];
const cols = 10;

export default function CinemaSeating() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  const generateSeats = () => {
    const seatLayout = [];

    rows.forEach((row) => {
      const rowSeats = [];

      for (let i = 1; i <= cols; i++) {
        const seatId = `${row}${i}`;
        let seatClass = "available";

        if (row === "A" || row === "B") seatClass = "vip";
        if (Math.random() < 0.1) seatClass = "booked";

        rowSeats.push({ id: seatId, class: seatClass });
      }

      seatLayout.push({ row, seats: rowSeats });
    });

    return seatLayout;
  };

  const [seats, setSeats] = useState(generateSeats);

  const toggleSeat = (row, seatId) => {
    setSeats((prevSeats) =>
      prevSeats.map((r) => {
        if (r.row !== row) return r;
        return {
          ...r,
          seats: r.seats.map((seat) =>
            seat.id === seatId && seat.class !== "booked"
              ? {
                ...seat,
                class: seat.class === "selected" ? "available" : "selected",
              }
              : seat
          ),
        };
      })
    );

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before booking.");
      return;
    }

    // Calculate total price (125 EGP per seat)
    const totalPrice = selectedSeats.length * 125;

    // Navigate to payment page with selected seats data
    navigate('/payment', {
      state: {
        show: 'Cinema Movie', // You can get this from props or state
        theater: 'Cinema Location', // You can get this from props or state
        time: '7:00 PM', // You can get this from props or state
        selectedSeats: selectedSeats,
        totalPrice: totalPrice
      }
    });
  };

  return (
    <div className="cinema-seating-wrapper">
      <div className="cinema-header-banner"></div>

      <div className="cinema-main-card">
        <div className="cinema-info">
          <h2>Choose Your Seats</h2>
          <p>Select from available seats below</p>
        </div>

        <div className="screen">SCREEN</div>

        <div className="seats-container">
          {seats.map((row) => (
            <div key={row.row} className="seat-row">
              <div className="row-label">{row.row}</div>
              <div className="seats">
                {row.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat ${seat.class}`}
                    onClick={() => toggleSeat(row.row, seat.id)}
                  >
                    {seat.id.replace(/[A-Z]/, "")}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="seat available" style={{ width: 24, height: 24, cursor: 'default' }}></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat vip" style={{ width: 24, height: 24, cursor: 'default' }}></div>
            <span>VIP</span>
          </div>
          <div className="legend-item">
            <div className="seat booked" style={{ width: 24, height: 24, cursor: 'default' }}></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="seat selected" style={{ width: 24, height: 24, cursor: 'default', transform: 'none' }}></div>
            <span>Selected</span>
          </div>
        </div>

        <div className="booking-summary">
          <p>Selected Seats: {selectedSeats.length}</p>
          <button
            className="book-button"
            disabled={selectedSeats.length === 0}
            onClick={handleBooking}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
