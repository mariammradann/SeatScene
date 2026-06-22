import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TheaterSeating.css';

const generateMockSeats = () => {
  const seatData = [];

  // Orchestra
  const orchestraRows = ['A', 'B', 'C', 'D', 'E'];
  orchestraRows.forEach((rowLabel, rowIndex) => {
    const baseSeats = 8 + rowIndex * 2;
    const startSeat = Math.floor((16 - baseSeats) / 2) + 1;
    for (let number = startSeat; number < startSeat + baseSeats; number++) {
      let type = 'standard';
      let price = 125; // Any seat price set to 125 EGP
      if (rowIndex <= 1) { type = 'vip'; }
      else if (rowIndex <= 2) { type = 'premium'; }
      if (rowLabel === 'E' && (number === startSeat || number === startSeat + baseSeats - 1)) {
        type = 'accessible';
      }
      const isBooked = Math.random() > (rowIndex < 2 ? 0.7 : 0.5);
      seatData.push({
        id: `orchestra-${rowLabel}-${number}`,
        row: rowLabel,
        number,
        type,
        price,
        isBooked,
        section: 'orchestra',
      });
    }
  });

  // Mezzanine
  const mezzanineRows = ['F', 'G', 'H', 'I', 'J'];
  mezzanineRows.forEach((rowLabel, rowIndex) => {
    const baseSeats = 6 + rowIndex;
    const startSeat = Math.floor((12 - baseSeats) / 2) + 1;
    for (let number = startSeat; number < startSeat + baseSeats; number++) {
      let type = 'standard';
      let price = 125; // Any seat price set to 125 EGP
      if (rowIndex <= 1) { type = 'vip'; }
      else if (rowIndex <= 2) { type = 'premium'; }
      if (rowLabel === 'J' && (number === startSeat || number === startSeat + baseSeats - 1)) {
        type = 'accessible';
      }
      const isBooked = Math.random() > (rowIndex < 2 ? 0.7 : 0.5);
      seatData.push({
        id: `mezzanine-${rowLabel}-${number}`,
        row: rowLabel,
        number,
        type,
        price,
        isBooked,
        section: 'mezzanine',
      });
    }
  });

  return seatData;
};

