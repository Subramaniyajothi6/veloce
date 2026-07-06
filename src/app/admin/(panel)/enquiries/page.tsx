import { connectDB, dbConfigured } from "@/lib/db";
import { EnquiryModel } from "@/models/Enquiry";
import { deleteEnquiry, updateEnquiryStatus } from "../actions";

interface LeanEnquiry {
  _id: unknown;
  service: string;
  serviceTitle?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  details?: Map<string, string> | Record<string, string> | null;
  message?: string | null;
  status?: string | null;
  createdAt?: Date;
}

const STATUSES = ["new", "contacted", "closed"] as const;

function detailEntries(details: LeanEnquiry["details"]): [string, string][] {
  if (!details) return [];
  return details instanceof Map
    ? Array.from(details.entries())
    : Object.entries(details);
}

export default async function AdminEnquiriesPage() {
  let enquiries: LeanEnquiry[] = [];
  let dbOk = false;

  if (dbConfigured()) {
    try {
      const conn = await connectDB();
      if (conn) {
        dbOk = true;
        enquiries = await EnquiryModel.find()
          .sort({ createdAt: -1 })
          .lean<LeanEnquiry[]>();
      }
    } catch {
      dbOk = false;
    }
  }

  return (
    <div className="grid gap-8">
      <div>
        <span className="eyebrow">
          <b>{String(enquiries.length).padStart(2, "0")}</b> Leads
        </span>
        <h1 className="font-display uppercase text-[clamp(2rem,5vw,3rem)] leading-none mt-2">
          Service enquiries
        </h1>
      </div>

      {!dbConfigured() && (
        <div className="border border-veloce/40 bg-veloce/10 px-5 py-4 font-mono text-[0.8rem] text-cream">
          <b className="text-veloce">No database connected.</b> Enquiries are only
          captured once <code>MONGODB_URI</code> is set.
        </div>
      )}
      {dbConfigured() && !dbOk && (
        <div className="border border-veloce/40 bg-veloce/10 px-5 py-4 font-mono text-[0.8rem] text-cream">
          <b className="text-veloce">Database unreachable.</b>
        </div>
      )}
      {dbOk && enquiries.length === 0 && (
        <p className="font-mono text-[0.8rem] text-ash">No enquiries yet.</p>
      )}

      {enquiries.length > 0 && (
        <div className="border border-line divide-y divide-line">
          {enquiries.map((e) => {
            const id = String(e._id);
            const details = detailEntries(e.details);
            return (
              <div
                key={id}
                className="grid grid-cols-[1fr_auto] gap-4 px-4 py-4 max-[700px]:grid-cols-1"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-mono text-[0.64rem] tracking-[0.18em] uppercase text-veloce border border-veloce/40 px-2 py-0.5">
                      {e.serviceTitle ?? e.service}
                    </span>
                    <span className="text-cream">{e.name}</span>
                    <a
                      href={`mailto:${e.email}`}
                      className="font-mono text-[0.72rem] text-ash hover:text-veloce"
                    >
                      {e.email}
                    </a>
                    {e.phone && (
                      <a
                        href={`tel:${e.phone}`}
                        className="font-mono text-[0.72rem] text-ash hover:text-veloce"
                      >
                        {e.phone}
                      </a>
                    )}
                  </div>
                  {details.length > 0 && (
                    <div className="font-mono text-[0.72rem] tracking-[0.1em] text-ash mt-1">
                      {details.map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </div>
                  )}
                  <div className="font-mono text-[0.72rem] tracking-[0.1em] text-ash/70 mt-1">
                    {e.createdAt
                      ? `received ${new Date(e.createdAt).toLocaleString()}`
                      : ""}
                  </div>
                  {e.message && (
                    <p className="text-ash/90 text-[0.85rem] mt-2 max-w-[44rem]">
                      “{e.message}”
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <form action={updateEnquiryStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={id} />
                    <select
                      name="status"
                      defaultValue={e.status ?? "new"}
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
                  <form action={deleteEnquiry}>
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
