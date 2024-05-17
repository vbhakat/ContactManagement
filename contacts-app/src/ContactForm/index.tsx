import React, { useEffect, useState } from 'react';

export interface ContactFormProps {
    contactToUpdate: Contact | null;
    onSubmit: (contact: Contact) => void;
}
export interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ contactToUpdate, onSubmit }) => {
    const [contact, setContact] = useState<Contact>(
        {
            id: 0,
            name: '',
            email: '',
            phone: '',
            address: '',
        });
    useEffect(() => {
        if (contactToUpdate) {
            setContact(contactToUpdate);
        }
    }, [contactToUpdate]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(contact);
    };
    return (

        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type='text'
                    name="name"
                    value={contact.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                />
                <input
                    type='email'
                    name="email"
                    value={contact.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                <input
                    type='text'
                    name="phone"
                    value={contact.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                />
                <input
                    type='text'
                    name="address"
                    value={contact.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                />
                <button type='submit'>Add New Contact</button>
            </div>
        </form>

    )
}

export default ContactForm;
