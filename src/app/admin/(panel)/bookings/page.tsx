import { connectDB, dbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { deleteBooking, updateBookingStatus } from "../actions";

interface LeanBooking {
  _id: unknown;
  name: string;
  email: string;
  phone?: string | null;
  carSlug: string;
  carName?: string | null;
  location: string;
  date: string;
  message?: string | null;
  status?: string | null;
  createdAt?: Date;
}

const STATUSES = ["new", "contacted", "closed"] as const;

export default async function AdminBookingsPage() {
  let bookings: LeanBooking[] = [];
  let dbOk = false;

  if (dbConfigured()) {
    try {
      const conn = await connectDB();
      if (conn) {
        dbOk = true;
        bookings = await BookingModel.find()
          .sort({ createdAt: -1 })
          .lean<LeanBooking[]>();
      }
    } catch {
      dbOk = false;
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <span className="eyebrow">
          <b>{String(bookings.length).padStart(2, "0")}</b> Requests
        </span>
        <h1 className="font-display uppercase text-[clamp(2rem,5vw,3rem)] leading-none mt-2">
          Test-drive bookings
        </h1>
      </div>

      {!dbConfigured() && (
        <div className="border border-veloce/40 bg-veloce/10 px-5 py-4 font-mono text-[0.8rem] text-cream">
          <b className="text-veloce">No database connected.</b> Bookings are only
          captured once <code>MONGODB_URI</code> is set.
        </div>
      )}
      {dbConfigured() && !dbOk && (
        <div className="border border-veloce/40 bg-veloce/10 px-5 py-4 font-mono text-[0.8rem] text-cream">
          <b className="text-veloce">Database unreachable.</b>
        </div>
      )}
      {dbOk && bookings.length === 0 && (
        <p className="font-mono text-[0.8rem] text-ash">No bookings yet.</p>
      )}

      {bookings.length > 0 && (
        <div className="border border-line divide-y divide-line">
          {bookings.map((b) => {
            const id = String(b._id);
            return (
              <div
                key={id}
                className="grid grid-cols-[1fr_auto] gap-4 px-4 py-4 max-[700px]:grid-cols-1"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-cream">{b.name}</span>
                    <a
                      href={`mailto:${b.email}`}
                      className="font-mono text-[0.72rem] text-ash hover:text-veloce"
                    >
                      {b.email}
                    </a>
                    {b.phone && (
                      <a
                        href={`tel:${b.phone}`}
                        className="font-mono text-[0.72rem] text-ash hover:text-veloce"
                      >
                        {b.phone}
                      </a>
                    )}
                  </div>
                  <div className="font-mono text-[0.72rem] tracking-[0.1em] text-ash mt-1">
                    {b.carName ?? b.carSlug} · {b.location} · {b.date}
                    {b.createdAt
                      ? ` · booked ${new Date(b.createdAt).toLocaleDateString()}`
                      : ""}
                  </div>
                  {b.message && (
                    <p className="text-ash/90 text-[0.85rem] mt-2 max-w-[44rem]">
                      “{b.message}”
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <form action={updateBookingStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={id} />
                    <select
                      name="status"
                      defaultValue={b.status ?? "new"}
                      className="bg-panel border border-line px-2 py-1.5 text-cream font-mono text-[0.7rem] uppercase tracking-[0.12em] outline-none focus:border-veloce"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-cream hover:text-veloce border border-line px-3 py-1.5">
                      Set
                    </button>
                  </form>
                  <form action={deleteBooking}>
                    <input type="hidden" name="id" value={id} />
                    <button className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-ash hover:text-veloce border border-line px-3 py-1.5">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
