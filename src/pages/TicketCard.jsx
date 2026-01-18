import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TicketCard = ({ ticket }) => {
  const date = new Date(ticket.showtime.startTime).toDateString();
  const movie = ticket.showtime.movie.name;
  const theater = ticket.showtime.screen.theaterName;
  const seats = ticket.seatData.seats.map((s) => `${s.row}${s.column}`);
  const time = new Date(ticket.showtime.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const cleanClone = (node) => {
    const newNode = node.cloneNode(true);

    const walk = (el) => {
      el.removeAttribute("class");
      el.removeAttribute("style");

      for (let child of el.children) walk(child);
    };

    walk(newNode);
    return newNode;
  };

  const downloadTicket = async () => {
    const ticketEl = document.getElementById("ticket-card");
    if (!ticketEl) return alert("Ticket not found");

    const clone = cleanClone(ticketEl);

    // Apply ONLY safe styles
    Object.assign(clone.style, {
      width: "320px",
      padding: "20px",
      border: "2px solid #2563eb",
      borderRadius: "16px",
      backgroundColor: "#ffffff",
      color: "#000000",
      fontFamily: "Arial",
      lineHeight: "1.5",
    });

    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);
      pdf.save("ticket.pdf");

    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF");
    }

    document.body.removeChild(clone);
  };

  return (
    <div
      id="ticket-card"
      className="w-72 border-2 border-blue-400 rounded-2xl p-4 shadow-md bg-white"
    >
      <p className="text-blue-500 text-sm">Date</p>
      <p className="font-semibold text-gray-800 mb-2">{date}</p>

      <p className="text-blue-500 text-sm">Movie Title</p>
      <p className="font-semibold text-gray-800 mb-2 uppercase">{movie}</p>

      <p className="text-blue-500 text-sm">Theater</p>
      <p className="font-semibold text-gray-800 mb-2">{theater}</p>

      <div className="flex justify-between mb-3">
        <div>
          <p className="text-blue-500 text-sm">Ticket ({seats.length})</p>
          <p className="font-semibold text-gray-800">{seats.join(", ")}</p>
        </div>
        <div>
          <p className="text-blue-500 text-sm">Hours</p>
          <p className="font-semibold text-gray-800">{time}</p>
        </div>
      </div>

      <button
        onClick={downloadTicket}
        className="w-full border-2 border-blue-500 text-blue-500 font-medium py-1 rounded-lg hover:bg-blue-500 hover:text-white transition"
      >
        Download Ticket
      </button>
    </div>
  );
};

export default TicketCard;
