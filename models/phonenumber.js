import mongoose from "mongoose";
import { loadEnvFile } from 'node:process';
loadEnvFile();

const url = process.env.DB;
mongoose.set('strictQuery', false);

mongoose.connect(url, { family: 4 })
    .then(res => console.log('Connected to MongoDB'))
    .catch(err => console.log('error connecting to MongoDB:', err.message));

const phoneNumberSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d{1,}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
});

phoneNumberSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export const PhoneNumber = mongoose.model('PhoneNumber', phoneNumberSchema);
