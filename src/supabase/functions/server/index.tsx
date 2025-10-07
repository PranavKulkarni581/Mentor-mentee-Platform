import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

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
app.get("/make-server-84115a1d/health", (c) => {
  return c.json({ status: "ok" });
});

// Mentor Authentication Routes
app.post("/make-server-84115a1d/signup", async (c) => {
  try {
    const { email, password, name, department, contact } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        department, 
        contact,
        role: 'mentor'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional mentor data
    await kv.set(`mentor:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      department,
      contact,
      created_at: new Date().toISOString()
    });

    return c.json({ 
      message: "Mentor account created successfully",
      user: data.user
    });

  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

app.post("/make-server-84115a1d/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Create a temporary Supabase client for auth
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      return c.json({ error: error.message }, 401);
    }

    // Get mentor data
    const mentorData = await kv.get(`mentor:${data.user.id}`);

    return c.json({
      message: "Login successful",
      user: data.user,
      access_token: data.session.access_token,
      mentor: mentorData
    });

  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Mentee Form Submission Routes
app.post("/make-server-84115a1d/mentee/interaction", async (c) => {
  try {
    const formData = await c.req.json();
    
    if (!formData.prn || !formData.name) {
      return c.json({ error: "PRN and name are required" }, 400);
    }

    const submissionId = `interaction:${formData.prn}:${Date.now()}`;
    
    await kv.set(submissionId, {
      type: 'interaction',
      ...formData,
      submitted_at: new Date().toISOString()
    });

    // Also store latest for easy access
    await kv.set(`latest_interaction:${formData.prn}`, {
      type: 'interaction',
      ...formData,
      submitted_at: new Date().toISOString()
    });

    return c.json({ 
      message: "Interaction form submitted successfully",
      id: submissionId
    });

  } catch (error) {
    console.error('Interaction form submission error:', error);
    return c.json({ error: "Failed to submit interaction form" }, 500);
  }
});

app.post("/make-server-84115a1d/mentee/attendance", async (c) => {
  try {
    const formData = await c.req.json();
    
    if (!formData.prn || !formData.name) {
      return c.json({ error: "PRN and name are required" }, 400);
    }

    const submissionId = `attendance:${formData.prn}:${Date.now()}`;
    
    await kv.set(submissionId, {
      type: 'attendance',
      ...formData,
      submitted_at: new Date().toISOString()
    });

    return c.json({ 
      message: "Attendance submitted successfully",
      id: submissionId
    });

  } catch (error) {
    console.error('Attendance submission error:', error);
    return c.json({ error: "Failed to submit attendance" }, 500);
  }
});

app.post("/make-server-84115a1d/mentee/academic", async (c) => {
  try {
    const formData = await c.req.json();
    
    if (!formData.prn || !formData.name) {
      return c.json({ error: "PRN and name are required" }, 400);
    }

    const submissionId = `academic:${formData.prn}:${Date.now()}`;
    
    await kv.set(submissionId, {
      type: 'academic',
      ...formData,
      submitted_at: new Date().toISOString()
    });

    // Also store latest for easy access
    await kv.set(`latest_academic:${formData.prn}`, {
      type: 'academic',
      ...formData,
      submitted_at: new Date().toISOString()
    });

    return c.json({ 
      message: "Academic details submitted successfully",
      id: submissionId
    });

  } catch (error) {
    console.error('Academic form submission error:', error);
    return c.json({ error: "Failed to submit academic form" }, 500);
  }
});

// Mentor Dashboard Routes (Protected)
const authenticateUser = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'Authorization token required' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  await next();
};

app.get("/make-server-84115a1d/mentor/dashboard", authenticateUser, async (c) => {
  try {
    const user = c.get('user');
    const mentorData = await kv.get(`mentor:${user.id}`);

    // Get all mentee data (in a real app, this would be filtered by mentor assignment)
    const interactionData = await kv.getByPrefix('latest_interaction:');
    const academicData = await kv.getByPrefix('latest_academic:');
    const attendanceData = await kv.getByPrefix('attendance:');

    return c.json({
      mentor: mentorData,
      mentees: {
        interactions: interactionData,
        academic: academicData,
        attendance: attendanceData
      }
    });

  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return c.json({ error: "Failed to fetch dashboard data" }, 500);
  }
});

app.get("/make-server-84115a1d/mentor/mentees", authenticateUser, async (c) => {
  try {
    // Get all unique PRNs from submissions
    const interactions = await kv.getByPrefix('latest_interaction:');
    const academics = await kv.getByPrefix('latest_academic:');
    
    const menteeMap = new Map();
    
    // Combine data from both sources
    interactions.forEach(interaction => {
      if (interaction.prn) {
        menteeMap.set(interaction.prn, {
          ...menteeMap.get(interaction.prn),
          ...interaction,
          hasInteraction: true
        });
      }
    });
    
    academics.forEach(academic => {
      if (academic.prn) {
        menteeMap.set(academic.prn, {
          ...menteeMap.get(academic.prn),
          ...academic,
          hasAcademic: true
        });
      }
    });

    const menteesList = Array.from(menteeMap.values());

    return c.json({ mentees: menteesList });

  } catch (error) {
    console.error('Mentees data fetch error:', error);
    return c.json({ error: "Failed to fetch mentees data" }, 500);
  }
});

app.get("/make-server-84115a1d/mentor/mentee/:prn", authenticateUser, async (c) => {
  try {
    const prn = c.req.param('prn');
    
    // Get all data for specific mentee
    const interactions = await kv.getByPrefix(`interaction:${prn}:`);
    const attendance = await kv.getByPrefix(`attendance:${prn}:`);
    const academic = await kv.get(`latest_academic:${prn}`);

    return c.json({
      prn,
      interactions,
      attendance,
      academic
    });

  } catch (error) {
    console.error('Mentee data fetch error:', error);
    return c.json({ error: "Failed to fetch mentee data" }, 500);
  }
});

Deno.serve(app.fetch);