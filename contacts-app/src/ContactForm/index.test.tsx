import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContactForm, { Contact } from 'ContactForm';

describe('ContactForm Component', () => {
    const mockOnSubmit = jest.fn();
    const contactToUpdate: Contact = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        address: '123 Main St'
    };

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    test('renders form with empty fields initially', () => {
        render(<ContactForm contactToUpdate={null} onSubmit={mockOnSubmit} />);
        
        expect(screen.getByPlaceholderText('Name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Email')).toHaveValue('');
        expect(screen.getByPlaceholderText('Phone')).toHaveValue('');
        expect(screen.getByPlaceholderText('Address')).toHaveValue('');
    });

    test('fills the form with contactToUpdate data', () => {
        render(<ContactForm contactToUpdate={contactToUpdate} onSubmit={mockOnSubmit} />);
        
        expect(screen.getByPlaceholderText('Name')).toHaveValue('John Doe');
        expect(screen.getByPlaceholderText('Email')).toHaveValue('john@example.com');
        expect(screen.getByPlaceholderText('Phone')).toHaveValue('123456789');
        expect(screen.getByPlaceholderText('Address')).toHaveValue('123 Main St');
    });

    test('handles input changes', () => {
        render(<ContactForm contactToUpdate={null} onSubmit={mockOnSubmit} />);

        const nameInput = screen.getByPlaceholderText('Name');
        const emailInput = screen.getByPlaceholderText('Email');
        const phoneInput = screen.getByPlaceholderText('Phone');
        const addressInput = screen.getByPlaceholderText('Address');

        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
        fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
        fireEvent.change(phoneInput, { target: { value: '987654321' } });
        fireEvent.change(addressInput, { target: { value: '456 Another St' } });

        expect(nameInput).toHaveValue('Jane Doe');
        expect(emailInput).toHaveValue('jane@example.com');
        expect(phoneInput).toHaveValue('987654321');
        expect(addressInput).toHaveValue('456 Another St');
    });

    test('submits the form with updated contact data', () => {
        render(<ContactForm contactToUpdate={contactToUpdate} onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '987654321' } });
        fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '456 Another St' } });

        fireEvent.submit(screen.getByRole('button', { name: /add new contact/i }));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            id: 1,
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '987654321',
            address: '456 Another St'
        });
    });
});
