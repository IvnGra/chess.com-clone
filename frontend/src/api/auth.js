const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

async function ensureCsrfCookie() {
  if (getCookie("csrftoken")) {
    return;
  }
  await fetch(`${API_BASE}/api/auth/csrf/`, {
    method: "GET",
    credentials: "include",
  });
}

export async function signup(payload) {
  await ensureCsrfCookie();
  const csrf = getCookie("csrftoken");

  const response = await fetch(`${API_BASE}/api/auth/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function login(payload) {
  await ensureCsrfCookie();
  const csrf = getCookie("csrftoken");

  const response = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function logout() {
  await ensureCsrfCookie();
  const csrf = getCookie("csrftoken");

  const response = await fetch(`${API_BASE}/api/auth/logout/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": csrf,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw data;
  }
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE}/api/auth/me/`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw data;
  }
  return data;
}
