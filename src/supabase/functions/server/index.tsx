import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable CORS for all routes with proper configuration
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

// Enable logging
app.use("*", logger(console.log));

// Request size limiter middleware
app.use("*", async (c, next) => {
  const contentLength = c.req.header("Content-Length");
  if (contentLength) {
    const sizeInMB = parseInt(contentLength) / (1024 * 1024);
    if (sizeInMB > 10) { // 10MB limit
      console.error("❌ Request too large:", sizeInMB.toFixed(2), "MB");
      return c.json({ 
        error: "Request too large", 
        message: "Request size must be less than 10MB",
        currentSize: `${sizeInMB.toFixed(2)}MB`
      }, 413);
    }
  }
  await next();
});

// Global error handler
app.onError((err, c) => {
  console.error("❌ Global error handler caught:", err);
  console.error("Error name:", err.name);
  console.error("Error message:", err.message);
  console.error("Error stack:", err.stack);
  
  // Handle specific error types
  if (err.name === "SyntaxError") {
    return c.json({ 
      error: "Invalid JSON", 
      message: "The request body contains invalid JSON",
      details: err.message
    }, 400);
  }
  
  if (err.message?.includes("connection") || err.message?.includes("timeout")) {
    return c.json({ 
      error: "Connection error", 
      message: "Request timed out or connection was closed",
      details: err.message
    }, 504);
  }
  
  return c.json({ 
    error: "Internal server error", 
    message: err.message,
    details: String(err)
  }, 500);
});

// OPTIONS handler for CORS preflight
app.options("*", (c) => {
  return c.text("", 204);
});

// Health check
app.get("/make-server-3ad4bbb9/health", (c) => {
  console.log("💚 Health check requested");
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    server: "Autumn Store API",
    version: "1.0.1",
  });
});

// Simple echo test endpoint
app.post("/make-server-3ad4bbb9/test-echo", async (c) => {
  try {
    console.log("🔊 Echo test requested");
    const body = await c.req.json();
    console.log("🔊 Echo body:", body);
    return c.json({ 
      success: true, 
      echo: body, 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error("❌ Echo test failed:", error);
    return c.json({ error: "Echo test failed", details: String(error) }, 500);
  }
});

// Supabase client initialization (using service role key for admin operations)
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials!");
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============= PRODUCTS =============

// Get all products
app.get("/make-server-3ad4bbb9/products", async (c) => {
  try {
    console.log("📋 Fetching all products...");
    const products = await kv.getByPrefix("product:");
    console.log(`✅ Found ${products.length} products`);
    return c.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return c.json({ error: "Failed to fetch products", details: String(error) }, 500);
  }
});

// Get single product
app.get("/make-server-3ad4bbb9/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await kv.get(`product:${id}`);

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return c.json({ error: "Failed to fetch product" }, 500);
  }
});

// Create product (admin only)
app.post("/make-server-3ad4bbb9/products", async (c) => {
  try {
    console.log("📥 Received product creation request");
    
    // Validate content-type
    const contentType = c.req.header("Content-Type");
    if (!contentType?.includes("application/json")) {
      console.error("❌ Invalid content-type:", contentType);
      return c.json({ error: "Content-Type must be application/json" }, 400);
    }

    let body;
    try {
      body = await c.req.json();
      console.log("📦 Request body received");
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return c.json({ error: "Invalid JSON in request body", details: String(parseError) }, 400);
    }
    
    const { name, price, description, image, category, colors, sizes } = body;

    // Validate required fields
    if (!name || !price || !image || !category) {
      console.error("❌ Missing required fields");
      return c.json({ error: "Missing required fields: name, price, image, category" }, 400);
    }

    // Validate image size (if it's base64)
    if (typeof image === 'string' && image.startsWith('data:image')) {
      const imageSizeInMB = (image.length * 0.75) / (1024 * 1024);
      if (imageSizeInMB > 5) {
        console.error("❌ Image too large:", imageSizeInMB.toFixed(2), "MB");
        return c.json({ 
          error: "Image too large", 
          message: "Image size must be less than 5MB",
          currentSize: `${imageSizeInMB.toFixed(2)}MB`
        }, 400);
      }
      console.log("✅ Image size OK:", imageSizeInMB.toFixed(2), "MB");
    }

    // Generate unique ID
    const id = crypto.randomUUID();
    console.log("🆔 Generated product ID:", id);

    const product = {
      id,
      name: String(name),
      price: parseFloat(price),
      description: description || "",
      image: String(image),
      category: String(category),
      colors: colors || "",
      sizes: sizes || "",
      createdAt: new Date().toISOString(),
    };

    console.log("💾 Saving product...");
    await kv.set(`product:${id}`, product);
    console.log("✅ Product saved successfully");

    return c.json({ success: true, product }, 201);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return c.json({ error: "Failed to create product", details: String(error) }, 500);
  }
});

