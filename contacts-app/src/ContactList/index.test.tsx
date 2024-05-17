import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ContactList } from 'ContactList';

global.fetch = jest.fn();

describe('ContactList Component', () => {
    const contacts = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789', address: '123 Main St' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987654321', address: '456 Elm St' }
    ];

    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    test('fetches and displays contacts', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => contacts,
        });

        render(<ContactList />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();            
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:4000/contacts');
    });

    test('handles adding a new contact', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => contacts,
        });

        render(<ContactList />);        
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();            
        });
        await waitFor(() => {            
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });        
        fireEvent.click(screen.getByText('Add New Contacts'));
        
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'New Contact' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '123123123' } });
        fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '789 Oak St' } });
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({
                id: 3, name: 'New Contact', email: 'new@example.com', phone: '123123123', address: '789 Oak St'
            }),
        });
        
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => [...contacts, { id: 3, name: 'New Contact', email: 'new@example.com', phone: '123123123', address: '789 Oak St' }],
        });
        fireEvent.click(screen.getByText('Add New Contact'));
        await waitFor(() => {
            expect(screen.getByText('New Contact')).toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:4000/contacts',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    id: 3, name: 'New Contact', email: 'new@example.com', phone: '123123123', address: '789 Oak St'
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
        );
        expect(fetch).toHaveBeenCalledWith('http://localhost:4000/contacts');
    });

    test('handles updating a contact', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => contacts,
        });

        render(<ContactList />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();        
        });
        await waitFor(() => {            
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Edit this Contact')[0]);
        expect(screen.getByPlaceholderText('Name')).toHaveValue('John Doe');
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Updated Name' } });
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ ...contacts[0], name: 'Updated Name' }),
        });

        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => [
                { ...contacts[0], name: 'Updated Name' },
                contacts[1]
            ],
        });

        fireEvent.click(screen.getByText('Add New Contact'));
        await waitFor(() => {
            expect(screen.getByText('Updated Name')).toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledWith(
            `http://localhost:4000/contacts/${contacts[0].id}`,
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify({ ...contacts[0], name: 'Updated Name' }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
        );
        expect(fetch).toHaveBeenCalledWith('http://localhost:4000/contacts');
    });    
});
