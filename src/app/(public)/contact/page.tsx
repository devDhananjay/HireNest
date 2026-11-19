"use client";

import { useState } from "react";
import {
  Briefcase,
  Building2,
  ClipboardList,
  Hash,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  User,
} from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { Button } from "@/components/ui/button";
import { IconField, IconTextarea } from "@/components/ui/icon-field";
import { BRAND } from "@/lib/constants";
import { useDemo } from "@/lib/store";

export default function ContactPage() {
  const { addInquiry, addLead } = useDemo();
  const [inquiry, setInquiry] = useState({ name: "", email: "", topic: "General", message: "" });
  const [lead, setLead] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    roles: "",
    location: "",
    hiringNeed: "",
  });

  return (
    <div className="container-shell grid items-start gap-8 py-14 lg:grid-cols-2 lg:gap-10 lg:py-16">
      <div>
        <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Contact</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Talk to HIREORA</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          Reach us for employer mandates, candidate support, partnerships or product questions. General messages go to
          our inbox; hiring requirements create a lead for a consultant to follow up within one business day.
        </p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {BRAND.address}
          <br />
          {BRAND.phone} · {BRAND.email}
        </p>
        <ul className="mt-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>Employers — role briefs, bulk programmes, executive search</li>
          <li>Candidates — profile or application help (include your registered email)</li>
          <li>Partners — campus, staffing or technology collaborations</li>
        </ul>
        <form
          className="mt-8 flex flex-col gap-5 rounded-[1.85rem] bg-white p-6 shadow-soft sm:p-7"
          onSubmit={(e) => {
            e.preventDefault();
            addInquiry(inquiry);
            setInquiry({ name: "", email: "", topic: "General", message: "" });
          }}
        >
          <div className="flex items-center gap-3">
            <IconOrb icon={Mail} />
            <h2 className="font-heading text-xl font-semibold">Send a message</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <IconField
              icon={User}
              required
              placeholder="Name"
              value={inquiry.name}
              onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
            />
            <IconField
              icon={Mail}
              required
              type="email"
              placeholder="Email"
              value={inquiry.email}
              onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
            />
          </div>
          <IconField
            icon={Hash}
            placeholder="Topic"
            value={inquiry.topic}
            onChange={(e) => setInquiry({ ...inquiry, topic: e.target.value })}
          />
          <IconTextarea
            icon={MessageSquareText}
            required
            rows={4}
            placeholder="How can we help?"
            value={inquiry.message}
            onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
          />
          <Button type="submit" className="h-11 w-fit rounded-full">
            Send
          </Button>
        </form>
      </div>
      <form
        className="mesh-dark flex h-fit flex-col gap-5 self-start rounded-[2rem] p-6 text-white shadow-lift lg:sticky lg:top-24 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          addLead(lead);
          setLead({ companyName: "", contactName: "", email: "", phone: "", roles: "", location: "", hiringNeed: "" });
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <IconOrb icon={Briefcase} tone="light" />
            <h2 className="font-heading text-2xl font-semibold">Request a recruiter</h2>
          </div>
          <p className="text-sm leading-6 text-white/65">
            No account required. Share company, roles, locations and urgency — a HIREORA consultant will respond with next
            steps and whether self-serve posting or a managed search fits better.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <IconField
            icon={Building2}
            required
            placeholder="Company"
            value={lead.companyName}
            onChange={(e) => setLead({ ...lead, companyName: e.target.value })}
            inputClassName="bg-white text-foreground"
          />
          <IconField
            icon={User}
            required
            placeholder="Your name"
            value={lead.contactName}
            onChange={(e) => setLead({ ...lead, contactName: e.target.value })}
            inputClassName="bg-white text-foreground"
          />
          <IconField
            icon={Mail}
            required
            type="email"
            placeholder="Work email"
            value={lead.email}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
            inputClassName="bg-white text-foreground"
          />
          <IconField
            icon={Phone}
            required
            placeholder="Phone"
            value={lead.phone}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            inputClassName="bg-white text-foreground"
          />
          <IconField
            icon={Briefcase}
            placeholder="Roles"
            value={lead.roles}
            onChange={(e) => setLead({ ...lead, roles: e.target.value })}
            inputClassName="bg-white text-foreground"
          />
          <IconField
            icon={MapPin}
            placeholder="Location"
            value={lead.location}
            onChange={(e) => setLead({ ...lead, location: e.target.value })}
            inputClassName="bg-white text-foreground"
          />
        </div>
        <IconTextarea
          icon={ClipboardList}
          required
          rows={4}
          placeholder="Hiring requirement — roles, volume, timeline"
          value={lead.hiringNeed}
          onChange={(e) => setLead({ ...lead, hiringNeed: e.target.value })}
          textareaClassName="min-h-[7.5rem] resize-y bg-white text-foreground"
        />
        <Button type="submit" className="h-11 w-full rounded-full bg-white text-black hover:bg-white/90">
          Submit requirement
        </Button>
      </form>
    </div>
  );
}