// Update product (admin only)
app.put("/make-server-3ad4bbb9/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }

    const updatedProduct = {
      ...existingProduct,
      ...body,
      id, // Ensure ID doesn't change
      price: parseFloat(body.price),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${id}`, updatedProduct);

    return c.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// Delete product (admin only)
app.delete("/make-server-3ad4bbb9/products/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: "Product not found" }, 404);
    }

    await kv.del(`product:${id}`);

    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

// ============= ORDERS =============

// Get all orders (admin only)
app.get("/make-server-3ad4bbb9/orders", async (c) => {
  try {
    const orders = await kv.getByPrefix("order:");
    // Sort by date, newest first
    orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    return c.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Get single order
app.get("/make-server-3ad4bbb9/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const order = await kv.get(`order:${id}`);

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    return c.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return c.json({ error: "Failed to fetch order" }, 500);
  }
});

// Update order status (admin only)
app.patch("/make-server-3ad4bbb9/orders/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { status } = await c.req.json();

    const order = await kv.get(`order:${id}`);
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${id}`, updatedOrder);

    return c.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return c.json({ error: "Failed to update order status" }, 500);
  }
});

// Delete order (admin only)
app.delete("/make-server-3ad4bbb9/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const existingOrder = await kv.get(`order:${id}`);
    if (!existingOrder) {
      return c.json({ error: "Order not found" }, 404);
    }

    await kv.del(`order:${id}`);

    return c.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return c.json({ error: "Failed to delete order" }, 500);
  }
});

// ============= INVOICES =============

// Get all invoices (admin only)
app.get("/make-server-3ad4bbb9/invoices", async (c) => {
  try {
    const invoices = await kv.getByPrefix("invoice:");
    // Sort by date, newest first
    invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return c.json({ error: "Failed to fetch invoices" }, 500);
  }
});

// Get single invoice
app.get("/make-server-3ad4bbb9/invoices/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const invoice = await kv.get(`invoice:${id}`);

    if (!invoice) {
      return c.json({ error: "Invoice not found" }, 404);
    }

    return c.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return c.json({ error: "Failed to fetch invoice" }, 500);
  }
});

