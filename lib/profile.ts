export const PROFILE_STORAGE_KEY = "giang-cosmetic:profile";

export type CustomerProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export function emptyProfile(): CustomerProfile {
  return { name: "", email: "", phone: "", address: "" };
}

export function parseProfile(raw: string | null): CustomerProfile {
  if (!raw) {
    return emptyProfile();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CustomerProfile>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      address: typeof parsed.address === "string" ? parsed.address : "",
    };
  } catch {
    return emptyProfile();
  }
}

export function readProfile(): CustomerProfile {
  if (typeof window === "undefined") {
    return emptyProfile();
  }
  return parseProfile(window.localStorage.getItem(PROFILE_STORAGE_KEY));
}

export function persistProfile(profile: CustomerProfile) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    PROFILE_STORAGE_KEY,
    JSON.stringify({
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
    }),
  );
}