export default function TheaterSeating() {
  const location = useLocation();
  const navigate = useNavigate();

  // DEBUG: shows what was passed
  console.log('TheaterSeating location.state ->', location.state);

  const { show, selectedTime, location: theaterLocation } = location.state || {
    show: { title: 'Test Show' },
    selectedTime: '9:00 PM',
    location: 'Test Location',
  };

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      try {
        setSeats(generateMockSeats());
        setError(null);
      } catch (e) {
        setError('Failed to load seating data.');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleSeatClick = (id) => {
    const seat = seats.find((s) => s.id === id);
    if (!seat || seat.isBooked) return;
    setSelectedSeats((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const calculateTotal = () => selectedSeats.reduce((sum, id) => {
    const s = seats.find((x) => x.id === id);
    return sum + (s?.price || 0);
  }, 0).toFixed(2);

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;
    navigate('/payment', {
      state: {
        show,
        theater: theaterLocation,
        time: selectedTime,
        selectedSeats,
        totalPrice: calculateTotal(),
      },
    });
  };

  const handleBack = () => navigate(-1);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading seating...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }

  if (!show || !selectedTime || !theaterLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">Missing show or time information.</p>
          <button onClick={handleBack} className="px-4 py-2 bg-indigo-600 text-white rounded">Back</button>
        </div>
      </div>
    );
  }

  const orchestraSeats = seats.filter((s) => s.section === 'orchestra');
  const mezzanineSeats = seats.filter((s) => s.section === 'mezzanine');

  const groupRows = (list) => list.reduce((acc, seat) => {
    (acc[seat.row] = acc[seat.row] || []).push(seat);
    return acc;
  }, {});

  const orchestraRows = groupRows(orchestraSeats);
  const mezzanineRows = groupRows(mezzanineSeats);

  const seatClass = (seat) => {
    const base = 'seat';
    if (seat.isBooked) return `${base} booked`;
    if (selectedSeats.includes(seat.id)) return `${base} selected`;
    if (seat.type === 'vip') return `${base} vip`;
    if (seat.type === 'premium') return `${base} premium`;
    return `${base} available`;
  };

  const total = calculateTotal();

  return (
    <div className="theater-seating-wrapper">
      <div className="theater-header-banner"></div>
      <div className="theater-main-card">
        <div className="flex items-center justify-between mb-6" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto 20px auto' }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#fff', margin: 0 }}>{show.title}</h2>
            <div className="text-sm" style={{ color: '#aaa', marginTop: 4 }}>{theaterLocation} — {selectedTime}</div>
          </div>
          <button onClick={handleBack} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition" style={{ border: 'none', cursor: 'pointer', borderRadius: '8px' }}>Back</button>
        </div>

        <div className="theater-info">
          <h2>Choose Your Seats</h2>
          <p>Select from available seats below</p>
        </div>

        <div className="stage-screen">STAGE</div>

        <div className="seats-container">
          <div className="mb-8" style={{ width: '100%' }}>
            <h3 className="text-lg text-white mb-3 text-center" style={{ fontFamily: "'Berkshire Swash', cursive" }}>ORCHESTRA</h3>
            <div className="flex flex-col gap-3 items-center">
              {Object.keys(orchestraRows).map((r) => (
                <div key={r} className="seat-row">
                  <div className="row-label">{r}</div>
                  <div className="seats">
                    {orchestraRows[r].map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        className={seatClass(seat)}
                        disabled={seat.isBooked}
                        title={`Row ${seat.row} Seat ${seat.number} — ${seat.type} — ${seat.price} EGP`}
                        aria-label={`Seat ${seat.number} ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                  <div className="row-label" style={{ marginLeft: 20 }}>{r}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <h3 className="text-lg text-white mb-3 text-center" style={{ fontFamily: "'Berkshire Swash', cursive" }}>MEZZANINE</h3>
            <div className="flex flex-col gap-3 items-center">
              {Object.keys(mezzanineRows).map((r) => (
                <div key={r} className="seat-row">
                  <div className="row-label">{r}</div>
                  <div className="seats">
                    {mezzanineRows[r].map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        className={seatClass(seat)}
                        disabled={seat.isBooked}
                        title={`Row ${seat.row} Seat ${seat.number} — ${seat.type} — ${seat.price} EGP`}
                        aria-label={`Seat ${seat.number} ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                  <div className="row-label" style={{ marginLeft: 20 }}>{r}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="legend" style={{ margin: '40px auto' }}>
          <div className="legend-item"><div className="legend-color standard" /> Standard</div>
          <div className="legend-item"><div className="legend-color premium" /> Premium</div>
          <div className="legend-item"><div className="legend-color vip" /> VIP</div>
          <div className="legend-item"><div className="legend-color selected" /> Selected</div>
          <div className="legend-item"><div className="legend-color booked" /> Booked</div>
        </div>

        <div className="booking-summary" style={{ margin: '20px auto 40px auto' }}>
          <p>Seats Selected: <strong style={{ color: '#ab47bc' }}>{selectedSeats.length}</strong></p>
          <p style={{ margin: '10px 0 25px 0' }}>Total Price: <strong style={{ color: '#ab47bc' }}>{total} EGP</strong></p>
          <div className="flex gap-4 justify-center" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="book-button"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setSelectedSeats([])}
              disabled={selectedSeats.length === 0}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 transition text-white rounded-full font-bold"
              style={{ border: 'none', cursor: 'pointer', borderRadius: '50px', display: 'inline-block', fontFamily: "'Berkshire Swash', cursive" }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}