// Helper function to send email notification to admin
async function sendOrderNotificationEmail(order: any) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY")?.trim();
    const adminEmail = "manhhoangquan5@gmail.com";

    console.log('📧 Attempting to send order notification email...');

    if (!resendApiKey || !adminEmail) {
      console.error("❌ Email configuration missing");
      return;
    }

    if (!resendApiKey.startsWith('re_')) {
      console.error('❌ Invalid RESEND_API_KEY format');
      return;
    }

    // Build items list HTML
    const itemsHtml = order.items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br>
          ${item.color ? `<span style="color: #6b7280;">Màu: ${item.color}</span><br>` : ""}
          ${item.size ? `<span style="color: #6b7280;">Size: ${item.size}</span><br>` : ""}
          <span style="color: #6b7280;">Số lượng: ${item.quantity}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">€${item.price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>€${(item.price * item.quantity).toFixed(2)}</strong></td>
      </tr>
    `,
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fce7f3 0%, #fed7aa 50%, #fef3c7 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #6b7280; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #be185d;">🛍️ Đơn Hàng Mới</h1>
              <p style="margin: 10px 0 0 0; color: #be185d;">Autumn Store</p>
            </div>
            
            <div class="content">
              <h2 style="color: #be185d; border-bottom: 2px solid #fce7f3; padding-bottom: 10px;">Thông Tin Đơn Hàng</h2>
              
              <div class="info-row">
                <span class="label">Mã đơn hàng:</span> <strong style="color: #be185d;">${order.id}</strong>
              </div>
              <div class="info-row">
                <span class="label">Ngày đặt:</span> ${new Date(order.orderDate).toLocaleString("vi-VN")}
              </div>
              <div class="info-row">
                <span class="label">Phương thức thanh toán:</span> ${order.paymentMethod === "bank" ? "🏦 Chuyển khoản" : "💳 PayPal"}
              </div>
              
              <h3 style="color: #be185d; margin-top: 30px; border-bottom: 2px solid #fce7f3; padding-bottom: 10px;">Khách Hàng</h3>
              
              <div class="info-row">
                <span class="label">Họ tên:</span> ${order.customerName}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> ${order.email}
              </div>
              <div class="info-row">
                <span class="label">Địa chỉ:</span> ${order.street} ${order.houseNumber}, ${order.postalCode} ${order.city}
              </div>
              
              <h3 style="color: #be185d; margin-top: 30px; border-bottom: 2px solid #fce7f3; padding-bottom: 10px;">Sản Phẩm</h3>
              
              <table style="border: 1px solid #e5e7eb;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left;">Sản phẩm</th>
                    <th style="padding: 12px; text-align: right;">Đơn giá</th>
                    <th style="padding: 12px; text-align: right;">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="background: #fce7f3;">
                    <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">TỔNG:</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold;">€${order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">Autumn Store - ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Autumn Store <onboarding@resend.dev>',
        to: adminEmail,
        subject: `🛍️ Đơn hàng mới #${order.id} - €${order.total.toFixed(2)}`,
        html: emailHtml,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const result = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(result)}`);
    }

    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error("⚠️ Email notification failed (non-blocking):", error);
    // Don't throw - email failure shouldn't block order creation
  }
}

// Create order
app.post("/make-server-3ad4bbb9/orders", async (c) => {
  try {
    console.log("📦 Creating new order...");
    
    let body;
    try {
      body = await c.req.json();
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return c.json({ error: "Invalid JSON in request body" }, 400);
    }

    const {
      customerName,
      email,
      phone,
      street,
      houseNumber,
      addressExtra,
      postalCode,
      city,
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      userId,
    } = body;

    // Validate required fields
    if (!customerName || !email || !items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ Missing required order fields");
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Generate unique order ID
    const id = `ORD-${Date.now()}-${crypto.randomUUID().substring(0, 8)}`;
    console.log("🆔 Generated order ID:", id);

    const order = {
      id,
      customerName,
      email,
      phone: phone || "",
      street: street || "",
      houseNumber: houseNumber || "",
      addressExtra: addressExtra || "",
      postalCode: postalCode || "",
      city: city || "",
      items,
      subtotal: parseFloat(subtotal) || 0,
      shippingFee: parseFloat(shippingFee) || 0,
      total: parseFloat(total) || 0,
      paymentMethod: paymentMethod || "bank",
      status: "pending",
      orderDate: new Date().toISOString(),
      userId: userId || null,
    };

    console.log("💾 Saving order...");
    await kv.set(`order:${id}`, order);
    console.log("✅ Order saved");

    // Create invoice
    const invoiceId = `INV-${Date.now()}-${crypto.randomUUID().substring(0, 8)}`;
    console.log("🧾 Creating invoice:", invoiceId);
    
    const invoice = {
      id: invoiceId,
      orderId: id,
      customerName,
      email,
      street: street || "",
      houseNumber: houseNumber || "",
      addressExtra: addressExtra || "",
      postalCode: postalCode || "",
      city: city || "",
      items,
      subtotal: parseFloat(subtotal) || 0,
      shippingFee: parseFloat(shippingFee) || 0,
      total: parseFloat(total) || 0,
      createdAt: new Date().toISOString(),
      userId: userId || null,
    };

    await kv.set(`invoice:${invoiceId}`, invoice);
    console.log("✅ Invoice created");

    // Send email notification (non-blocking)
    sendOrderNotificationEmail(order).catch(err => {
      console.error("⚠️ Email error (non-blocking):", err);
    });

    console.log("✅ Order creation completed");
    return c.json({ order, invoice }, 201);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return c.json({ error: "Failed to create order", details: String(error) }, 500);
  }
});

// ============= AUTH =============

// Sign up
app.post("/make-server-3ad4bbb9/signup", async (c) => {
  try {
    const { email, password, name, phone, street, houseNumber, addressExtra, postalCode, city } = await c.req.json();

    console.log("👤 Creating new user account...");
    console.log("📧 Email:", email);
    console.log("👤 Name:", name);
    console.log("🏙️ City:", city);

    // Generate customer number based on city
    const cityPrefix = city
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .substring(0, 2)
      .toUpperCase();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const customerNumber = `${cityPrefix}${randomDigits}`;

    console.log("🎫 Generated customer number:", customerNumber);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        phone: phone || '',
        street: street || '',
        houseNumber: houseNumber || '',
        addressExtra: addressExtra || '',
        postalCode: postalCode || '',
        city: city || '', 
        customerNumber 
      },
      email_confirm: true,
    });

    if (error) {
      console.error("❌ Signup error:", error.message);
      return c.json({ error: error.message }, 400);
    }

    console.log("✅ User created successfully with customer number:", customerNumber);
    return c.json({
      success: true,
      user: data.user,
      customerNumber,
    });
  } catch (error) {
    console.error("❌ Error signing up:", error);
    return c.json({ error: "Failed to sign up" }, 500);
  }
});

// Sign in
app.post("/make-server-3ad4bbb9/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ session });
  } catch (error) {
    console.error("Error signing in:", error);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Get user profile
app.get("/make-server-3ad4bbb9/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ user });
  } catch (error) {
    console.error("Error getting profile:", error);
    return c.json({ error: "Failed to get profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-3ad4bbb9/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { name, phone, street, houseNumber, addressExtra, postalCode, city } =
      await c.req.json();

    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        name,
        phone,
        street,
        houseNumber,
        addressExtra,
        postalCode,
        city,
      },
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// Get user's orders
app.get("/make-server-3ad4bbb9/my-orders", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allOrders = await kv.getByPrefix("order:");
    const userOrders = allOrders.filter((order) => order.userId === user.id);
    userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    return c.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Get user's invoices
app.get("/make-server-3ad4bbb9/my-invoices", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const allInvoices = await kv.getByPrefix("invoice:");
    const userInvoices = allInvoices.filter(
      (invoice) => invoice.userId === user.id,
    );
    userInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json(userInvoices);
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    return c.json({ error: "Failed to fetch invoices" }, 500);
  }
});

// ============= ADMIN ROUTES =============

// Admin login
app.post("/make-server-3ad4bbb9/admin/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (username === "admin" && password === "admin123") {
      return c.json({ success: true, token: "admin-token-123" });
    }

    return c.json({ error: "Invalid credentials" }, 401);
  } catch (error) {
    console.error("Error admin login:", error);
    return c.json({ error: "Failed to login" }, 500);
  }
});

// Get all customers (admin only)
app.get("/make-server-3ad4bbb9/admin/customers", async (c) => {
  try {
    console.log("📋 Fetching customers...");
    
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("❌ Error fetching users:", error);
      return c.json({ error: "Failed to fetch customers", details: error.message }, 500);
    }

    if (!data || !data.users) {
      return c.json({ customers: [] });
    }

    const customers = data.users.map(user => ({
      id: user.id,
      email: user.email || "N/A",
      name: user.user_metadata?.name || "N/A",
      city: user.user_metadata?.city || "N/A",
      customerNumber: user.user_metadata?.customerNumber || "N/A",
      phone: user.user_metadata?.phone || "",
      street: user.user_metadata?.street || "",
      houseNumber: user.user_metadata?.houseNumber || "",
      postalCode: user.user_metadata?.postalCode || "",
      createdAt: user.created_at,
    }));

    console.log("✅ Returning", customers.length, "customers");
    return c.json({ customers });
  } catch (error) {
    console.error("❌ Exception in customers endpoint:", error);
    return c.json({ error: "Failed to fetch customers", details: String(error) }, 500);
  }
});

// Test email configuration
app.get("/make-server-3ad4bbb9/test-email", async (c) => {
  try {
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    return c.json({
      gmail_user: { exists: !!gmailUser, value: gmailUser || null },
      gmail_app_password: { exists: !!gmailAppPassword, length: gmailAppPassword?.length || 0 },
      admin_email: { exists: !!adminEmail, value: adminEmail || null },
    });
  } catch (error) {
    console.error("Error in test-email route:", error);
    return c.json({ error: "Failed to get email config", details: String(error) }, 500);
  }
});

// 404 handler - must be last
app.notFound((c) => {
  console.log("⚠️ 404 Not Found:", c.req.url);
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

// Start the server
console.log("🚀 Starting Autumn Store API server v1.0.1");
console.log("📍 Server routes: /make-server-3ad4bbb9/*");
console.log("✅ Server ready");

Deno.serve(app.fetch);