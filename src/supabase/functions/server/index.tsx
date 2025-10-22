import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase clients
const getSupabaseAdmin = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const getSupabaseClient = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
);

// Allowed team members with their roles
const ALLOWED_USERS = [
  { email: 'sanathk@ayudost.com', name: 'Sanath K', role: 'Team Leader' },
  { email: 'rajathkirana@ayudost.com', name: 'Rajath Kiran A', role: 'Backend' },
  { email: 'rithesh@ayudost.com', name: 'Rithesh', role: 'AI/ML' },
  { email: 'sheethal@ayudost.com', name: 'Sheethal D Rai', role: 'Frontend' },
];

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a56a7689/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint - restricted to allowed emails
app.post("/make-server-a56a7689/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // Validate email is in allowed list
    const allowedUser = ALLOWED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!allowedUser) {
      return c.json({ 
        error: 'Only AyuDost team members can sign up. Please use your @ayudost.com email.' 
      }, 403);
    }

    // Create user with Supabase Auth
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      user_metadata: { 
        name: name || allowedUser.name,
        role: allowedUser.role,
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: email.toLowerCase(),
      name: name || allowedUser.name,
      role: allowedUser.role,
      createdAt: new Date().toISOString(),
    });

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: email.toLowerCase(),
        name: name || allowedUser.name,
        role: allowedUser.role,
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Get current user profile
app.get("/make-server-a56a7689/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user:${user.id}`);
    
    return c.json({ 
      user: profile || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role,
      }
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Send a chat message
app.post("/make-server-a56a7689/chat/message", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { message, channel } = await c.req.json();

    if (!message || !channel) {
      return c.json({ error: 'Message and channel are required' }, 400);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${user.id}`);

    const messageData = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: userProfile?.name || user.user_metadata?.name || 'Unknown User',
      userRole: userProfile?.role || user.user_metadata?.role || 'Team Member',
      message,
      channel,
      timestamp: new Date().toISOString(),
    };

    // Store message in KV store
    await kv.set(`chat:${channel}:${messageData.id}`, messageData);

    return c.json({ success: true, message: messageData });
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get chat messages for a channel
app.get("/make-server-a56a7689/chat/messages/:channel", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const channel = c.req.param('channel');
    
    // Get all messages for this channel
    const messages = await kv.getByPrefix(`chat:${channel}:`);
    
    // Sort by timestamp (newest first)
    const sortedMessages = messages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return c.json({ messages: sortedMessages });
  } catch (error) {
    console.error('Error getting messages:', error);
    return c.json({ error: 'Failed to get messages' }, 500);
  }
});

// Delete a chat message
app.delete("/make-server-a56a7689/chat/message/:messageId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const messageId = c.req.param('messageId');
    const { channel } = await c.req.json();

    // Delete the message
    await kv.del(`chat:${channel}:${messageId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return c.json({ error: 'Failed to delete message' }, 500);
  }
});

Deno.serve(app.fetch);
