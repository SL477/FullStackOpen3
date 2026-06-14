import express from 'express';
import morgan from 'morgan';
import { PhoneNumber } from './models/phonenumber.js';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

app.get('/api/persons/:id', (req, res, next) => PhoneNumber
    .findById(req.params.id)
    .then(num => {
        if (num) {
            res.json(num);
        } else {
            res.status(404).end();
        }
    }).catch(err => next(err))
);

app.get('/api/persons', (req, res) => {
    PhoneNumber.find({}).then(numbers => res.json(numbers));
});

app.delete('/api/persons/:id', (req, res, next) => {
    PhoneNumber.findByIdAndDelete(req.params.id)
        .then(res => res.status(204).end())
        .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body;
    PhoneNumber.findById(req.params.id)
        .then(num => {
            if (!num) {
                return res.status(404).end();
            }

            num.name = name;
            num.number = number;

            return num.save().then(updatedNum => res.json(updatedNum));
        })
        .catch(error => next(error));
});

app.post('/api/persons', async (req, res, next) => {
    const body = req.body;
    console.log(body);
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'No content' });
    }

    const num = new PhoneNumber({
        number: body.number,
        name: body.name,
    });

    num.save().then(savedNum => res.json(savedNum))
        .catch(err => next(err));
});

app.get('/info', (req, res) => {
    const d = new Date();
    PhoneNumber.find({}).then(numbers => res.send(`<p>Phonebook has info for ${numbers.length} people</p>
        <p>${d.toString()}</p>`)
    );
});

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
