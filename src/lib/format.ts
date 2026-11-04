export function formatINR(amount: number) {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} LPA`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function salaryRange(min: number, max: number) {
  return `${formatINR(min)} – ${formatINR(max)}`;
}

export function experienceRange(min: number, max: number) {
  if (min === 0 && max <= 1) return "Fresher";
  return `${min}–${max} yrs`;
}

export function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const delta = Date.now() - then;
  const days = Math.floor(delta / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function postedOn(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calendarParts(iso: string) {
  const date = new Date(iso);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString("en-IN", { month: "short" }),
    weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
    time: date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    full: date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  };
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
