import { apiRequest } from "./client";

/**
 * NOTE:
 * The current backend OpenAPI only exposes GET / (health).
 * The functions below are structured to match upcoming endpoints and can be wired
 * without touching UI code later.
 */

// PUBLIC_INTERFACE
export async function healthCheck() {
  /** Call backend health check. */
  return apiRequest("/", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function listAccessories({ q } = {}) {
  /** List accessories; currently returns demo data until backend exists. */
  // Future: return apiRequest(`/accessories${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  const demo = demoAccessories();
  if (!q) return demo;
  const ql = q.toLowerCase();
  return demo.filter(
    (a) => a.name.toLowerCase().includes(ql) || a.category.toLowerCase().includes(ql)
  );
}

// PUBLIC_INTERFACE
export async function getAccessoryById(id) {
  /** Fetch a single accessory by id; currently returns demo data until backend exists. */
  // Future: return apiRequest(`/accessories/${id}`);
  const found = demoAccessories().find((a) => a.id === id);
  if (!found) {
    const e = new Error("Accessory not found");
    e.status = 404;
    throw e;
  }
  return found;
}

// PUBLIC_INTERFACE
export async function registerUser({ email, password }) {
  /** Register user; placeholder until backend auth endpoints exist. */
  // Future: return apiRequest("/auth/register", { method: "POST", body: { email, password } });
  await sleep(400);
  return { token: "demo-token", user: { email, role: email.includes("admin") ? "admin" : "user" } };
}

// PUBLIC_INTERFACE
export async function loginUser({ email, password }) {
  /** Login user; placeholder until backend auth endpoints exist. */
  // Future: return apiRequest("/auth/login", { method: "POST", body: { email, password } });
  await sleep(300);
  if (!email || !password) throw new Error("Email and password are required.");
  return { token: "demo-token", user: { email, role: email.includes("admin") ? "admin" : "user" } };
}

// PUBLIC_INTERFACE
export async function getMyProfile({ token }) {
  /** Fetch current user profile; placeholder for now. */
  // Future: return apiRequest("/me", { token });
  await sleep(250);
  return { email: "demo@user.com", name: "Demo Rider", address: "1987 Neon Ave", phone: "555-0137" };
}

// PUBLIC_INTERFACE
export async function updateMyProfile({ token, profile }) {
  /** Update current user profile; placeholder for now. */
  // Future: return apiRequest("/me", { method: "PUT", token, body: profile });
  await sleep(350);
  return { ...profile };
}

// PUBLIC_INTERFACE
export async function placeOrder({ token, order }) {
  /** Create an order from the cart; placeholder for now. */
  // Future: return apiRequest("/orders", { method: "POST", token, body: order });
  await sleep(450);
  return {
    id: `ord_${Math.random().toString(16).slice(2, 9)}`,
    status: "PLACED",
    etaMinutes: 42,
    createdAt: new Date().toISOString(),
    ...order,
  };
}

// PUBLIC_INTERFACE
export async function listMyOrders({ token }) {
  /** List orders; placeholder for now. */
  // Future: return apiRequest("/orders", { token });
  await sleep(350);
  return [
    {
      id: "ord_demo_1",
      status: "OUT_FOR_DELIVERY",
      etaMinutes: 12,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      items: [{ id: "a1", name: "Holo Belt Clip", qty: 1, price: 19.99 }],
      total: 19.99,
    },
    {
      id: "ord_demo_2",
      status: "DELIVERED",
      etaMinutes: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      items: [{ id: "a3", name: "Retro Keycap Set", qty: 1, price: 34.5 }],
      total: 34.5,
    },
  ];
}

// PUBLIC_INTERFACE
export async function adminListInventory({ token }) {
  /** Admin inventory list; placeholder for now. */
  // Future: return apiRequest("/admin/inventory", { token });
  await sleep(350);
  return demoAccessories().map((a) => ({ ...a, stock: a.stock ?? 10 }));
}

// PUBLIC_INTERFACE
export async function adminUpdateInventory({ token, id, patch }) {
  /** Admin inventory update; placeholder for now. */
  // Future: return apiRequest(`/admin/inventory/${id}`, { method: "PATCH", token, body: patch });
  await sleep(350);
  return { id, ...patch };
}

// PUBLIC_INTERFACE
export async function adminListOrders({ token }) {
  /** Admin order list; placeholder for now. */
  // Future: return apiRequest("/admin/orders", { token });
  await sleep(350);
  return await listMyOrders({ token });
}

// PUBLIC_INTERFACE
export async function adminUpdateOrderStatus({ token, id, status }) {
  /** Admin order status update; placeholder for now. */
  // Future: return apiRequest(`/admin/orders/${id}/status`, { method: "POST", token, body: { status }});
  await sleep(350);
  return { id, status };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function demoAccessories() {
  return [
    {
      id: "a1",
      name: "Holo Belt Clip",
      category: "Carry",
      price: 19.99,
      rating: 4.7,
      description:
        "A shimmering belt clip that looks straight out of a 1989 catalog. Holds keys, pouches, and good decisions.",
      accent: "primary",
    },
    {
      id: "a2",
      name: "Neon Cable Organizer",
      category: "Desk",
      price: 12.5,
      rating: 4.4,
      description:
        "Tame the spaghetti. Bright neon organizers with satisfying snaps and serious retro vibes.",
      accent: "teal",
    },
    {
      id: "a3",
      name: "Retro Keycap Set",
      category: "Input",
      price: 34.5,
      rating: 4.9,
      description:
        "Chunky, clicky, and wildly nostalgic. Includes the legendary cyan Esc key.",
      accent: "primary",
    },
    {
      id: "a4",
      name: "Synthwave Lanyard",
      category: "Wear",
      price: 9.99,
      rating: 4.2,
      description:
        "Gradient lanyard with a soft-touch strap. Perfect for badges and backstage passes to imaginary concerts.",
      accent: "teal",
    },
    {
      id: "a5",
      name: "Arcade Coin Pouch",
      category: "Carry",
      price: 15.0,
      rating: 4.3,
      description:
        "A zip pouch for coins, earbuds, and tiny treasures. Smells faintly like high scores.",
      accent: "primary",
    },
    {
      id: "a6",
      name: "Glow Sticker Pack",
      category: "Decor",
      price: 6.75,
      rating: 4.6,
      description:
        "Assorted holographic stickers. Adds +2 charisma to laptops and water bottles.",
      accent: "teal",
    },
  ];
}
