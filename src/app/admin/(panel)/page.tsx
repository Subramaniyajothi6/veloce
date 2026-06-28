import Link from "next/link";
import { connectDB, dbConfigured } from "@/lib/db";
import { getCars } from "@/lib/inventory";
import { BookingModel } from "@/models/Booking";

export default async function AdminDashboard() {
  const cars = await getCars();

  let bookingCount = 0;
  let newBookings = 0;
  let dbOk = false;
  if (dbConfigured()) {
    try {
      const conn = await connectDB();
      if (conn) {
        dbOk = true;
        bookingCount = await BookingModel.estimatedDocumentCount();
        newBookings = await BookingModel.countDocuments({ status: "new" });
      }
    } catch {
      dbOk = false;
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <span className="eyebrow">
          <b>Overview</b> Dashboard
        </span>
        <h1 className="font-display uppercase text-[clamp(2rem,5vw,3rem)] leading-none mt-2">
          Control room
        </h1>
      </div>

      {!dbConfigured() && (
        <div className="border border-veloce/40 bg-veloce/10 px-5 py-4 font-mono text-[0.8rem] text-cream leading-relaxed">
          <b className="text-veloce">No database connected.</b> Inventory is shown
          read-only from the built-in data. Set <code>MONGODB_URI</code> (and run{" "}
          <code>npm run seed</code>) to manage cars and capture bookings.
        </div>
      )}
      {dbConfigured() && !dbOk && (
        <div className="border border-veloce/40 bg-veloce/10 px-5 py-4 font-mono text-[0.8rem] text-cream">
          <b className="text-veloce">Database unreachable.</b> Check{" "}
          <code>MONGODB_URI</code> and your Atlas network access.
        </div>
      )}

      <div className="grid grid-cols-3 gap-5 max-[760px]:grid-cols-1">
        <Link
          href="/admin/cars"
          className="border border-line bg-panel p-6 hover:border-veloce transition-colors group"
        >
          <div className="font-mono font-semibold tabular-nums text-[2.6rem] leading-none">
            {cars.length}
          </div>
          <div className="font-mono text-[0.66rem] tracking-[0.24em] uppercase text-ash mt-3 group-hover:text-cream">
            Cars in range →
          </div>
        </Link>

        <Link
          href="/admin/bookings"
          className="border border-line bg-panel p-6 hover:border-veloce transition-colors group"
        >
          <div className="font-mono font-semibold tabular-nums text-[2.6rem] leading-none">
            {bookingCount}
          </div>
          <div className="font-mono text-[0.66rem] tracking-[0.24em] uppercase text-ash mt-3 group-hover:text-cream">
            Test-drive bookings →
          </div>
        </Link>

        <div className="border border-line bg-panel p-6">
          <div className="font-mono font-semibold tabular-nums text-[2.6rem] leading-none text-veloce">
            {newBookings}
          </div>
          <div className="font-mono text-[0.66rem] tracking-[0.24em] uppercase text-ash mt-3">
            New / unactioned
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link href="/admin/cars/new" className="btn btn-red">
          <span>Add a car</span> <b className="arr">→</b>
        </Link>
        <Link href="/admin/cars" className="btn btn-ghost">
          <span>Manage inventory</span>
        </Link>
      </div>
    </div>
  );
}
