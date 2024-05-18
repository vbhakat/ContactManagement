import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import ContactForm, { Contact, ContactFormProps } from 'ContactForm';

describe('ContactForm', () => {
    const mockOnSubmit = jest.fn();
    const contactToUpdate: Contact = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
    };

    const renderContactForm = (props: Partial<ContactFormProps> = {}) => {
        const defaultProps: ContactFormProps = {
            openModal: true,
            contactToUpdate: null,
            onSubmit: mockOnSubmit,
            action: 'add',
            setShowModal: jest.fn(),
        };
        return render(<ContactForm {...defaultProps} {...props} />);
    };

    test('submits the form with valid contact data', () => {
        renderContactForm();

        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '9876543210' } });
        fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '456 Another St' } });

        fireEvent.click(screen.getByRole('button', { name: 'Add New Contact' }));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            id: 0,
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '9876543210',
            address: '456 Another St'
        });
    });    
    test('submits the form to update an existing contact', () => {
        renderContactForm({ action: 'update', contactToUpdate });
    
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '9876543210' } });
        fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '456 Another St' } });
    
        fireEvent.click(screen.getByRole('button', { name: 'Update Contact' }));
    
        expect(mockOnSubmit).toHaveBeenCalledWith({
            id: 1,
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '9876543210',
            address: '456 Another St'
        });
    });    
    
    test('does not render the modal when openModal is false', () => {
        renderContactForm({ openModal: false });
    
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });    
                
});
