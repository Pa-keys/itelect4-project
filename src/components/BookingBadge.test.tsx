import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BookingStatus, type Booking } from "../types";
import { BookingBadge } from "./BookingBadge";

describe("BookingBadge", () => {
  it("shows the booking status", () => {
    const booking: Booking = {
      id: "booking-1",
      sessionId: "session-1",
      tuteeId: "tutee-1",
      status: BookingStatus.Confirmed,
      createdAt: new Date("2026-10-29T00:00:00.000Z"),
    };

    render(<BookingBadge booking={booking} />);

    expect(screen.getByText("confirmed")).toBeVisible();
  });
});
