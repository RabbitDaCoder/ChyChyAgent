import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useState } from "react";
import { Phone } from "lucide-react";
import api from "../../utils/api";

const CALENDLY_URL =
  "https://calendly.com/edehchinedu59/phone-call?hide_event_type_details=1&hide_gdpr_banner=1";

function openCalendlyPopup() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "General",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post("/contact", form);
    setSubmitting(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      service: "General",
      message: "",
    });
  };

  return (
    <section className="grid gap-10 py-10 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-label text-primary uppercase tracking-wide">
          Contact
        </p>
        <h1 className="font-display text-display-lg text-text-primary">
          Let’s talk about your property and protection goals.
        </h1>
        <form className="space-y-4" onSubmit={submit}>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <label className="flex flex-col gap-2 text-label text-text-muted">
            Service interest
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="rounded-md border border-border bg-surface px-3 py-3 text-body-md"
            >
              <option>General</option>
              <option>Real Estate</option>
              <option>Insurance</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-label text-text-muted">
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              className="min-h-[120px] rounded-md border border-border bg-surface px-3 py-3 text-body-md text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
            />
          </label>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>

      <div className="rounded-lg border border-border bg-surface-soft p-6 shadow-card space-y-3">
        <h3 className="font-display text-xl text-text-primary">
          Contact Maryann Directly
        </h3>
        <p className="text-body-md text-text-muted">
          You are contacting Maryann Chieboam Eloike directly. Every message is
          read and personally responded to.
        </p>
        <p className="font-mono text-label text-text-muted">
          15 years experience · AIICO Insurance · AY Housing
        </p>
        <p className="text-body-md text-text-muted">
          Festac Town, Lagos, Nigeria <br />
          +234 (0) 812-000-0000 <br />
          hello@chychyagent.com
        </p>
        <p className="text-body-sm text-text-muted">
          Business hours: Mon–Fri 9am–6pm WAT
        </p>
        <div className="mt-4 h-52 overflow-hidden rounded-lg">
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15854.952372844095!2d3.2750!3d6.4631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8901d6e01b6b%3A0xd97cfe634a9e41c4!2sFestac%20Town%2C%20Lagos!5e0!3m2!1sen!2sng!4v1710000000000!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-soft p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Phone size={24} className="text-primary" />
          </div>
          <h2 className="font-display text-display-md text-text-primary">
            Prefer to talk it through?
          </h2>
          <p className="text-body-md text-text-muted max-w-lg">
            Book a free 45-minute phone consultation to discuss your property or
            insurance needs directly with our team.
          </p>
          <Button variant="primary" size="lg" onClick={openCalendlyPopup}>
            <Phone size={16} />
            Schedule a Call
          </Button>
        </div>
      </div>
    </section>
  );
}
