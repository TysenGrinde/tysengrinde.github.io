const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors({
    origin: 'http://localhost:3000'  // or whatever your frontend URL is
  }));
app.use(express.json());

// connect to db file
const db = new Database(path.resolve(__dirname, "database.db"));

// Create tables
db.prepare(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    interests TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS ambassadors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    website TEXT
)`).run();

// Populate ambassadors if empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM ambassadors');
const count = countStmt.get().count;

if (count === 0) {
    const ambassadors = [
        { name: 'Whoop', description: 'Performance tracking ambassador', website: 'https://www.whoop.com' },
        { name: 'Blender Bottle', description: 'Fitness nutrition ambassador', website: 'https://www.blenderbottle.com' },
        { name: 'VKTRY Gear', description: 'Athletic performance gear ambassador', website: 'https://www.vktrygear.com' },
        { name: 'Three Sixty Six', description: 'Athletic apparel ambassador', website: 'https://www.threesixsix.com' }
    ];

    const insertStmt = db.prepare('INSERT INTO ambassadors (name, description, website) VALUES (?, ?, ?)');
    const insertMany = db.transaction((brands) => {
        for (const brand of brands) {
            insertStmt.run(brand.name, brand.description, brand.website);
        }
    });
    insertMany(ambassadors);
}

// API Routes
app.get('/api/ambassadors', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM ambassadors');
        const rows = stmt.all();
        res.json({ brands: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/contacts', (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        // Base query
        let query = 'SELECT * FROM contacts';
        let countQuery = 'SELECT COUNT(*) as total FROM contacts';
        let params = [];

        // Add sorting and pagination
        query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
        
        // Calculate offset
        const offset = (parseInt(page) - 1) * parseInt(limit);
        params.push(parseInt(limit), offset);

        // Prepare and execute statements
        const stmt = db.prepare(query);
        const countStmt = db.prepare(countQuery);
        
        const rows = stmt.all(...params);
        const totalCount = countStmt.get(...params.slice(0, -2)).total;

        res.json({
            contacts: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message, interests } = req.body;

        const stmt = db.prepare(`
            INSERT INTO contacts 
            (name, email, message, interests) 
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(
            name, 
            email, 
            message, 
            interests && Array.isArray(interests) ? interests.join(', ') : ''
        );

        res.status(200).json({ message: 'Contact submission successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/contact/:id', (req, res) => {
    try {
        const { id } = req.params;

        const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            res.status(200).json({ message: 'Contact deleted successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/resume", (req, res) => {
    const resumeData = {
      name: "Tysen Grinde",
      education: [
        {
          institution: "Dakota State University",
          degree: "B.Sc. in Software Engineering",
          year: "2025",
        },
      ],
      experience: [
        {
          role: "Ambassador",
          company: "Blender Bottle",
          duration: "2023-Present",
          description: "Promoting products on social media and at events.",
        },
        {
          role: "Intern",
          company: "(Hasn't Happened Yet)",
          duration: "Summer 2025",
          description: "description",
        },
      ],
      skills: ["JavaScript", "React", "Python", "Photoshop"],
      certifications: [
        {
          name: "Kahn Academny",
          year: "2024",
        },
      ],
    };
    res.json(resumeData);
  });

// Catch-all route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});