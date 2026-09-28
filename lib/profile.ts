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

const EMPTY_PROFILE = emptyProfile();
const profileListeners = new Set<() => void>();
let profileRaw: string | null | undefined;
let profileSnapshot: CustomerProfile = EMPTY_PROFILE;

function emitProfile() {
  for (const listener of profileListeners) {
    listener();
  }
}

export function readProfile(): CustomerProfile {
  if (typeof window === "undefined") {
    return emptyProfile();
  }
  return parseProfile(window.localStorage.getItem(PROFILE_STORAGE_KEY));
}

export function getProfileSnapshot(): CustomerProfile {
  if (typeof window === "undefined") {
    return EMPTY_PROFILE;
  }

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (raw === profileRaw) {
    return profileSnapshot;
  }

  profileRaw = raw;
  profileSnapshot = parseProfile(raw);
  return profileSnapshot;
}

export function getServerProfileSnapshot(): CustomerProfile {
  return EMPTY_PROFILE;
}

export function subscribeProfile(onStoreChange: () => void) {
  profileListeners.add(onStoreChange);
  function onStorage(event: StorageEvent) {
    if (event.key !== PROFILE_STORAGE_KEY && event.key !== null) {
      return;
    }
    profileRaw = undefined;
    onStoreChange();
  }
  window.addEventListener("storage", onStorage);
  return () => {
    profileListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function persistProfile(profile: CustomerProfile) {
  if (typeof window === "undefined") {
    return;
  }
  const next: CustomerProfile = {
    name: profile.name.trim(),
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    address: profile.address.trim(),
  };
  const raw = JSON.stringify(next);
  window.localStorage.setItem(PROFILE_STORAGE_KEY, raw);
  profileRaw = raw;
  profileSnapshot = next;
  emitProfile();
}
