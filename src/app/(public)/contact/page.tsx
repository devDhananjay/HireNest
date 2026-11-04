"use client";

import { useState } from "react";
import { Briefcase, Mail } from "lucide-react";
import { IconOrb } from "@/components/brand/icon-orb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="container-shell grid gap-10 py-16 lg:grid-cols-2">
      <div>
        <p className="text-[12px] font-medium tracking-[0.16em] text-muted-foreground uppercase">Contact</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold sm:text-5xl">Talk to HIREORA</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          {BRAND.address}
          <br />
          {BRAND.phone} · {BRAND.email}
        </p>
        <form
          className="mt-8 space-y-3 rounded-[1.85rem] bg-white p-6 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            addInquiry(inquiry);
            setInquiry({ name: "", email: "", topic: "General", message: "" });
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <IconOrb icon={Mail} />
            <h2 className="font-heading text-xl font-semibold">Send a message</h2>
          </div>
          <Input required placeholder="Name" value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} />
          <Input required type="email" placeholder="Email" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} />
          <Input placeholder="Topic" value={inquiry.topic} onChange={(e) => setInquiry({ ...inquiry, topic: e.target.value })} />
          <Textarea required placeholder="How can we help?" value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} />
          <Button type="submit" className="h-11 rounded-full">
            Send
          </Button>
        </form>
      </div>
      <form
        className="mesh-dark space-y-3 rounded-[2rem] p-7 text-white shadow-lift"
        onSubmit={(e) => {
          e.preventDefault();
          addLead(lead);
          setLead({ companyName: "", contactName: "", email: "", phone: "", roles: "", location: "", hiringNeed: "" });
        }}
      >
        <div className="mb-2 flex items-center gap-3">
          <IconOrb icon={Briefcase} tone="light" />
          <h2 className="font-heading text-2xl font-semibold">Request a recruiter</h2>
        </div>
        <p className="text-sm text-white/65">No account required. Tell us what you need to hire.</p>
        <Input required placeholder="Company" value={lead.companyName} onChange={(e) => setLead({ ...lead, companyName: e.target.value })} className="bg-white text-foreground" />
        <Input required placeholder="Your name" value={lead.contactName} onChange={(e) => setLead({ ...lead, contactName: e.target.value })} className="bg-white text-foreground" />
        <Input required type="email" placeholder="Work email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className="bg-white text-foreground" />
        <Input required placeholder="Phone" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} className="bg-white text-foreground" />
        <Input placeholder="Roles" value={lead.roles} onChange={(e) => setLead({ ...lead, roles: e.target.value })} className="bg-white text-foreground" />
        <Input placeholder="Location" value={lead.location} onChange={(e) => setLead({ ...lead, location: e.target.value })} className="bg-white text-foreground" />
        <Textarea required placeholder="Hiring requirement" value={lead.hiringNeed} onChange={(e) => setLead({ ...lead, hiringNeed: e.target.value })} className="bg-white text-foreground" />
        <Button type="submit" className="h-11 rounded-full bg-white text-black hover:bg-white/90">
          Submit requirement
        </Button>
      </form>
    </div>
  );
}
