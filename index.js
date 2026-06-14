import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id == id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.get('/api/persons', (req, res) => res.json(persons));

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
});

app.post('/api/persons', async (req, res) => {
    const id = persons.length + 1;
    const body = req.body;
    console.log(body);
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'No content' });
    }

    if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: id,
    };
    persons = persons.concat(person);
    res.json(person);
});

app.get('/info', (req, res) => {
    const d = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${d.toString()}</p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
